from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import networkx as nx
import math
import pickle
import os
import asyncio
from pyproj import Transformer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NER Smart Logistics API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading multimodal graph from disk...")
with open("graph_state.pkl", "rb") as f:
    state = pickle.load(f)
    G = state["G"]
    tree = state["tree"]
    road_nodes = state["road_nodes"]

transformer = Transformer.from_crs("EPSG:4326", "EPSG:32646", always_xy=True)
reverse_transformer = Transformer.from_crs("EPSG:32646", "EPSG:4326", always_xy=True)

class RouteRequest(BaseModel):
    source_lat: float
    source_lon: float
    target_lat: float
    target_lon: float
    allowed_modes: list[str] = ["road", "water", "air", "transshipment", "transshipment_port"]
    user_role: str = "local"
    total_cargo_tons: float = 15.0 
    vehicle_capacity_tons: float = 15.0

class DisasterRequest(BaseModel):
    lat: float
    lon: float
    radius_km: float
    hazard_type: str  
    user_role: str = "government" 

class ResetRequest(BaseModel):
    user_role: str = "government"

def fast_distance(u, v):
    return math.hypot(v[0] - u[0], v[1] - u[1])

@app.post("/disaster")
def trigger_disaster(req: DisasterRequest):
    if req.user_role != "government":
        raise HTTPException(status_code=403, detail="Unauthorized: Only Government NDRF accounts can declare active hazards.")
        
    x, y = transformer.transform(req.lon, req.lat)
    radius_m = req.radius_km * 1000
    
    affected_indices = tree.query_ball_point((x, y), r=radius_m)
    affected_nodes = set([road_nodes[i] for i in affected_indices])
    
    impacted_edges = 0
    for u in affected_nodes:
        if u in G:
            for v in list(G.successors(u) if G.is_directed() else G.neighbors(u)):
                edges = G[u][v].items() if G.is_multigraph() else [(0, G[u][v])]
                for k, d in edges:
                    if d.get("mode") == "road" and d.get("dynamic_time_min") != float('inf'):
                        if G.is_multigraph(): G[u][v][k]["dynamic_time_min"] = float('inf')
                        else: G[u][v]["dynamic_time_min"] = float('inf')
                        impacted_edges += 1
                        
            if G.is_directed():
                for v in list(G.predecessors(u)):
                    edges = G[v][u].items() if G.is_multigraph() else [(0, G[v][u])]
                    for k, d in edges:
                        if d.get("mode") == "road" and d.get("dynamic_time_min") != float('inf'):
                            if G.is_multigraph(): G[v][u][k]["dynamic_time_min"] = float('inf')
                            else: G[v][u]["dynamic_time_min"] = float('inf')
                            impacted_edges += 1
                            
    return {
        "status": "hazard_active",
        "epicenter": {"lat": req.lat, "lon": req.lon},
        "severed_infrastructure_links": impacted_edges
    }

@app.post("/reset")
def reset_network(req: ResetRequest):
    if req.user_role != "government":
        raise HTTPException(status_code=403, detail="Unauthorized: Only Government NDRF accounts can restore infrastructure.")
    
    global G, tree, road_nodes
    
    with open("graph_state.pkl", "rb") as f:
        state = pickle.load(f)
        G = state["G"]
        tree = state["tree"]
        road_nodes = state["road_nodes"]
        
    return {"status": "success", "message": "All infrastructure links restored."}

@app.post("/route")
def calculate_route(req: RouteRequest):
    try:
        src_x, src_y = transformer.transform(req.source_lon, req.source_lat)
        tgt_x, tgt_y = transformer.transform(req.target_lon, req.target_lat)
        
        _, src_indices = tree.query((src_x, src_y), k=20)
        source_node = next((road_nodes[i] for i in src_indices if road_nodes[i] in G), None)
        
        _, tgt_indices = tree.query((tgt_x, tgt_y), k=20)
        target_node = next((road_nodes[i] for i in tgt_indices if road_nodes[i] in G), None)
        
        if not source_node or not target_node:
            raise HTTPException(status_code=400, detail="Coordinates outside mapped network.")
            
        def ideal_weight(u, v, edge_data):
            if edge_data.get("mode") not in req.allowed_modes: return None
            return fast_distance(u, v)
            
        ideal_path = nx.astar_path(
            G, source=source_node, target=target_node, 
            heuristic=fast_distance, weight=ideal_weight
        )
        
        route_coordinates = []
        total_time_min = 0.0
        modal_breakdown = {}
        hit_disaster = False
        staging_node = None
        
        for i in range(len(ideal_path) - 1):
            u, v = ideal_path[i], ideal_path[i+1]
            
            # Safely grab edge data whether it is a MultiDiGraph or not
            edge_data = list(G[u][v].values())[0] if G.is_multigraph() else G[u][v]
            
            if edge_data.get("dynamic_time_min") == float('inf'):
                hit_disaster = True
                staging_node = u
                break
                
            time_cost = edge_data.get("dynamic_time_min", fast_distance(u, v) / 1000.0)
            total_time_min += time_cost
            mode = edge_data.get("mode", "road")
            modal_breakdown[mode] = modal_breakdown.get(mode, 0) + 1
            
            gps_lon, gps_lat = reverse_transformer.transform(u[0], u[1])
            route_coordinates.append({
                "lat": round(gps_lat, 6), "lng": round(gps_lon, 6), "mode": mode
            })

        # Fleet Calculation
        fleet_size = math.ceil(req.total_cargo_tons / req.vehicle_capacity_tons)
        dispatch_manifest = {
            "requested_by_role": req.user_role,
            "total_cargo_tons": req.total_cargo_tons,
            "required_trucks": fleet_size,
            "batch_dispatch_intervals": "Every 15 minutes",
            "fleet_capacity_utilization": f"{round((req.total_cargo_tons / (fleet_size * req.vehicle_capacity_tons)) * 100, 1)}%" if fleet_size > 0 else "0%"
        }
            
        if hit_disaster:
            stg_lon, stg_lat = reverse_transformer.transform(staging_node[0], staging_node[1])
            airdrop_dist_km = round(fast_distance(staging_node, target_node) / 1000.0, 2)
            return {
                "status": "partial_isolation_warning",
                "message": "Direct transport access severed by disaster. Forward staging route calculated.",
                "total_ground_time_minutes": round(total_time_min, 2),
                "dispatch_manifest": dispatch_manifest,
                "ground_route_coordinates": route_coordinates,
                "staging_point": {"lat": round(stg_lat, 6), "lng": round(stg_lon, 6)},
                "airdrop_vector": {
                    "from": {"lat": round(stg_lat, 6), "lng": round(stg_lon, 6)},
                    "to": {"lat": req.target_lat, "lng": req.target_lon},
                    "line_of_sight_distance_km": airdrop_dist_km,
                    "recommended_mode": "Helicopter Airdrop / Heavy Drone"
                }
            }
        else:
            gps_lon, gps_lat = reverse_transformer.transform(target_node[0], target_node[1])
            route_coordinates.append({"lat": round(gps_lat, 6), "lng": round(gps_lon, 6), "mode": "road"})
            return {
                "status": "success",
                "total_travel_time_minutes": round(total_time_min, 2),
                "transit_segments": len(ideal_path),
                "dispatch_manifest": dispatch_manifest,
                "modal_breakdown": modal_breakdown,
                "coordinates": route_coordinates
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")

@app.on_event("startup")
async def startup_event():
    pass