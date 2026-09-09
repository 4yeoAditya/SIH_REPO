let map;
let currentLayers = [];
let activeRole = "";
let fleetChartInstance = null;
let weatherPollHandle = null;
let fleetPollHandle = null;
let waypointCounter = 0;
let currentDriverId = null;

const cityCoords = {
  // Assam
  "guwahati, assam": { lat: 26.1445, lon: 91.7362 },
  "dibrugarh, assam": { lat: 27.4728, lon: 94.912 },
  "jorhat, assam": { lat: 26.7509, lon: 94.2037 },
  "silchar, assam": { lat: 24.8333, lon: 92.7789 },
  "tezpur, assam": { lat: 26.6528, lon: 92.7926 },
  "nagaon, assam": { lat: 26.3479, lon: 92.684 },
  "tinsukia, assam": { lat: 27.4898, lon: 95.3597 },
  "sivasagar, assam": { lat: 26.985, lon: 94.637 },
  "dhubri, assam": { lat: 26.02, lon: 89.985 },
  "goalpara, assam": { lat: 26.166, lon: 90.626 },
  "barpeta, assam": { lat: 26.322, lon: 91.006 },
  "nalbari, assam": { lat: 26.446, lon: 91.439 },
  "bongaigaon, assam": { lat: 26.477, lon: 90.556 },
  "karimganj, assam": { lat: 24.87, lon: 92.355 },
  "hailakandi, assam": { lat: 24.684, lon: 92.563 },
  "diphu, assam": { lat: 25.844, lon: 93.429 },
  "haflong, assam": { lat: 25.166, lon: 93.017 },
  "north lakhimpur, assam": { lat: 27.236, lon: 94.105 },
  "golaghat, assam": { lat: 26.515, lon: 93.966 },
  "morigaon, assam": { lat: 26.252, lon: 92.342 },
  "kokrajhar, assam": { lat: 26.401, lon: 90.272 },
  "mangaldoi, assam": { lat: 26.439, lon: 92.033 },

  // Arunachal Pradesh
  "itanagar, arunachal pradesh": { lat: 27.0844, lon: 93.6053 },
  "anini, arunachal pradesh": { lat: 28.795, lon: 95.9056 },
  "tawang, arunachal pradesh": { lat: 27.5861, lon: 91.8594 },
  "naharlagun, arunachal pradesh": { lat: 27.104, lon: 93.696 },
  "bomdila, arunachal pradesh": { lat: 27.265, lon: 92.416 },
  "ziro, arunachal pradesh": { lat: 27.548, lon: 93.832 },
  "along, arunachal pradesh": { lat: 28.167, lon: 94.802 },
  "pasighat, arunachal pradesh": { lat: 28.067, lon: 95.326 },
  "tezu, arunachal pradesh": { lat: 27.92, lon: 96.129 },
  "roing, arunachal pradesh": { lat: 28.142, lon: 95.842 },
  "changlang, arunachal pradesh": { lat: 27.13, lon: 95.658 },
  "khonsa, arunachal pradesh": { lat: 27.023, lon: 95.571 },
  "namsai, arunachal pradesh": { lat: 27.596, lon: 95.758 },
  "seppa, arunachal pradesh": { lat: 27.262, lon: 92.956 },
  "yingkiong, arunachal pradesh": { lat: 28.654, lon: 95.047 },

  // Manipur
  "imphal, manipur": { lat: 24.817, lon: 93.9368 },
  "thoubal, manipur": { lat: 24.642, lon: 93.999 },
  "bishnupur, manipur": { lat: 24.633, lon: 93.758 },
  "churachandpur, manipur": { lat: 24.333, lon: 93.683 },
  "ukhrul, manipur": { lat: 25.048, lon: 94.36 },
  "senapati, manipur": { lat: 25.266, lon: 94.023 },
  "tamenglong, manipur": { lat: 24.983, lon: 93.5 },
  "kakching, manipur": { lat: 24.495, lon: 93.982 },
  "jiribam, manipur": { lat: 24.806, lon: 93.117 },
  "moreh, manipur": { lat: 24.23, lon: 94.305 },

  // Meghalaya
  "shillong, meghalaya": { lat: 25.5788, lon: 91.8933 },
  "tura, meghalaya": { lat: 25.514, lon: 90.203 },
  "jowai, meghalaya": { lat: 25.45, lon: 92.2 },
  "nongstoin, meghalaya": { lat: 25.519, lon: 91.266 },
  "williamnagar, meghalaya": { lat: 25.483, lon: 90.617 },
  "baghmara, meghalaya": { lat: 25.193, lon: 90.63 },
  "mairang, meghalaya": { lat: 25.567, lon: 91.583 },
  "resubelpara, meghalaya": { lat: 25.63, lon: 90.63 },

  // Mizoram
  "aizawl, mizoram": { lat: 23.7307, lon: 92.7173 },
  "lunglei, mizoram": { lat: 22.888, lon: 92.737 },
  "champhai, mizoram": { lat: 23.456, lon: 93.328 },
  "serchhip, mizoram": { lat: 23.3, lon: 92.85 },
  "kolasib, mizoram": { lat: 24.223, lon: 92.677 },
  "saiha, mizoram": { lat: 22.489, lon: 92.974 },
  "mamit, mizoram": { lat: 23.93, lon: 92.533 },
  "lawngtlai, mizoram": { lat: 22.529, lon: 92.894 },

  // Nagaland
  "kohima, nagaland": { lat: 25.6751, lon: 94.1086 },
  "dimapur, nagaland": { lat: 25.8898, lon: 93.7226 },
  "mokokchung, nagaland": { lat: 26.323, lon: 94.521 },
  "tuensang, nagaland": { lat: 26.266, lon: 94.833 },
  "wokha, nagaland": { lat: 26.1, lon: 94.267 },
  "zunheboto, nagaland": { lat: 26.0, lon: 94.517 },
  "phek, nagaland": { lat: 25.667, lon: 94.517 },
  "mon, nagaland": { lat: 26.75, lon: 95.067 },
  "peren, nagaland": { lat: 25.517, lon: 93.733 },
  "kiphire, nagaland": { lat: 25.833, lon: 94.783 },
  "longleng, nagaland": { lat: 26.533, lon: 94.833 },

  // Sikkim
  "gangtok, sikkim": { lat: 27.3389, lon: 88.6065 },
  "namchi, sikkim": { lat: 27.166, lon: 88.363 },
  "gyalshing, sikkim": { lat: 27.283, lon: 88.267 },
  "mangan, sikkim": { lat: 27.517, lon: 88.533 },
  "rangpo, sikkim": { lat: 27.167, lon: 88.533 },
  "jorethang, sikkim": { lat: 27.1, lon: 88.333 },
  "singtam, sikkim": { lat: 27.233, lon: 88.5 },

  // Tripura
  "agartala, tripura": { lat: 23.8315, lon: 91.2868 },
  "udaipur, tripura": { lat: 23.533, lon: 91.483 },
  "dharmanagar, tripura": { lat: 24.367, lon: 92.167 },
  "kailashahar, tripura": { lat: 24.333, lon: 92.0 },
  "belonia, tripura": { lat: 23.25, lon: 91.45 },
  "khowai, tripura": { lat: 24.067, lon: 91.6 },
  "ambassa, tripura": { lat: 23.933, lon: 91.85 },
  "sabroom, tripura": { lat: 23.0, lon: 91.733 },
  "sonamura, tripura": { lat: 23.483, lon: 91.267 },
  "teliamura, tripura": { lat: 23.85, lon: 91.6 },
};

