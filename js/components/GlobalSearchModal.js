// RENTAL.OS Global Search Modal Component

import { store } from '../store/appStore.js';

export function renderGlobalSearchModal() {
  if (!store.searchModalOpen) return '';

  const results = store.globalSearch(store.searchQuery);
  const totalResults = results.customers.length + results.vehicles.length + results.rentals.length + results.documents.length;

  return `
    <div class="modal-overlay" onclick="if(event.target === this) window.app.toggleSearchModal(false)">
      <div class="modal-brutal" style="max-width: 720px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" 
                   id="globalSearchInput"
                   class="form-input" 
                   style="border: none; font-size: 16px; font-weight: 700; background: transparent; padding: 0; text-transform: uppercase;" 
                   placeholder="Search customer, vehicle, registration, rental..." 
                   value="${store.searchQuery}" 
                   oninput="window.app.setSearchQuery(this.value)"
                   autofocus />
          </div>
          <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.toggleSearchModal(false)">ESC</button>
        </div>

        <div class="modal-body" style="padding: 16px 24px; max-height: 480px; overflow-y: auto;">
          ${store.searchQuery.trim() === '' ? `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
              <div class="label-meta">GLOBAL SEARCH OS</div>
              <p style="margin-top: 8px; font-size: 13px;">Type a customer name, vehicle model, registration (e.g. <code>XX23 XXX</code>), or rental ID (<code>#00184</code>).</p>
            </div>
          ` : totalResults === 0 ? `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
              <div class="label-meta">NO MATCHES FOUND</div>
              <p style="margin-top: 8px; font-size: 13px;">No results found for "${store.searchQuery}".</p>
            </div>
          ` : `
            ${results.rentals.length > 0 ? `
              <div style="margin-bottom: 20px;">
                <div class="label-meta" style="margin-bottom: 8px;">RENTALS (${results.rentals.length})</div>
                ${results.rentals.map(r => `
                  <div class="panel-brutal clickable-row" style="padding: 12px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;"
                       onclick="window.app.setView('RENTAL_DETAIL', { rentalId: '${r.id}' }); window.app.toggleSearchModal(false);">
                    <div>
                      <div style="font-weight: 800; font-size: 14px;">RENTAL #${r.id} &mdash; ${r.vehicleName} (${r.vehicleReg})</div>
                      <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">CUSTOMER: ${r.customerName} | OUT: ${new Date(r.startDate).toLocaleDateString('en-GB')}</div>
                    </div>
                    <span class="status-pill status-${r.status.toLowerCase()}"><span class="status-dot"></span>${r.status}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${results.vehicles.length > 0 ? `
              <div style="margin-bottom: 20px;">
                <div class="label-meta" style="margin-bottom: 8px;">VEHICLES (${results.vehicles.length})</div>
                ${results.vehicles.map(v => `
                  <div class="panel-brutal clickable-row" style="padding: 12px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;"
                       onclick="window.app.setView('VEHICLE_DETAIL', { vehicleId: '${v.id}' }); window.app.toggleSearchModal(false);">
                    <div>
                      <div style="font-weight: 800; font-size: 14px;">${v.make} ${v.model} &mdash; <span class="mono-val">${v.reg}</span></div>
                      <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">MILEAGE: ${v.mileage.toLocaleString()} mi | RATE: &pound;${v.dailyRate}/DAY</div>
                    </div>
                    <span class="status-pill status-${v.status.toLowerCase()}"><span class="status-dot"></span>${v.status}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${results.customers.length > 0 ? `
              <div style="margin-bottom: 20px;">
                <div class="label-meta" style="margin-bottom: 8px;">CUSTOMERS (${results.customers.length})</div>
                ${results.customers.map(c => `
                  <div class="panel-brutal clickable-row" style="padding: 12px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;"
                       onclick="window.app.setView('CUSTOMER_DETAIL', { customerId: '${c.id}' }); window.app.toggleSearchModal(false);">
                    <div>
                      <div style="font-weight: 800; font-size: 14px;">${c.fullName} &mdash; <span class="mono-val">${c.id}</span></div>
                      <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">LICENCE: ${c.licenceNumber} | PHONE: ${c.phone}</div>
                    </div>
                    <span class="status-pill status-active"><span class="status-dot"></span>${c.verificationStatus}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${results.documents.length > 0 ? `
              <div>
                <div class="label-meta" style="margin-bottom: 8px;">DOCUMENTS (${results.documents.length})</div>
                ${results.documents.map(d => `
                  <div class="panel-brutal clickable-row" style="padding: 12px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;"
                       onclick="window.app.setView('DOCUMENTS'); window.app.toggleSearchModal(false);">
                    <div>
                      <div style="font-weight: 800; font-size: 13px;">${d.name}</div>
                      <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">CATEGORY: ${d.category} | EXP: ${d.expiryDate}</div>
                    </div>
                    <span class="status-pill ${d.status === 'EXPIRING_SOON' ? 'status-overdue' : 'status-active'}">${d.status}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          `}
        </div>

        <div class="modal-footer" style="justify-content: space-between;">
          <span style="font-size: 11px; color: var(--text-muted);">PRESS <strong>ESC</strong> TO CLOSE</span>
          <span style="font-size: 11px; font-weight: 700;">RENTAL.OS FAST ENGINE</span>
        </div>
      </div>
    </div>
  `;
}
