// CAVE Vehicles View - Apple Aesthetic

import { store } from '../store/appStore.js';

let statusFilter = 'ALL';

export function renderVehiclesView() {
  const currentView = store.currentView;

  if (currentView === 'VEHICLE_DETAIL') {
    return renderVehicleDetail();
  }

  const vehicles = store.vehicles;
  const filtered = statusFilter === 'ALL' ? vehicles : vehicles.filter(v => v.status === statusFilter);

  return `
    <div class="page-container">
      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 28px;">
        <div>
          <div class="label-meta">FLEET CATALOG</div>
          <h1>CAVE FLEET</h1>
        </div>
        <button class="btn-brutal" onclick="window.app.toggleAddVehicleModal(true)">+ ADD VEHICLE</button>
      </div>

      <!-- iOS Segmented Filter Tabs -->
      <div class="tabs-nav">
        ${['ALL', 'AVAILABLE', 'RENTED', 'RETURNING'].map(t => `
          <button class="tab-item ${statusFilter === t ? 'active' : ''}" onclick="window.app.setFleetFilter('${t}')">
            ${t} (${t === 'ALL' ? vehicles.length : vehicles.filter(v => v.status === t).length})
          </button>
        `).join('')}
      </div>

      <!-- Vehicle Grid with Studio Cutouts & Apple Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px;">
        ${filtered.map(v => `
          <div class="panel-brutal clickable-row" style="padding: 0; overflow: hidden; background: #FFFFFF;" onclick="window.app.setView('VEHICLE_DETAIL', { vehicleId: '${v.id}' })">
            
            <!-- Vehicle Cutout Image Box -->
            <div style="height: 200px; width: 100%; background: radial-gradient(circle, #FAFAFC 0%, #EFEFEF 100%); position: relative; display: flex; align-items: center; justify-content: center; padding: 24px;">
              <img src="${v.image}" alt="${v.make} ${v.model}" style="max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 14px 20px rgba(0,0,0,0.18)); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);" />
              <div style="position: absolute; top: 16px; right: 16px;">
                <span class="status-pill status-${v.status.toLowerCase()}"><span class="status-dot"></span>${v.status}</span>
              </div>
              <div style="position: absolute; bottom: 14px; left: 16px; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); padding: 4px 10px; color: #FFF; font-family: var(--font-mono); font-size: 11px; font-weight: 700; border-radius: 6px;">
                ${v.reg}
              </div>
            </div>

            <!-- Vehicle Info -->
            <div style="padding: 24px;">
              <div style="font-size: 22px; font-weight: 800; margin-bottom: 4px; letter-spacing: -0.02em;">${v.make} ${v.model}</div>
              <div class="label-meta" style="color: var(--text-muted);">${v.colour} &bull; ${v.year}</div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color);">
                <span style="color: var(--text-muted); font-size: 13px; font-weight: 500;">${v.mileage.toLocaleString()} mi</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="mono-val" style="font-weight: 800; font-size: 17px; color: #000;">&pound;${v.dailyRate} <span style="font-size: 11px; font-weight: 500; color: var(--text-muted);">/ DAY</span></span>
                  <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="event.stopPropagation(); window.app.openEditVehicleModal('${v.id}')">EDIT</button>
                </div>
              </div>
            </div>

          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderVehicleDetail() {
  const vehicleId = store.selectedVehicleId || 'V001';
  const vehicle = store.vehicles.find(v => v.id === vehicleId) || store.vehicles[0];

  return `
    <div class="page-container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.setView('VEHICLES')">&larr; BACK TO FLEET</button>
        <button class="btn-brutal" onclick="window.app.openEditVehicleModal('${vehicle.id}')">EDIT PRICE & SPECIFICATION</button>
      </div>

      <div class="panel-brutal" style="padding: 0; overflow: hidden; margin-bottom: 24px; background: #FFFFFF;">
        
        <!-- Large Studio Cutout Display -->
        <div style="height: 380px; width: 100%; position: relative; background: radial-gradient(circle, #FAFAFC 0%, #EAEAEA 100%); display: flex; align-items: center; justify-content: center; padding: 48px;">
          <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}" style="max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 24px 40px rgba(0,0,0,0.22));" />
          <div style="position: absolute; top: 24px; left: 28px; color: #1D1D1F;">
            <div class="label-meta" style="color: #666;">CAVE ASSET #${vehicle.id}</div>
            <h1 style="font-size: 38px; margin-top: 4px;">${vehicle.make} ${vehicle.model}</h1>
            <div class="mono-val" style="font-size: 16px; font-weight: 800;">REG: ${vehicle.reg}</div>
          </div>
          <div style="position: absolute; top: 24px; right: 28px;">
            <span class="status-pill status-${vehicle.status.toLowerCase()}" style="font-size: 12px; padding: 6px 14px;">
              <span class="status-dot"></span>${vehicle.status}
            </span>
          </div>
        </div>

        <div style="padding: 28px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; background-color: #FFFFFF;">
          <div>
            <div class="label-meta">DAILY RATE</div>
            <div class="mono-val" style="font-size: 24px; font-weight: 800; margin-top: 4px; color: #000;">&pound;${vehicle.dailyRate} / DAY</div>
          </div>
          <div>
            <div class="label-meta">WEEKLY RATE</div>
            <div class="mono-val" style="font-size: 24px; font-weight: 800; margin-top: 4px; color: #000;">&pound;${vehicle.weeklyRate || vehicle.dailyRate * 6} / WEEK</div>
          </div>
          <div>
            <div class="label-meta">ODOMETER</div>
            <div class="mono-val" style="font-size: 24px; font-weight: 800; margin-top: 4px; color: #000;">${vehicle.mileage.toLocaleString()} mi</div>
          </div>
          <div>
            <div class="label-meta">INSURANCE</div>
            <div style="font-size: 13px; font-weight: 700; margin-top: 4px;">${vehicle.insuranceInfo}</div>
          </div>
        </div>

      </div>
    </div>
  `;
}

window.app = window.app || {};
window.app.setFleetFilter = function(f) {
  statusFilter = f;
  window.app.render();
};