function getCoordinates(inputStr) {
  const search = (inputStr || "").toLowerCase().trim();
  if (!search) return null;
  for (const [key, coords] of Object.entries(cityCoords)) {
    if (key.includes(search)) return coords;
  }
  return null;
}

function toggleLogin() {
  const modal = document.getElementById("login-screen");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function handleLogin(e) {
  if (e) e.preventDefault();
  const user = document.getElementById("username").value.toLowerCase();
  const pass = document.getElementById("password").value;

  if (user === "ndrf" && pass === "admin")
    activateApp("government", "NDRF Command Center");
  else if (user === "ngo" && pass === "1234")
    activateApp("organisation", "Logistics Hub Dashboard");
  else if (user === "driver" && pass === "1234")
    activateApp("local", "Driver Navigation");
  else alert("Invalid credentials");
}

function activateApp(role, title) {
  activeRole = role;
  document.getElementById("landing-page").style.display = "none";
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("navLoginBtn").innerText = "Logout";
  document.getElementById("navLoginBtn").onclick = () => location.reload();

  document.getElementById("app-screen").style.display = "block";
  document.getElementById("roleTitle").innerText = title;

  if (role === "government") {
    document.getElementById("govPanel").classList.remove("hidden");
    loadFleetDrivers();
    if (fleetPollHandle) clearInterval(fleetPollHandle);
    fleetPollHandle = setInterval(loadFleetDrivers, 5000);
  } else {
    document.getElementById("dispatchPanel").classList.remove("hidden");
    if (role === "organisation") {
      document.getElementById("orgInputs").classList.remove("hidden");
      document.getElementById("waypointsPanel").classList.remove("hidden");
      document.getElementById("orgDriverSection").classList.remove("hidden");
      document.getElementById("driverIdSearch").classList.add("hidden");
      loadFleetDrivers();
      if (fleetPollHandle) clearInterval(fleetPollHandle);
      fleetPollHandle = setInterval(loadFleetDrivers, 5000);
    } else if (role === "local") {
      document.getElementById("driverIdSearch").classList.remove("hidden");
      document.getElementById("orgDriverSection").classList.add("hidden");
      if (fleetPollHandle) clearInterval(fleetPollHandle);
      fleetPollHandle = setInterval(driverPoll, 5000);
    }
  }

  document.body.classList.toggle("driver-mode", role === "local");

  if (!map) {
    map = L.map("map").setView([26.14, 91.73], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map,
    );
  } else {
    setTimeout(() => map.invalidateSize(), 150);
  }

  startWeatherTelemetry();
}

function clearMap() {
  currentLayers.forEach((layer) => map.removeLayer(layer));
  currentLayers = [];
  document.getElementById("gmapsLink").classList.add("hidden");
}

// ---------------------------------------------------------------------------
// Fleet Sync Logic & Driver Portal
// ---------------------------------------------------------------------------
async function loadFleetDrivers() {
  try {
    const res = await fetch(`http://127.0.0.1:8000/drivers?role=${activeRole}`);
    if (!res.ok) return;
    const drivers = await res.json();

    if (activeRole === "government") {
      const tbody = document.querySelector("#govDriverTable tbody");
      tbody.innerHTML = drivers
        .map(
          (d) => `
        <tr>
          <td><strong>${d.driver_id}</strong></td>
          <td>${d.ngo_id}</td>
          <td><span class="badge-status badge-${d.status.toLowerCase().replace(/\s+/g, "")}">${d.status}</span></td>
        </tr>
      `,
        )
        .join("");
    } else if (activeRole === "organisation") {
      const tbody = document.querySelector("#ngoDriverTable tbody");
      tbody.innerHTML = drivers
        .map((d) => {
          let actionHtml = "";
          if (d.status === "Airlift Requested") {
            actionHtml = `<button class="mini-btn" onclick="approveAirlift('${d.driver_id}')">Approve</button>`;
          }
          return `
        <tr>
          <td><strong>${d.driver_id}</strong></td>
          <td>${d.destination.split(",")[0]}</td>
          <td>${d.cargo_tons}t (${d.priority.charAt(0).toUpperCase()})</td>
          <td>
            <span class="badge-status badge-${d.status.toLowerCase().replace(/\s+/g, "")}">${d.status}</span>
            ${actionHtml}
          </td>
        </tr>
      `;
        })
        .join("");
    }
  } catch (e) {
    console.error("Fleet sync failed", e);
  }
}

async function dispatchDriverConvoy(e) {
  if (e) e.preventDefault();
  const origin = document.getElementById("locStart").value;
  const destination = document.getElementById("locEnd").value;
  const cargo = parseFloat(document.getElementById("orgCargo").value);
  const priority = document.getElementById("cargoPriority").value;
  const trucks = Math.ceil(cargo / 15.0) || 1;

  const payload = {
    ngo_id: "Logistics Hub Alpha",
    origin: origin,
    destination: destination,
    cargo_tons: cargo,
    priority: priority,
    required_trucks: trucks,
  };

  try {
    const res = await fetch("http://127.0.0.1:8000/dispatch-driver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      const ids = data.records.map((r) => r.driver_id).join(", ");
      alert(
        `Assigned ${trucks} trucks to convoy.\nDriver UIDs: ${ids}\n\nConvoy has been dispatched to the registry.`,
      );
      loadFleetDrivers();
    }
  } catch (err) {
    alert("Backend is offline!");
  }
}

function updateLocalDriverUI(match) {
  document.getElementById("driverMissionTitle").innerText =
    `Mission: ${match.driver_id}`;
  document.getElementById("driverMissionDetails").innerText =
    `Status: ${match.status} | Cargo: ${match.cargo_tons}t`;

  const startBtn = document.getElementById("startTripBtn");
  const endBtn = document.getElementById("endTripBtn");
  startBtn.classList.add("hidden");
  endBtn.classList.add("hidden");

  if (match.status === "Dispatched") {
    startBtn.classList.remove("hidden");
  } else if (match.status === "In Transit") {
    endBtn.classList.remove("hidden");
  }
}

async function loadDriverMission() {
  const enteredId = document
    .getElementById("assignedDriverId")
    .value.trim()
    .toUpperCase();
  try {
    const res = await fetch("http://127.0.0.1:8000/drivers?role=local");
    const drivers = await res.json();
    const match = drivers.find((d) => d.driver_id === enteredId);

    if (match) {
      document.getElementById("locStart").value = match.origin;
      document.getElementById("locEnd").value = match.destination;
      executeRouting();

      currentDriverId = match.driver_id;
      document.getElementById("driverActiveMission").classList.remove("hidden");
      updateLocalDriverUI(match);
    } else {
      alert("Driver ID not found in dispatch manifest.");
    }
  } catch (err) {
    alert("Backend is offline!");
  }
}

async function driverPoll() {
  if (!currentDriverId || activeRole !== "local") return;
  try {
    const res = await fetch("http://127.0.0.1:8000/drivers?role=local");
    const drivers = await res.json();
    const match = drivers.find((d) => d.driver_id === currentDriverId);

    if (match) {
      updateLocalDriverUI(match);

      // Mid-Trip Disaster Check
      if (match.status === "In Transit") {
        const alertRes = await fetch("http://127.0.0.1:8000/alerts");
        const alertData = await alertRes.json();
        if (alertData.active_alerts && alertData.active_alerts.length > 0) {
          document
            .getElementById("driverHazardAlert")
            .classList.remove("hidden");
          document.getElementById("driverHazardText").innerText =
            `${alertData.active_alerts[0].hazard_type} alert triggered! Ground route severed.`;
        } else {
          document.getElementById("driverHazardAlert").classList.add("hidden");
        }
      } else {
        document.getElementById("driverHazardAlert").classList.add("hidden");
      }
    }
  } catch (e) {}
}

async function startDriverTrip() {
  if (!currentDriverId) return;
  try {
    const res = await fetch("http://127.0.0.1:8000/update-driver-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        driver_id: currentDriverId,
        status: "In Transit",
      }),
    });
    if (res.ok) {
      alert(
        `Trip Started! Status updated to 'In Transit' for ${currentDriverId}`,
      );
      driverPoll();
    }
  } catch (e) {
    alert("Backend offline!");
  }
}

