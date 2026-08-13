// CAVE Dashboard View with Live Dispatch Telemetry Radar Ticker

import { store } from '../store/appStore.js';

export function renderDashboardView() {
  const rentals = store.rentals;
  const vehicles = store.vehicles;

  const activeRentals = rentals.filter(r => r.status === 'ACTIVE' || r.status === 'RETURNING' || r.status === 'OVERDUE');
  const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE');

  return `
    <div class="page-container">
      
      <!-- Live Fleet Radar Telemetry Bar -->
      <div style="background: #000000; color: #FFFFFF; padding: 14px 20px; border-radius: var(--radius-md); margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="width: 8px; height: 8px; background-color: #34C759; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #34C759;"></span>
          <span class="label-meta" style="color: #8E8E93;">LIVE TELEMETRY RADAR:</span>
          <span class="mono-val" style="font-size: 13px; font-weight: 700; color: #FFFFFF;">AUDI RS7 (XX23 XXX) DISPATCHED &bull; M25 ROUTE &bull; RETURN DUE 14 AUG 14:32</span>
        </div>
        <span class="mono-val" style="font-size: 11px; font-weight: 700; color: #007AFF;">GPS ACTIVE ✓</span>
      </div>

      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 32px;">
        <div>
          <div class="label-meta">AUTOMOTIVE DISPATCH</div>
          <h1>CAVE DASHBOARD</h1>
        </div>
        <div style="display: flex; gap: 12px;">
          <button class="btn-brutal" onclick="window.app.setView('RENTALS')">+ NEW RENTAL</button>
          <button class="btn-brutal btn-brutal-secondary" onclick="window.app.setView('CUSTOMERS')">CUSTOMERS & AGREEMENTS</button>
        </div>
      </div>

      <!-- Apple Stat Cards -->
      <div class="stats-grid" style="margin-bottom: 32px;">
        <div class="stat-box">
          <div class="label-meta">TOTAL FLEET</div>
          <div class="number-huge" style="margin-top: 12px; color: #1D1D1F;">${vehicles.length}</div>
        </div>
        <div class="stat-box">
          <div class="label-meta">AVAILABLE FLEET</div>
          <div class="number-huge" style="margin-top: 12px; color: var(--apple-green);">${availableVehicles.length}</div>
        </div>
        <div class="stat-box">
          <div class="label-meta">ACTIVE RENTALS</div>
          <div class="number-huge" style="margin-top: 12px; color: var(--apple-blue);">${activeRentals.length}</div>
        </div>
      </div>

      <!-- Active Rentals Section -->
      <div class="panel-brutal" style="margin-bottom: 32px;">
        <div class="panel-header">
          <div>
            <div class="label-meta">DISPATCH TELEMETRY</div>
            <h2>ACTIVE LEASES</h2>
          </div>
        </div>

        <div class="table-container">
          <table class="table-brutal">
            <thead>
              <tr>
                <th>VEHICLE</th>
                <th>REGISTRATION</th>
                <th>CUSTOMER</th>
                <th>RENTAL PERIOD</th>
                <th>STATUS</th>
                <th>AGREEMENT PDF</th>
              </tr>
            </thead>
            <tbody>
              ${activeRentals.length === 0 ? `
                <tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 28px;">NO ACTIVE RENTALS</td></tr>
              ` : activeRentals.map(r => `
                <tr class="clickable-row" onclick="window.app.setView('RENTAL_DETAIL', { rentalId: '${r.id}' })">
                  <td style="font-weight: 800;">${r.vehicleName}</td>
                  <td class="mono-val">${r.vehicleReg}</td>
                  <td style="font-weight: 700;">${r.customerName}</td>
                  <td class="mono-val">${new Date(r.startDate).toLocaleDateString('en-GB')} &rarr; ${new Date(r.expectedReturnDate).toLocaleDateString('en-GB')}</td>
                  <td><span class="status-pill status-${r.status.toLowerCase()}"><span class="status-dot"></span>${r.status}</span></td>
                  <td>
                    <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="event.stopPropagation(); window.app.openPdfAgreementModal('${r.customerId}')">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg> <span>CONTRACT PDF</span>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Visual Fleet Overview with Clean Studio Cutouts -->
      <div class="panel-brutal">
        <div class="panel-header">
          <div>
            <div class="label-meta">AVAILABLE FLEET</div>
            <h2>FEATURED VEHICLES</h2>
          </div>
          <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.setView('VEHICLES')">VIEW ALL FLEET &rarr;</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
          ${vehicles.slice(0, 4).map(v => `
            <div class="panel-brutal clickable-row" style="padding: 0; overflow: hidden; background: #FFFFFF;" onclick="window.app.setView('VEHICLE_DETAIL', { vehicleId: '${v.id}' })">
              
              <!-- Vehicle Cutout Image Box -->
              <div style="height: 160px; width: 100%; background: radial-gradient(circle, #FAFAFC 0%, #EFEFEF 100%); position: relative; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <img src="${v.image}" alt="${v.make} ${v.model}" style="max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.15));" />
                <div style="position: absolute; top: 12px; right: 12px;">
                  <span class="status-pill status-${v.status.toLowerCase()}">${v.status}</span>
                </div>
              </div>

              <div style="padding: 16px;">
                <div style="font-weight: 800; font-size: 16px; letter-spacing: -0.01em;">${v.make} ${v.model}</div>
                <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 13px;">
                  <span class="mono-val" style="color: var(--text-muted);">${v.reg}</span>
                  <span class="mono-val" style="font-weight: 800; color: #000;">&pound;${v.dailyRate} / DAY</span>
                </div>
              </div>

            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
