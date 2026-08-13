// RENTAL.OS Rental Detail View

import { store } from '../store/appStore.js';

export function renderRentalDetailView() {
  const rentalId = store.selectedRentalId || 'R00184';
  const rental = store.rentals.find(r => r.id === rentalId) || store.rentals[0];
  const customer = store.customers.find(c => c.id === rental.customerId) || store.customers[0];
  const vehicle = store.vehicles.find(v => v.id === rental.vehicleId || v.reg === rental.vehicleReg) || store.vehicles[0];

  // Dynamic time calculations
  const now = new Date('2026-08-12T18:17:51').getTime();
  const start = new Date(rental.startDate).getTime();
  const expReturn = new Date(rental.expectedReturnDate).getTime();

  const elapsedMs = Math.max(0, now - start);
  const elapsedD = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  const elapsedH = Math.floor((elapsedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const elapsedM = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));

  const remMs = expReturn - now;
  const isOverdue = remMs < 0;
  const absRemMs = Math.abs(remMs);
  const remD = Math.floor(absRemMs / (1000 * 60 * 60 * 24));
  const remH = Math.floor((absRemMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const remM = Math.floor((absRemMs % (1000 * 60 * 60)) / (1000 * 60));

  return `
    <div class="page-container">
      <!-- Breadcrumb & Top Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" style="margin-bottom: 8px;" onclick="window.app.setView('RENTALS')">&larr; BACK TO RENTALS</button>
          <div class="label-meta">RENTAL MANAGEMENT SYSTEM</div>
          <h1>RENTAL #${rental.id}</h1>
        </div>

        <div style="display: flex; gap: 12px;">
          <button class="btn-brutal btn-brutal-secondary" onclick="window.print()">PRINT AGREEMENT</button>
          ${rental.status !== 'COMPLETED' ? `
            <button class="btn-brutal" onclick="window.app.setView('RETURN_VEHICLE', { rentalId: '${rental.id}' })">PROCESS RETURN &rarr;</button>
          ` : ''}
        </div>
      </div>

      <!-- Main Overview Panel -->
      <div class="panel-brutal" style="margin-bottom: 24px; background-color: var(--bg-dark); color: #FFFFFF;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; border-bottom: 1px solid var(--border-dark); padding-bottom: 20px; margin-bottom: 20px;">
          <div>
            <div class="label-meta" style="color: #8E8E88;">VEHICLE</div>
            <div style="font-size: 20px; font-weight: 900; margin-top: 4px;">${rental.vehicleName}</div>
            <div class="mono-val" style="font-size: 13px; color: #B8B8B5;">${rental.vehicleReg}</div>
          </div>

          <div>
            <div class="label-meta" style="color: #8E8E88;">CUSTOMER</div>
            <div style="font-size: 20px; font-weight: 900; margin-top: 4px;">${rental.customerName}</div>
            <div class="mono-val" style="font-size: 13px; color: #B8B8B5;">${customer ? customer.phone : 'N/A'}</div>
          </div>

          <div>
            <div class="label-meta" style="color: #8E8E88;">STATUS</div>
            <div style="margin-top: 8px;">
              <span class="status-pill status-${rental.status.toLowerCase()}">
                <span class="status-dot"></span>${rental.status}
              </span>
            </div>
          </div>

          <div>
            <div class="label-meta" style="color: #8E8E88;">TOTAL FEE</div>
            <div class="number-huge" style="margin-top: 4px; font-size: 24px; color: #FFFFFF;">&pound;${rental.totalAmount.toLocaleString()}</div>
            <div class="mono-val" style="font-size: 11px; color: #8E8E88;">DEPOSIT HELD: &pound;${rental.deposit}</div>
          </div>
        </div>

        <!-- Timer Ticker Blocks -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
          <div style="background-color: #181818; padding: 14px; border: 1px solid #272727;">
            <div class="label-meta" style="color: #8E8E88;">VEHICLE OUT</div>
            <div class="mono-val" style="font-size: 14px; font-weight: 700; margin-top: 4px;">${new Date(rental.startDate).toLocaleString('en-GB').toUpperCase()}</div>
          </div>

          <div style="background-color: #181818; padding: 14px; border: 1px solid #272727;">
            <div class="label-meta" style="color: #8E8E88;">EXPECTED RETURN</div>
            <div class="mono-val" style="font-size: 14px; font-weight: 700; margin-top: 4px;">${new Date(rental.expectedReturnDate).toLocaleString('en-GB').toUpperCase()}</div>
          </div>

          <div style="background-color: #181818; padding: 14px; border: 1px solid #272727;">
            <div class="label-meta" style="color: #8E8E88;">TIME ELAPSED</div>
            <div class="mono-val" style="font-size: 18px; font-weight: 900; margin-top: 4px; color: var(--status-available);">${elapsedD}D ${elapsedH}H ${elapsedM}M</div>
          </div>

          <div style="background-color: #181818; padding: 14px; border: 1px solid ${isOverdue ? 'var(--status-overdue)' : '#272727'};">
            <div class="label-meta" style="color: ${isOverdue ? 'var(--status-overdue)' : '#8E8E88'};">${isOverdue ? 'TIME OVERDUE' : 'TIME REMAINING'}</div>
            <div class="mono-val" style="font-size: 18px; font-weight: 900; margin-top: 4px; color: ${isOverdue ? 'var(--status-overdue)' : '#FFFFFF'};">
              ${isOverdue ? `+${remD}D ${remH}H ${remM}M` : `${remD}D ${remH}H ${remM}M`}
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Grid Sections -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
        
        <!-- Customer Info -->
        <div class="panel-brutal">
          <div class="panel-header">
            <div>
              <div class="label-meta">CLIENT DOSSIER</div>
              <h2>CUSTOMER DETAILS</h2>
            </div>
            <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.setView('CUSTOMER_DETAIL', { customerId: '${customer.id}' })">OPEN PROFILE</button>
          </div>

          <table class="table-brutal">
            <tr><th style="width: 35%;">FULL NAME</th><td style="font-weight: 800;">${customer.fullName}</td></tr>
            <tr><th>CUSTOMER ID</th><td class="mono-val">${customer.id}</td></tr>
            <tr><th>DRIVING LICENCE</th><td class="mono-val">${customer.licenceNumber} (EXP: ${customer.licenceExpiry})</td></tr>
            <tr><th>PHONE</th><td class="mono-val">${customer.phone}</td></tr>
            <tr><th>EMAIL</th><td>${customer.email}</td></tr>
            <tr><th>ADDRESS</th><td>${customer.address}</td></tr>
          </table>
        </div>

        <!-- Vehicle Spec Out -->
        <div class="panel-brutal">
          <div class="panel-header">
            <div>
              <div class="label-meta">FLEET ASSET</div>
              <h2>VEHICLE DETAILS</h2>
            </div>
            <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.setView('VEHICLE_DETAIL', { vehicleId: '${vehicle.id}' })">OPEN VEHICLE</button>
          </div>

          <table class="table-brutal">
            <tr><th style="width: 35%;">MODEL</th><td style="font-weight: 800;">${vehicle.make} ${vehicle.model} (${vehicle.year})</td></tr>
            <tr><th>REGISTRATION</th><td class="mono-val">${vehicle.reg}</td></tr>
            <tr><th>START MILEAGE</th><td class="mono-val">${rental.startMileage.toLocaleString()} mi</td></tr>
            <tr><th>DEPARTURE FUEL</th><td class="mono-val">${rental.startFuel}%</td></tr>
            <tr><th>DAILY RATE</th><td class="mono-val">&pound;${rental.dailyRate} / DAY</td></tr>
            <tr><th>INSURANCE COVER</th><td>${vehicle.insuranceInfo}</td></tr>
          </table>
        </div>
      </div>

      <!-- Verification Checklist & Documents -->
      <div class="panel-brutal" style="margin-bottom: 24px;">
        <div class="panel-header">
          <div>
            <div class="label-meta">COMPLIANCE VERIFICATION</div>
            <h2>VERIFIED DOCUMENTS</h2>
          </div>
          <span class="status-pill status-active"><span class="status-dot"></span>ALL VERIFIED</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
          <div style="border: 1px solid var(--border-color); padding: 16px; background-color: var(--bg-canvas);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-weight: 800; font-size: 13px;">DRIVING LICENCE</span>
              <span style="color: var(--status-available); font-weight: 800; font-size: 11px;">✓ VERIFIED</span>
            </div>
            <div class="mono-val" style="font-size: 11px; color: var(--text-muted);">${customer.licenceNumber}</div>
            <div style="margin-top: 12px; display: flex; gap: 8px;">
              <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="alert('Viewing Driving Licence Document preview...')">VIEW</button>
              <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="alert('Downloading Document file...')">DOWNLOAD</button>
            </div>
          </div>

          <div style="border: 1px solid var(--border-color); padding: 16px; background-color: var(--bg-canvas);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-weight: 800; font-size: 13px;">PASSPORT / ID</span>
              <span style="color: var(--status-available); font-weight: 800; font-size: 11px;">✓ VERIFIED</span>
            </div>
            <div class="mono-val" style="font-size: 11px; color: var(--text-muted);">${customer.idDocument ? customer.idDocument.name : 'Passport_UK.pdf'}</div>
            <div style="margin-top: 12px; display: flex; gap: 8px;">
              <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="alert('Viewing Passport/ID preview...')">VIEW</button>
              <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="alert('Downloading ID document...')">DOWNLOAD</button>
            </div>
          </div>

          <div style="border: 1px solid var(--border-color); padding: 16px; background-color: var(--bg-canvas);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-weight: 800; font-size: 13px;">RENTAL AGREEMENT</span>
              <span style="color: var(--status-available); font-weight: 800; font-size: 11px;">✓ SIGNED</span>
            </div>
            <div class="mono-val" style="font-size: 11px; color: var(--text-muted);">CONTRACT #${rental.id}</div>
            <div style="margin-top: 12px; display: flex; gap: 8px;">
              <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.print()">VIEW CONTRACT</button>
              <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="alert('Downloading Contract PDF...')">DOWNLOAD</button>
            </div>
          </div>

          <div style="border: 1px solid var(--border-color); padding: 16px; background-color: var(--bg-canvas);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-weight: 800; font-size: 13px;">INSURANCE COVER</span>
              <span style="color: var(--status-available); font-weight: 800; font-size: 11px;">✓ VERIFIED</span>
            </div>
            <div class="mono-val" style="font-size: 11px; color: var(--text-muted);">${vehicle.insuranceInfo}</div>
            <div style="margin-top: 12px; display: flex; gap: 8px;">
              <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="alert('Viewing Policy Certificate...')">VIEW</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes & Departure Condition -->
      <div class="panel-brutal">
        <div class="panel-header">
          <div>
            <div class="label-meta">OPERATIONAL LOG</div>
            <h2>DAMAGE & NOTES</h2>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div>
            <div class="label-meta">CONDITION AT DEPARTURE</div>
            <div style="padding: 12px; background-color: var(--bg-canvas); border: 1px solid var(--border-color); margin-top: 6px; font-size: 13px;">
              ${rental.damageNotes}
            </div>
          </div>

          <div>
            <div class="label-meta">INTERNAL DISPATCH NOTES</div>
            <div style="padding: 12px; background-color: var(--bg-canvas); border: 1px solid var(--border-color); margin-top: 6px; font-size: 13px;">
              ${rental.notes}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