async function endDriverTrip() {
  if (!currentDriverId) return;
  try {
    const res = await fetch("http://127.0.0.1:8000/update-driver-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ driver_id: currentDriverId, status: "Delivered" }),
    });
    if (res.ok) {
      alert(
        `Trip Completed! Status updated to 'Delivered' for ${currentDriverId}`,
      );
      driverPoll();
    }
  } catch (e) {
    alert("Backend offline!");
  }
}

async function requestAirlift() {
  if (!currentDriverId) return;
  try {
    const res = await fetch("http://127.0.0.1:8000/update-driver-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        driver_id: currentDriverId,
        status: "Airlift Requested",
      }),
    });
    if (res.ok) {
      alert(`Emergency airlift requested for ${currentDriverId}`);
      document.getElementById("driverHazardAlert").classList.add("hidden");
      driverPoll();
    }
  } catch (e) {
    alert("Backend offline!");
  }
}

async function approveAirlift(driverId) {
  try {
    const res = await fetch("http://127.0.0.1:8000/update-driver-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        driver_id: driverId,
        status: "Airlift Dispatched",
      }),
    });
    if (res.ok) {
      alert(`Drone/Helicopter Dispatched for ${driverId}`);
      loadFleetDrivers();
    }
  } catch (e) {
    alert("Backend offline!");
  }
}

