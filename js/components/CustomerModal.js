// CAVE Interactive New Customer Panel Modal with macOS Traffic Lights

import { store } from '../store/appStore.js';

let previewLicenceImage = null;

export function renderAddCustomerModal() {
  if (!store.addCustomerModalOpen) return '';

  return `
    <div class="modal-overlay" onclick="if(event.target === this) window.app.toggleAddCustomerModal(false)">
      <div class="modal-brutal" id="addCustModalEl" style="max-width: 680px; background: #FFFFFF;">
        
        <!-- Apple macOS Modal Header -->
        <div class="modal-header" style="background: #000000; color: #FFFFFF;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div class="mac-traffic-lights">
              <span class="mac-dot mac-dot-red" onclick="window.app.toggleAddCustomerModal(false)" title="Close Window"></span>
              <span class="mac-dot mac-dot-yellow" onclick="window.app.toggleAddCustomerModal(false)" title="Minimize Window"></span>
              <span class="mac-dot mac-dot-green" onclick="window.app.toggleModalFullscreen('addCustModalEl')" title="Maximize Window"></span>
            </div>
            <div>
              <div class="label-meta" style="color: #8E8E93;">CLIENT DOSSIER REGISTRATION</div>
              <div style="font-weight: 800; font-size: 18px; color: #FFFFFF;">+ NEW CUSTOMER PROFILE</div>
            </div>
          </div>
          <button type="button" class="btn-brutal btn-brutal-secondary btn-brutal-sm" style="background: #2C2C2E !important; color: #FFFFFF !important; border: none;" onclick="window.app.toggleAddCustomerModal(false)">ESC</button>
        </div>

        <form onsubmit="event.preventDefault(); window.app.submitAddCustomerForm();" class="modal-body" style="padding: 28px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            
            <div class="form-group">
              <label class="label-meta">FULL NAME *</label>
              <input type="text" id="custFullName" class="form-input" placeholder="e.g. MARCUS VANCE" required />
            </div>

            <div class="form-group">
              <label class="label-meta">DRIVING LICENCE NUMBER *</label>
              <input type="text" id="custLicenceNum" class="form-input" placeholder="e.g. VANCEM900414V99UK" required />
            </div>

            <div class="form-group">
              <label class="label-meta">LICENCE EXPIRY DATE</label>
              <input type="date" id="custLicenceExp" class="form-input" value="2029-09-14" />
            </div>

            <div class="form-group">
              <label class="label-meta">PHONE NUMBER</label>
              <input type="tel" id="custPhone" class="form-input" placeholder="07700 900184" />
            </div>

            <div class="form-group">
              <label class="label-meta">EMAIL ADDRESS</label>
              <input type="email" id="custEmail" class="form-input" placeholder="marcus@vance.co.uk" />
            </div>

            <div class="form-group">
              <label class="label-meta">ADDRESS</label>
              <input type="text" id="custAddress" class="form-input" placeholder="42 Mayfair Green, London" />
            </div>

          </div>

          <!-- Interactive Driving Licence Image Attachment Panel -->
          <div style="margin-top: 16px;">
            <div class="label-meta" style="margin-bottom: 8px;">ATTACH DRIVING LICENCE PHOTO</div>
            <div style="border: 2px dashed #000000; border-radius: var(--radius-sm); padding: 20px; background-color: #F8F8F6; text-align: center;">
              ${previewLicenceImage ? `
                <div style="height: 140px; width: 100%; margin-bottom: 10px; overflow: hidden; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                  <img src="${previewLicenceImage}" alt="Licence Preview" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <span class="status-pill status-active">✓ LICENCE PHOTO READY</span>
              ` : `
                <div style="font-size: 13px; font-weight: 700; margin-bottom: 4px;">ATTACH DRIVING LICENCE IMAGE</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">Click below to load sample licence scan or paste image URL</div>
                <button type="button" class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.attachLicencePreview()">📷 SELECT LICENCE PHOTO</button>
              `}
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer" style="padding-x: 0; padding-bottom: 0; margin-top: 24px; background: transparent; border-top: none;">
            <button type="button" class="btn-brutal btn-brutal-secondary" onclick="window.app.toggleAddCustomerModal(false)">CANCEL</button>
            <button type="submit" class="btn-brutal" style="background-color: #000000 !important; color: #FFFFFF !important; padding: 12px 24px; font-size: 14px;">
              + CREATE CUSTOMER & OPEN AGREEMENT PDF &rarr;
            </button>
          </div>
        </form>

      </div>
    </div>
  `;
}

window.app = window.app || {};

window.app.toggleModalFullscreen = function(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.toggle('modal-fullscreen');
};

window.app.attachLicencePreview = function() {
  const sample = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80";
  const custom = prompt("Enter Driving Licence Image URL (or press OK to use sample scan):", sample);
  if (custom) {
    previewLicenceImage = custom;
    window.app.render();
  }
};

window.app.submitAddCustomerForm = function() {
  const fullName = document.getElementById('custFullName').value;
  const licenceNumber = document.getElementById('custLicenceNum').value;
  const licenceExpiry = document.getElementById('custLicenceExp').value;
  const phone = document.getElementById('custPhone').value;
  const email = document.getElementById('custEmail').value;
  const address = document.getElementById('custAddress').value;

  const created = store.addCustomer({
    fullName,
    licenceNumber,
    licenceExpiry,
    phone,
    email,
    address,
    licenceImage: previewLicenceImage || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80"
  });

  previewLicenceImage = null;
  store.toggleAddCustomerModal(false);
  alert(`Customer ${created.fullName} created successfully! Opening Rental Agreement PDF...`);
  store.openPdfAgreementModal(created.id);
};
