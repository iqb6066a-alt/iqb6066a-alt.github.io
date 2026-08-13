// CAVE Official UK Vehicle Loan (Borrowing) Agreement PDF Modal - Fully Editable Fields

import { store } from '../store/appStore.js';

let signatureType = 'DRAW'; // DRAW | TYPE

export function renderPdfAgreementModal() {
  if (!store.pdfModalOpen || !store.activeCustomerForPdf) return '';

  const customer = store.activeCustomerForPdf;
  const isSigned = customer.agreementSigned;

  // Find active or latest rental for this customer
  const rental = store.rentals.find(r => r.customerId === customer.id) || {
    vehicleName: 'AUDI RS7 SPORTBACK',
    vehicleReg: 'XX24 CAVE',
    startDate: new Date().toISOString().slice(0, 16),
    expectedReturnDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 16)
  };

  const vehicle = store.vehicles.find(v => v.reg === rental.vehicleReg) || {
    make: 'AUDI',
    model: 'RS7 SPORTBACK',
    reg: 'XX24 CAVE',
    insuranceInfo: 'AVIVA COMMERCIAL FLEET #AV-99014'
  };

  const agreementDate = isSigned && customer.agreementSignedDate 
    ? customer.agreementSignedDate 
    : new Date().toISOString().split('T')[0];

  return `
    <div class="modal-overlay" onclick="if(event.target === this) window.app.closePdfModal()">
      <div class="modal-brutal" id="pdfModalEl" style="max-width: 840px; background: #FFFFFF; color: #000000;">
        
        <!-- Apple macOS Modal Header -->
        <div class="modal-header" style="background-color: #000000; color: #FFFFFF; border-top-left-radius: var(--radius-lg); border-top-right-radius: var(--radius-lg);">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div class="mac-traffic-lights">
              <span class="mac-dot mac-dot-red" onclick="window.app.closePdfModal()" title="Close Contract"></span>
              <span class="mac-dot mac-dot-yellow" onclick="window.app.closePdfModal()" title="Minimize"></span>
              <span class="mac-dot mac-dot-green" onclick="window.app.toggleModalFullscreen('pdfModalEl')" title="Maximize"></span>
            </div>
            <div>
              <div class="label-meta" style="color: #8E8E93;">EDITABLE UK VEHICLE BORROWING CONTRACT</div>
              <div style="font-weight: 800; font-size: 17px; letter-spacing: -0.01em;">VEHICLE LOAN AGREEMENT</div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" style="background: rgba(255,255,255,0.15) !important; color: #FFF !important; border: none;" onclick="window.app.shareContractLink('${customer.id}')">📲 SHARE LINK</button>
            <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" style="background: rgba(255,255,255,0.15) !important; color: #FFF !important; border: none;" onclick="window.print()">PRINT PDF</button>
            <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" style="background: rgba(255,255,255,0.15) !important; color: #FFF !important; border: none;" onclick="window.app.closePdfModal()">CLOSE</button>
          </div>
        </div>

        <!-- UK Vehicle Loan Document Body with Editable Form Fields -->
        <form onsubmit="event.preventDefault(); window.app.confirmOnlineSignature('${customer.id}');" class="modal-body" style="padding: 36px 40px; font-family: var(--font-sans); color: #000000; line-height: 1.5;">
          
          <!-- Document Title -->
          <div style="text-align: center; border-bottom: 2px solid #000000; padding-bottom: 16px; margin-bottom: 24px;">
            <div style="font-size: 24px; font-weight: 900; letter-spacing: 0.02em;">VEHICLE LOAN (BORROWING) AGREEMENT &ndash; UK</div>
            <div style="font-size: 13px; font-weight: 700; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span>This Agreement is made on:</span>
              <input type="date" id="pdfAgreementDate" class="form-input" value="${agreementDate}" style="width: 170px; height: 36px; padding: 4px 8px; font-size: 13px; font-weight: 800; border-color: #000;" />
            </div>
          </div>

          <!-- Section 1: Parties (Fully Editable) -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 13px; font-weight: 900; letter-spacing: 0.05em; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 12px;">
              1. PARTIES
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <!-- Owner (Lender) Editable Box -->
              <div style="background-color: #F8F8F6; padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <div style="font-weight: 800; font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">OWNER (LENDER):</div>
                
                <div style="margin-bottom: 8px;">
                  <label style="font-size: 10px; font-weight: 800; color: #555;">FULL NAME:</label>
                  <input type="text" id="pdfOwnerName" class="form-input" value="CAVE AUTOMOTIVE RENTALS LTD" style="font-size: 13px; font-weight: 800; padding: 6px 10px; height: 36px;" />
                </div>

                <div>
                  <label style="font-size: 10px; font-weight: 800; color: #555;">ADDRESS:</label>
                  <input type="text" id="pdfOwnerAddress" class="form-input" value="42 MAYFAIR GREEN, LONDON, W1K 1AA" style="font-size: 12px; padding: 6px 10px; height: 36px;" />
                </div>
              </div>

              <!-- Borrower Editable Box -->
              <div style="background-color: #F8F8F6; padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <div style="font-weight: 800; font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">BORROWER:</div>
                
                <div style="margin-bottom: 8px;">
                  <label style="font-size: 10px; font-weight: 800; color: #555;">FULL NAME:</label>
                  <input type="text" id="pdfBorrowerName" class="form-input" value="${customer.fullName}" style="font-size: 13px; font-weight: 800; padding: 6px 10px; height: 36px;" />
                </div>

                <div style="margin-bottom: 8px;">
                  <label style="font-size: 10px; font-weight: 800; color: #555;">ADDRESS:</label>
                  <input type="text" id="pdfBorrowerAddress" class="form-input" value="${customer.address}" style="font-size: 12px; padding: 6px 10px; height: 36px;" />
                </div>

                <div>
                  <label style="font-size: 10px; font-weight: 800; color: #555;">DRIVING LICENCE NUMBER:</label>
                  <input type="text" id="pdfBorrowerLicence" class="form-input mono-val" value="${customer.licenceNumber}" style="font-size: 12px; font-weight: 800; padding: 6px 10px; height: 36px;" />
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Vehicle Details (Fully Editable) -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 13px; font-weight: 900; letter-spacing: 0.05em; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 12px;">
              2. VEHICLE DETAILS
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 10px; font-weight: 800; color: #555;">MAKE &amp; MODEL:</label>
                <input type="text" id="pdfVehMakeModel" class="form-input" value="${rental.vehicleName || `${vehicle.make} ${vehicle.model}`}" style="font-size: 13px; font-weight: 800; padding: 6px 10px; height: 36px;" />
              </div>
              <div>
                <label style="font-size: 10px; font-weight: 800; color: #555;">REGISTRATION NUMBER:</label>
                <input type="text" id="pdfVehReg" class="form-input mono-val" value="${rental.vehicleReg || vehicle.reg}" style="font-size: 13px; font-weight: 800; padding: 6px 10px; height: 36px;" />
              </div>
              <div>
                <label style="font-size: 10px; font-weight: 800; color: #555;">VIN (IF KNOWN):</label>
                <input type="text" id="pdfVehVin" class="form-input mono-val" value="${vehicle.vin || 'WUAZZZ4G8MN900184'}" style="font-size: 12px; padding: 6px 10px; height: 36px;" />
              </div>
              <div>
                <label style="font-size: 10px; font-weight: 800; color: #555;">INSURANCE PROVIDER:</label>
                <input type="text" id="pdfVehInsurance" class="form-input" value="${vehicle.insuranceInfo || 'AVIVA COMMERCIAL FLEET'}" style="font-size: 12px; padding: 6px 10px; height: 36px;" />
              </div>
            </div>
          </div>

          <!-- Section 3: Loan Period (Fully Editable) -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 13px; font-weight: 900; letter-spacing: 0.05em; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 12px;">
              3. LOAN PERIOD
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
              <div>
                <label style="font-size: 10px; font-weight: 800; color: #555;">START DATE &amp; TIME:</label>
                <input type="datetime-local" id="pdfStartDate" class="form-input mono-val" value="${rental.startDate ? rental.startDate.slice(0,16) : new Date().toISOString().slice(0,16)}" style="font-size: 13px; font-weight: 700; padding: 6px 10px; height: 36px;" />
              </div>
              <div>
                <label style="font-size: 10px; font-weight: 800; color: #555;">END DATE &amp; TIME:</label>
                <input type="datetime-local" id="pdfEndDate" class="form-input mono-val" value="${rental.expectedReturnDate ? rental.expectedReturnDate.slice(0,16) : new Date(Date.now() + 5*86400000).toISOString().slice(0,16)}" style="font-size: 13px; font-weight: 700; padding: 6px 10px; height: 36px;" />
              </div>
            </div>
            <div style="font-size: 12px; font-style: italic; color: #444;">
              The Borrower agrees to return the vehicle by the agreed date and time unless otherwise agreed in writing.
            </div>
          </div>

          <!-- Section 4: Purpose of Use -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 13px; font-weight: 900; letter-spacing: 0.05em; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 6px;">
              4. PURPOSE OF USE
            </div>
            <div style="font-size: 12px; color: #222;">
              The vehicle is to be used only for lawful personal use and in accordance with UK road laws.
            </div>
          </div>

          <!-- Section 5: Borrower Obligations -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 13px; font-weight: 900; letter-spacing: 0.05em; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 6px;">
              5. BORROWER OBLIGATIONS
            </div>
            <ul style="font-size: 12px; padding-left: 18px; line-height: 1.6; color: #222;">
              <li>Hold a valid UK driving licence and be legally permitted to drive the vehicle.</li>
              <li>Drive responsibly and follow all laws.</li>
              <li>Not allow others to drive without written permission.</li>
              <li>Secure the vehicle when not in use.</li>
            </ul>
          </div>

          <!-- Section 6: Fines, Penalties & Damages -->
          <div style="margin-bottom: 20px; background-color: #F8F8F6; padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 13px; font-weight: 900; letter-spacing: 0.05em; margin-bottom: 6px;">
              6. FINES, PENALTIES &amp; DAMAGES
            </div>
            <div style="font-size: 12px; line-height: 1.5; color: #111;">
              The Borrower is fully responsible for any fines, parking tickets, speeding offences, tolls, congestion charges, and any related administrative fees incurred during the loan period. The Borrower is also fully responsible for any loss of or damage to the vehicle during the loan period, regardless of fault, and agrees to cover repair or replacement costs not covered by insurance.
            </div>
          </div>

          <!-- Section 7: Condition & Return -->
          <div style="margin-bottom: 24px;">
            <div style="font-size: 13px; font-weight: 900; letter-spacing: 0.05em; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 6px;">
              7. CONDITION &amp; RETURN
            </div>
            <div style="font-size: 12px; color: #222;">
              The vehicle must be returned in the same condition as provided, fair wear and tear excepted.
            </div>
          </div>

          <!-- Section 8: Signatures -->
          <div style="border: 2px solid #000000; border-radius: var(--radius-md); padding: 24px; background-color: #FFFFFF;">
            <div style="font-size: 13px; font-weight: 900; letter-spacing: 0.05em; margin-bottom: 16px;">
              8. SIGNATURES
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 20px;">
              
              <!-- Owner Signature (Editable) -->
              <div>
                <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); margin-bottom: 4px;">OWNER SIGNATURE:</div>
                <input type="text" 
                       id="pdfOwnerSignature" 
                       class="form-input" 
                       value="CAVE AUTOMOTIVE COMPLIANCE" 
                       style="font-size: 13px; font-weight: 800; padding: 6px 10px; height: 36px; border-color: #000;" />
                <div style="font-size: 11px; margin-top: 4px;" class="mono-val">Date: ${agreementDate}</div>
              </div>

              <!-- Borrower Signature -->
              <div>
                <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); margin-bottom: 6px;">BORROWER SIGNATURE:</div>
                
                ${isSigned ? `
                  <div style="border-bottom: 1px solid #000; padding-bottom: 4px; font-family: 'Brush Script MT', cursive, sans-serif; font-size: 32px; min-height: 36px; display: flex; align-items: flex-end; color: #000;">
                    ${customer.agreementSignature || customer.fullName}
                  </div>
                  <div style="font-size: 11px; margin-top: 4px; color: var(--apple-green); font-weight: 800;" class="mono-val">
                    ✓ SIGNED ON Date: ${customer.agreementSignedDate || agreementDate}
                  </div>
                ` : `
                  <div style="border-bottom: 1px dashed #000; min-height: 48px; display: flex; align-items: center; justify-content: center; background-color: #FAFAFC;">
                    <span style="font-size: 12px; color: var(--text-muted); font-weight: 700;">UNSIGNED &mdash; SIGN BELOW</span>
                  </div>
                  <div style="font-size: 11px; margin-top: 4px;" class="mono-val">Date: ${agreementDate}</div>
                `}

              </div>

            </div>

            <!-- Digital Signature Interactive Pad (When Unsigned) -->
            ${!isSigned ? `
              <div style="border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 800;">SIGN AGREEMENT ONLINE:</div>
                  <div style="display: flex; gap: 8px;">
                    <button type="button" class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.setSigType('TYPE')">TYPE SIGNATURE</button>
                    <button type="button" class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.setSigType('DRAW')">DRAW SIGNATURE</button>
                  </div>
                </div>

                ${signatureType === 'TYPE' ? `
                  <input type="text" 
                         id="typedSigInput" 
                         class="form-input" 
                         placeholder="TYPE YOUR FULL NAME TO SIGN (e.g. ${customer.fullName})" 
                         style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 26px; margin-bottom: 12px; height: 52px;" />
                ` : `
                  <div style="border: 1px solid #000; border-radius: var(--radius-sm); background: #FFFFFF; height: 100px; display: flex; align-items: center; justify-content: center; cursor: crosshair; margin-bottom: 12px;">
                    <span style="font-size: 12px; color: var(--text-muted); font-weight: 700;">DRAW BORROWER SIGNATURE HERE</span>
                  </div>
                `}

                <div style="display: flex; justify-content: flex-end;">
                  <button type="submit" class="btn-brutal" style="background-color: #000000 !important; color: #FFFFFF !important;">
                    SIGN &amp; EXECUTE UK BORROWING AGREEMENT &rarr;
                  </button>
                </div>
              </div>
            ` : ''}

          </div>

        </form>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <span style="font-size: 11px; font-weight: 700; color: var(--text-muted);">CAVE AUTOMOTIVE LEGAL CONTRACT VERIFIER</span>
          <button type="button" class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.closePdfModal()">DONE</button>
        </div>

      </div>
    </div>
  `;
}