// ---------------------------------------------------------------------------
// Core Disaster & Map Logic
// ---------------------------------------------------------------------------
async function triggerDisaster(e) {
  if (e) e.preventDefault();

  const locName = document.getElementById("disasterLoc").value;
  const hazardType = document.getElementById("hazardType").value;
  const radius = parseFloat(document.getElementById("hazardRadius").value);

  const coords = getCoordinates(locName);
  if (!coords) {
    document.getElementById("manifestOutput").innerText =
      "Error: Please select a valid hazard epicenter from the dropdown.";
    return;
  }

  document.getElementById("manifestOutput").innerText =
    "Simulating infrastructure destruction...";

  try {
    const payload = {
      lat: coords.lat,
      lon: coords.lon,
      radius_km: radius,
      hazard_type: hazardType,
      user_role: activeRole,
    };
    const res = await fetch("http://127.0.0.1:8000/disaster", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(`API Error: ${data.detail}`);
      return;
    }

    const hazardColor = hazardType === "flood" ? "#0ea5e9" : "red";
    const fillColor = hazardType === "flood" ? "#38bdf8" : "#f03";

    const circle = L.circle([coords.lat, coords.lon], {
      color: hazardColor,
      fillColor: fillColor,
      fillOpacity: 0.3,
      radius: radius * 1000,
    }).addTo(map);
    currentLayers.push(circle);

    document.getElementById("manifestOutput").innerText =
      `CRITICAL ALERT: ${hazardType.toUpperCase()} AT ${locName.toUpperCase()}!\nInfrastructure Links Severed: ${data.severed_infrastructure_links}`;
  } catch (err) {
    alert("Backend is offline!");
  }
}

