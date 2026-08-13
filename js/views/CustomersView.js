// CAVE Customers View - High-Contrast Colorful SVG Logos for Buttons

import { store } from '../store/appStore.js';
import { renderAppleWalletPass } from '../components/AppleWalletPass.js';

let customerSearchQuery = '';

// Colorful SVG Icons
const ICON_WHATSAPP = `<svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" style="flex-shrink:0;"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.765.459 3.488 1.333 5.007l-1.416 5.176 5.3-.1.391 1.385a9.945 9.945 0 0 0 4.781 1.229h.005c5.507 0 9.99-4.478 9.991-9.984 0-2.669-1.038-5.177-2.924-7.062a9.923 9.923 0 0 0-7.07-2.935z"/></svg>`;

const ICON_PDF = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;

const ICON_CAMERA = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`;

export function renderCustomersView() {
  const currentView = store.currentView;

  if (currentView === 'CUSTOMER_DETAIL') {
    return renderCustomerDetail();
  }

  const customers = store.customers;
  const filtered = customerSearchQuery.trim() === '' ? customers : customers.filter(c => 
    c.fullName.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    c.phone.includes(customerSearchQuery) ||
    c.licenceNumber.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  return `
    <div class="page-container">
      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <div class="label-meta">CLIENT DIRECTORY</div>
          <h1>CUSTOMERS</h1>
        </div>
        <button class="btn-brutal" onclick="window.app.toggleAddCustomerModal(true)">+ NEW CUSTOMER</button>
      </div>

      <!-- Convenient Fast Search Bar -->
      <div style="margin-bottom: 24px;">
        <input type="text" class="form-input" 
               placeholder="🔍 Search customer name, phone number, or licence number..." 
               value="${customerSearchQuery}"
               oninput="window.app.setCustomerSearchQuery(this.value)" />
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px;">
        ${filtered.length === 0 ? `
          <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
            NO CUSTOMERS MATCHING "${customerSearchQuery}"
          </div>
        ` : filtered.map(c => `
          <div class="panel-brutal clickable-row" style="display: flex; flex-direction: column; justify-content: space-between;" onclick="window.app.setView('CUSTOMER_DETAIL', { customerId: '${c.id}' })">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <span class="mono-val" style="font-weight: 800; font-size: 12px; color: var(--text-muted);">${c.id}</span>
                ${c.agreementSigned ? `
                  <span class="status-pill status-active"><span class="status-dot"></span>AGREEMENT SIGNED ✓</span>
                ` : `
                  <span class="status-pill status-overdue"><span class="status-dot"></span>AGREEMENT PENDING</span>
                `}
              </div>

              <div style="font-size: 22px; font-weight: 800; color: var(--text-main); letter-spacing: -0.01em;">${c.fullName}</div>
              <div class="mono-val" style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">LICENCE: ${c.licenceNumber} (EXP: ${c.licenceExpiry})</div>
              <div style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">PHONE: ${c.phone}</div>
            </div>

            <!-- Action Bar with Crisp Color Logos -->
            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color); display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="event.stopPropagation(); window.app.openPdfAgreementModal('${c.id}')">
                ${ICON_PDF} <span>CONTRACT PDF</span>
              </button>
              <button class="btn-brutal btn-brutal-sm" onclick="event.stopPropagation(); window.app.quickLeaseForCustomer('${c.id}')">
                + LEASE CAR
              </button>
              <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="event.stopPropagation(); window.app.contactCustomerWhatsApp('${c.phone}', '${c.fullName}')">
                ${ICON_WHATSAPP} <span>WHATSAPP</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderCustomerDetail() {
  const customerId = store.selectedCustomerId || 'C000184';
  const customer = store.customers.find(c => c.id === customerId) || store.customers[0];

  return `
    <div class="page-container">
      <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" style="margin-bottom: 20px;" onclick="window.app.setView('CUSTOMERS')">&larr; BACK TO CUSTOMERS</button>

      <!-- Customer Dossier -->
      <div class="panel-brutal" style="margin-bottom: 28px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div>
            <div class="label-meta">CUSTOMER PROFILE DOSSIER</div>
            <h1 style="font-size: 34px; margin-top: 4px;">${customer.fullName}</h1>
            <div class="mono-val" style="font-size: 14px; color: var(--text-muted);">ID #${customer.id}</div>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.contactCustomerWhatsApp('${customer.phone}', '${customer.fullName}')">
              ${ICON_WHATSAPP} <span>WHATSAPP CUSTOMER</span>
            </button>
            <button class="btn-brutal" onclick="window.app.openPdfAgreementModal('${customer.id}')">
              ${ICON_PDF} <span>RENTAL AGREEMENT PDF / ONLINE SIGNATURE</span>
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 32px; align-items: start;">
          
          <!-- Left: Customer Details Table -->
          <div>
            <div class="label-meta" style="margin-bottom: 12px;">CLIENT DOSSIER SPECIFICATION</div>
            <table class="table-brutal">
              <tr><th style="width: 35%;">FULL NAME</th><td style="font-weight: 800;">${customer.fullName}</td></tr>
              <tr><th>DRIVING LICENCE</th><td class="mono-val" style="font-weight: 700;">${customer.licenceNumber}</td></tr>
              <tr><th>LICENCE EXPIRY</th><td class="mono-val">${customer.licenceExpiry}</td></tr>
              <tr><th>PHONE</th><td class="mono-val">${customer.phone}</td></tr>
              <tr><th>EMAIL</th><td>${customer.email}</td></tr>
              <tr><th>ADDRESS</th><td>${customer.address}</td></tr>
              <tr><th>AGREEMENT STATUS</th><td>
                ${customer.agreementSigned ? `
                  <span class="status-pill status-active"><span class="status-dot"></span>SIGNED ✓ (${customer.agreementSignedDate})</span>
                ` : `
                  <span class="status-pill status-overdue"><span class="status-dot"></span>UNSIGNED &mdash; ACTION REQUIRED</span>
                `}
              </td></tr>
            </table>

            <!-- Quick Actions -->
            <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
              <button class="btn-brutal" onclick="window.app.quickLeaseForCustomer('${customer.id}')">
                + NEW VEHICLE LEASE FOR THIS CLIENT
              </button>
              <button class="btn-brutal btn-brutal-secondary" onclick="window.app.triggerLicenceUpload('${customer.id}')">
                ${ICON_CAMERA} <span>UPLOAD / REPLACE LICENCE PHOTO</span>
              </button>
            </div>
          </div>

          <!-- Right: Apple Wallet Pass Preview -->
          <div>
            <div class="label-meta" style="margin-bottom: 12px;">APPLE WALLET PASS PREVIEW</div>
            ${renderAppleWalletPass(customer)}
          </div>

        </div>
      </div>
    </div>
  `;
}

window.app = window.app || {};

window.app.setCustomerSearchQuery = function(q) {
  customerSearchQuery = q;
  window.app.render();
};

window.app.contactCustomerWhatsApp = function(phone, name) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const msg = encodeURIComponent(`Hello ${name}, this is CAVE Automotive Rentals regarding your vehicle lease agreement.`);
  window.open(`https://wa.me/44${cleanPhone}?text=${msg}`, '_blank');
};

window.app.quickLeaseForCustomer = function(customerId) {
  const vehicleId = "V005";
  const newR = store.createRental({
    customerId,
    vehicleId,
    startDate: new Date().toISOString(),
    expectedReturnDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    dailyRate: 500,
    deposit: 1000,
    totalAmount: 2000
  });
  alert(`New Lease #${newR.id} created for customer! Opening details...`);
  window.app.setView('RENTAL_DETAIL', { rentalId: newR.id });
};

window.app.triggerLicenceUpload = function(customerId) {
  const defaultSample = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80";
  const customUrl = prompt("Enter Driving Licence Photo Image URL (or press OK to use sample scan):", defaultSample);
  if (customUrl) {
    store.uploadCustomerLicence(customerId, customUrl);
    alert("Driving Licence Image uploaded successfully!");
    window.app.render();
  }
};