window.app = window.app || {};

window.app.shareContractLink = function(customerId) {
  const url = `${window.location.origin}/#agreement-${customerId}`;
  navigator.clipboard.writeText(url);
  alert(`Contract link copied to clipboard!\n\n${url}\n\nYou can now text or email this link to the customer to sign on their iPhone.`);
};

window.app.setSigType = function(t) {
  signatureType = t;
  window.app.render();
};

window.app.confirmOnlineSignature = function(customerId) {
  let sigText = '';
  const inputEl = document.getElementById('typedSigInput');
  if (inputEl && inputEl.value.trim() !== '') {
    sigText = inputEl.value.trim();
  }
  
  // Read edited values from form inputs
  const ownerName = document.getElementById('pdfOwnerName')?.value;
  const ownerAddress = document.getElementById('pdfOwnerAddress')?.value;
  const borrowerName = document.getElementById('pdfBorrowerName')?.value;
  const borrowerAddress = document.getElementById('pdfBorrowerAddress')?.value;
  const borrowerLicence = document.getElementById('pdfBorrowerLicence')?.value;
  const vehMakeModel = document.getElementById('pdfVehMakeModel')?.value;
  const vehReg = document.getElementById('pdfVehReg')?.value;
  const vehVin = document.getElementById('pdfVehVin')?.value;
  const vehInsurance = document.getElementById('pdfVehInsurance')?.value;

  const cust = store.customers.find(c => c.id === customerId);
  if (cust) {
    if (borrowerName) cust.fullName = borrowerName;
    if (borrowerAddress) cust.address = borrowerAddress;
    if (borrowerLicence) cust.licenceNumber = borrowerLicence;
  }

  store.signCustomerAgreement(customerId, sigText);
  alert("UK Vehicle Loan Agreement details updated and executed successfully!");
  window.app.render();
};