async function resetDisaster(e) {
  if (e) e.preventDefault();
  try {
    const res = await fetch("http://127.0.0.1:8000/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_role: activeRole }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(`API Error: ${data.detail}`);
      return;
    }
    clearMap();
    document.getElementById("manifestOutput").innerText = "Grid Restored.";
  } catch (err) {
    alert("Backend is offline!");
  }
}

function addWaypoint() {
  waypointCounter += 1;
  const id = `waypoint-${waypointCounter}`;
  const row = document.createElement("div");
  row.className = "waypoint-row";
  row.id = id;
  row.innerHTML = `
    <input type="text" list="ne-cities" class="control-input waypoint-input" placeholder="Intermediate stop" autocomplete="off" />
    <button type="button" class="waypoint-remove" onclick="removeWaypoint('${id}')">&times;</button>
  `;
  document.getElementById("waypointsContainer").appendChild(row);
}

function removeWaypoint(id) {
  const row = document.getElementById(id);
  if (row) row.remove();
}

function collectWaypoints() {
  const inputs = document.querySelectorAll(
    "#waypointsContainer .waypoint-input",
  );
  const stops = [];
  inputs.forEach((input) => {
    const val = input.value.trim();
    if (val) stops.push(val);
  });
  return stops;
}

function renderFleetChart(dispatchManifest, vehicleCapacityTons) {
  const canvas = document.getElementById("fleetChart");
  if (!canvas || typeof Chart === "undefined") return;

  const used = dispatchManifest.total_cargo_tons;
  const totalCapacity = dispatchManifest.required_trucks * vehicleCapacityTons;
  const spare = Math.max(totalCapacity - used, 0);

  if (fleetChartInstance) {
    fleetChartInstance.destroy();
  }

  fleetChartInstance = new Chart(canvas.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: ["Cargo loaded (t)", "Spare capacity (t)"],
      datasets: [
        {
          data: [used, spare],
          backgroundColor: ["#ff5a1f", "#2c2d20"],
          borderColor: "#16170e",
          borderWidth: 2,
        },
      ],
    },
    options: {
      cutout: "68%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#ece9dd",
            font: { family: "IBM Plex Mono", size: 11 },
            boxWidth: 10,
            padding: 12,
          },
        },
      },
    },
  });

  document.getElementById("fleetChartCaption").innerText =
    `${used}t loaded across ${dispatchManifest.required_trucks} truck(s) · ${dispatchManifest.fleet_capacity_utilization} utilized`;
}

