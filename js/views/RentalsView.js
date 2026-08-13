// CAVE Rentals View with Studio Cutout Images

import { store } from '../store/appStore.js';

export function renderRentalsView() {
  const currentView = store.currentView;

  if (currentView === 'RENTAL_DETAIL') {
    return renderRentalDetail();
  }

  const rentals = store.rentals;

  return `
    <div class="page-container">
      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <div class="label-meta">RENTAL CONTRACTS</div>
          <h1>RENTALS</h1>
        </div>
        <button class="btn-brutal" onclick="window.app.promptNewRentalWizard()">+ NEW RENTAL</button>
      </div>

      <div class="panel-brutal">
        <div class="table-container">
          <table class="table-brutal">
            <thead>
              <tr>
                <th>RENTAL ID</th>
                <th>VEHICLE</th>
                <th>REGISTRATION</th>
                <th>CUSTOMER</th>
                <th>DATES</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${rentals.map(r => `
                <tr class="clickable-row" onclick="window.app.setView('RENTAL_DETAIL', { rentalId: '${r.id}' })">
                  <td class="mono-val" style="font-weight: 800;">#${r.id}</td>
                  <td style="font-weight: 800;">${r.vehicleName}</td>
                  <td class="mono-val">${r.vehicleReg}</td>
                  <td style="font-weight: 700;">${r.customerName}</td>
                  <td class="mono-val">${new Date(r.startDate).toLocaleDateString('en-GB')} &rarr; ${new Date(r.expectedReturnDate).toLocaleDateString('en-GB')}</td>
                  <td class="mono-val" style="font-weight: 800;">&pound;${r.totalAmount.toLocaleString()}</td>
                  <td><span class="status-pill status-${r.status.toLowerCase()}"><span class="status-dot"></span>${r.status}</span></td>
                  <td>
                    ${r.status !== 'COMPLETED' ? `
                      <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="event.stopPropagation(); window.app.completeReturnPrompt('${r.id}')">RETURN</button>
                    ` : `
                      <span style="font-size: 11px; font-weight: 700; color: var(--text-muted);">CLOSED</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderRentalDetail() {
  const rentalId = store.selectedRentalId || 'R00184';
  const rental = store.rentals.find(r => r.id === rentalId) || store.rentals[0];
  const vehicle = store.vehicles.find(v => v.id === rental.vehicleId || v.reg === rental.vehicleReg);

  return `
    <div class="page-container">
      <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" style="margin-bottom: 16px;" onclick="window.app.setView('RENTALS')">&larr; BACK TO RENTALS</button>

      <div class="panel-brutal" style="margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
          <div>
            <div class="label-meta">CONTRACT # ${rental.id}</div>
            <h1 style="font-size: 32px; margin-top: 4px;">${rental.vehicleName}</h1>
            <div class="mono-val" style="font-size: 14px; color: var(--text-muted);">CUSTOMER: ${rental.customerName}</div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn-brutal btn-brutal-secondary" onclick="window.app.openPdfAgreementModal('${rental.customerId}')">📄 OPEN AGREEMENT PDF / SIGN</button>
            ${rental.status !== 'COMPLETED' ? `
              <button class="btn-brutal" onclick="window.app.completeReturnPrompt('${rental.id}')">PROCESS RETURN</button>
            ` : ''}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          ${vehicle ? `
            <div style="height: 220px; border: 1px solid var(--border-color); background: #F8F8F6; display: flex; align-items: center; justify-content: center; padding: 20px; overflow: hidden;">
              <img src="${vehicle.image}" alt="${vehicle.make}" style="max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.15));" />
            </div>
          ` : ''}

          <div>
            <div class="label-meta" style="margin-bottom: 8px;">LEASE SUMMARY</div>
            <table class="table-brutal">
              <tr><th>START DATE</th><td class="mono-val">${new Date(rental.startDate).toLocaleString('en-GB')}</td></tr>
              <tr><th>EXPECTED RETURN</th><td class="mono-val">${new Date(rental.expectedReturnDate).toLocaleString('en-GB')}</td></tr>
              <tr><th>DAILY RATE</th><td class="mono-val">&pound;${rental.dailyRate} / DAY</td></tr>
              <tr><th>TOTAL FEE</th><td class="mono-val" style="font-weight: 800;">&pound;${rental.totalAmount.toLocaleString()}</td></tr>
              <tr><th>STATUS</th><td><span class="status-pill status-${rental.status.toLowerCase()}">${rental.status}</span></td></tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.app = window.app || {};

window.app.promptNewRentalWizard = function() {
  const custId = prompt("Select Customer ID (e.g. C000184):", "C000184");
  if (custId) {
    const newR = store.createRental({
      customerId: custId,
      vehicleId: "V005",
      startDate: new Date().toISOString(),
      expectedReturnDate: new Date(Date.now() + 4 * 86400000).toISOString(),
      dailyRate: 500,
      deposit: 1000,
      totalAmount: 2000
    });
    alert(`New Rental #${newR.id} created successfully!`);
    window.app.setView('RENTAL_DETAIL', { rentalId: newR.id });
  }
};

window.app.completeReturnPrompt = function(rentalId) {
  if (confirm(`Complete vehicle return for Rental #${rentalId}?`)) {
    store.completeReturn(rentalId);
    alert(`Rental #${rentalId} is marked COMPLETED. Vehicle is now AVAILABLE.`);
    window.app.render();
  }
};