async function fetchWeather() {
  const panel = document.getElementById("weatherOutput");
  if (!panel) return;
  try {
    const res = await fetch("http://127.0.0.1:8000/weather");
    if (!res.ok) throw new Error("weather endpoint error");
    const data = await res.json();

    const lines = Object.entries(data.readings).map(([state, r]) => {
      const flag = r.alert ? " ⚠" : "";
      return `${state.padEnd(18, " ")} ${r.rainfall_mm_24h.toFixed(1)}mm${flag}`;
    });
    panel.innerText = lines.join("\n");

    const arunachal = data.readings["Arunachal Pradesh"];
    const banner = document.getElementById("weatherAlertBanner");
    if (arunachal && arunachal.alert) {
      banner.classList.remove("hidden");
      banner.innerText = `Rainfall alert: Arunachal Pradesh at ${arunachal.rainfall_mm_24h.toFixed(1)}mm/24h (threshold ${data.alert_threshold_mm}mm)`;
    } else {
      banner.classList.add("hidden");
    }
  } catch (err) {
    panel.innerText = "Weather feed unavailable — backend offline.";
  }
}

function startWeatherTelemetry() {
  fetchWeather();
  if (weatherPollHandle) clearInterval(weatherPollHandle);
  weatherPollHandle = setInterval(fetchWeather, 12000);
}

async function routeLeg(source, target, cargo, vehicleCapacity) {
  const payload = {
    source_lat: source.lat,
    source_lon: source.lon,
    target_lat: target.lat,
    target_lon: target.lon,
    allowed_modes: ["road", "water", "air"],
    user_role: activeRole,
    total_cargo_tons: cargo,
    vehicle_capacity_tons: vehicleCapacity,
  };
  const res = await fetch("http://127.0.0.1:8000/route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.detail || "Routing error");
    err.detail = data.detail;
    throw err;
  }
  return data;
}

async function executeRouting(e) {
  if (e) e.preventDefault();
  clearMap();

  const startName = document.getElementById("locStart").value;
  const endName = document.getElementById("locEnd").value;

  const source = getCoordinates(startName);
  const target = getCoordinates(endName);

  if (!source || !target) {
    document.getElementById("manifestOutput").innerText =
      "Error: Location not found. Please select from the dropdown.";
    return;
  }

  let cargo = 15;
  let priority = "standard";
  const vehicleCapacity = 15.0;
  if (activeRole === "organisation") {
    cargo = parseFloat(document.getElementById("orgCargo").value);
    priority = document.getElementById("cargoPriority").value;
  }

  const waypointNames = activeRole === "organisation" ? collectWaypoints() : [];
  const stopCoords = [source];
  let waypointError = null;
  waypointNames.forEach((name) => {
    const c = getCoordinates(name);
    if (!c) {
      waypointError = name;
    } else {
      stopCoords.push(c);
    }
  });
  stopCoords.push(target);

  if (waypointError) {
    document.getElementById("manifestOutput").innerText =
      `Error: Waypoint "${waypointError}" not found. Please select from the dropdown.`;
    return;
  }

  document.getElementById("manifestOutput").innerText =
    stopCoords.length > 2
      ? `Calculating ${stopCoords.length - 1}-leg route...`
      : "Calculating route...";

  try {
    const legResults = [];
    let totalTime = 0;
    let heldByDisaster = false;
    let combinedManifest = null;
    let combinedStatus = "success";
    let lastAirdropVector = null;

    for (let i = 0; i < stopCoords.length - 1; i++) {
      const leg = await routeLeg(
        stopCoords[i],
        stopCoords[i + 1],
        cargo,
        vehicleCapacity,
      );
      legResults.push(leg);
      combinedManifest = leg.dispatch_manifest || combinedManifest;

      if (leg.status === "partial_isolation_warning") {
        totalTime += leg.total_ground_time_minutes || 0;
        heldByDisaster = true;
        combinedStatus = "partial_isolation_warning";
        lastAirdropVector = leg.airdrop_vector;
        break;
      } else {
        totalTime += leg.total_travel_time_minutes || 0;
      }
    }

    legResults.forEach((leg) => {
      const coords = leg.coordinates || leg.ground_route_coordinates;
      if (coords && coords.length) {
        const latlngs = coords.map((c) => [c.lat, c.lng]);
        const polyline = L.polyline(latlngs, {
          color: "#3b82f6",
          weight: 5,
        }).addTo(map);
        currentLayers.push(polyline);
      }
    });

    if (currentLayers.length) {
      const group = L.featureGroup(currentLayers);
      map.fitBounds(group.getBounds());
    }

    const gmapsUrl = `https://www.google.com/maps/dir/${source.lat},${source.lon}/${waypointNames
      .map((_, idx) => `${stopCoords[idx + 1].lat},${stopCoords[idx + 1].lon}/`)
      .join("")}${target.lat},${target.lon}`;
    const btn = document.getElementById("gmapsLink");
    btn.href = gmapsUrl;
    btn.classList.remove("hidden");

    let manifestOut = {
      status: combinedStatus,
      legs: legResults.length,
      total_travel_time_minutes: Math.round(totalTime * 100) / 100,
      dispatch_manifest: combinedManifest,
    };

    if (heldByDisaster) {
      if (priority === "non_essential") {
        manifestOut.status = "shipment_held";
        manifestOut.message =
          "ROUTE SEVERED. Cargo marked Non-Essential. Shipment held at staging hub to preserve emergency airlift capacity.";
      } else if (lastAirdropVector) {
        manifestOut.message =
          "Direct transport access severed by disaster. Forward staging route calculated.";
        manifestOut.airdrop_vector = lastAirdropVector;

        const v = lastAirdropVector;
        const airLine = L.polyline(
          [
            [v.from.lat, v.from.lng],
            [v.to.lat, v.to.lng],
          ],
          { color: "#ef4444", weight: 3, dashArray: "10, 10" },
        ).addTo(map);
        currentLayers.push(airLine);
        const marker = L.marker([v.from.lat, v.from.lng])
          .addTo(map)
          .bindPopup("<b>Airlift Staging Hub</b>")
          .openPopup();
        currentLayers.push(marker);
      }
    }

    document.getElementById("manifestOutput").innerText = JSON.stringify(
      manifestOut,
      null,
      2,
    );

    if (combinedManifest) {
      renderFleetChart(combinedManifest, vehicleCapacity);
    }
  } catch (err) {
    document.getElementById("manifestOutput").innerText =
      err.detail || "Critical error connecting to the routing engine.";
  }
}
