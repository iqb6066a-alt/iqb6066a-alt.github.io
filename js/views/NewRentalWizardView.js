// RENTAL.OS Multi-step New Rental Workflow Wizard

import { store } from '../store/appStore.js';

let wizardState = {
  step: 1,
  selectedCustomerId: 'C000184',
  newCustomerData: null,
  selectedVehicleId: 'V005',
  startDate: '2026-08-12T18:30',
  expectedReturnDate: '2026-08-16T18:30',
  dailyRate: 500,
  deposit: 1000,
  startMileage: 8200,
  startFuel: 100,
  notes: '',
  signed: false,
  signatureData: ''
};

export function renderNewRentalWizardView() {
  const step = wizardState.step;
  const customers = store.customers;
  const availableVehicles = store.vehicles.filter(v => v.status === 'AVAILABLE');

  const customer = customers.find(c => c.id === wizardState.selectedCustomerId) || customers[0];
  const vehicle = store.vehicles.find(v => v.id === wizardState.selectedVehicleId) || availableVehicles[0] || store.vehicles[0];

  // Calculate pricing
  const startMs = new Date(wizardState.startDate).getTime();
  const endMs = new Date(wizardState.expectedReturnDate).getTime();
  const diffDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)));
  const basePrice = diffDays * wizardState.dailyRate;
  const totalAmount = basePrice;

  return `
    <div class="page-container" style="max-width: 1000px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <div class="label-meta">DISPATCH WORKFLOW</div>
          <h1>CREATE NEW RENTAL</h1>
        </div>
        <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.setView('DASHBOARD')">CANCEL</button>
      </div>

      <!-- Step Indicator Bar -->
      <div class="panel-brutal" style="margin-bottom: 24px; padding: 16px; background-color: var(--bg-dark); color: #FFFFFF;">
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; text-align: center;">
          ${[
            { num: '01', label: 'CUSTOMER' },
            { num: '02', label: 'VEHICLE' },
            { num: '03', label: 'DETAILS' },
            { num: '04', label: 'DOCS' },
            { num: '05', label: 'AGREEMENT' },
            { num: '06', label: 'RELEASE' }
          ].map((s, idx) => `
            <div style="padding: 8px 4px; border-bottom: 2px solid ${step === idx + 1 ? '#FFFFFF' : step > idx + 1 ? 'var(--status-available)' : '#333333'}; opacity: ${step === idx + 1 ? 1 : 0.6};">
              <div class="mono-val" style="font-size: 11px; font-weight: 800; color: ${step > idx + 1 ? 'var(--status-available)' : '#FFFFFF'};">${s.num}</div>
              <div style="font-size: 10px; font-weight: 800; margin-top: 2px;">${s.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Step Contents -->
      <div class="panel-brutal">
        ${step === 1 ? `
          <!-- STEP 01: CUSTOMER SELECTION -->
          <div class="panel-header">
            <div>
              <div class="label-meta">STEP 01 OF 06</div>
              <h2>SELECT OR CREATE CUSTOMER</h2>
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <div class="label-meta">SEARCH EXISTING CUSTOMERS</div>
            <select class="form-select" onchange="window.app.wizardSelectCustomer(this.value)">
              ${customers.map(c => `
                <option value="${c.id}" ${c.id === wizardState.selectedCustomerId ? 'selected' : ''}>
                  ${c.fullName} — ${c.licenceNumber} (${c.phone})
                </option>
              `).join('')}
            </select>
          </div>

          ${customer ? `
            <div style="padding: 16px; background-color: var(--bg-canvas); border: 1px solid var(--border-color); margin-bottom: 24px;">
              <div style="font-weight: 800; font-size: 16px;">${customer.fullName}</div>
              <div class="mono-val" style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">ID: ${customer.id} | LICENCE: ${customer.licenceNumber} (EXP: ${customer.licenceExpiry})</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">EMAIL: ${customer.email} | PHONE: ${customer.phone}</div>
              <div style="margin-top: 8px;">
                <span class="status-pill status-active"><span class="status-dot"></span>${customer.verificationStatus}</span>
              </div>
            </div>
          ` : ''}

          <div style="border-top: 1px solid var(--border-color); pt: 16px; margin-top: 20px; padding-top: 20px;">
            <div class="label-meta" style="margin-bottom: 12px;">OR CREATE NEW CUSTOMER RECORD</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <input type="text" id="newCustName" class="form-input" placeholder="FULL NAME (e.g. DAVID MILLER)" />
              <input type="text" id="newCustLicence" class="form-input" placeholder="DRIVING LICENCE NO." />
              <input type="text" id="newCustPhone" class="form-input" placeholder="PHONE NUMBER" />
              <input type="email" id="newCustEmail" class="form-input" placeholder="EMAIL ADDRESS" />
            </div>
            <div style="margin-top: 12px;">
              <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.wizardCreateNewCustomer()">+ QUICK ADD CUSTOMER</button>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
            <button class="btn-brutal" onclick="window.app.wizardSetStep(2)">NEXT: SELECT VEHICLE &rarr;</button>
          </div>

        ` : step === 2 ? `
          <!-- STEP 02: VEHICLE SELECTION -->
          <div class="panel-header">
            <div>
              <div class="label-meta">STEP 02 OF 06</div>
              <h2>SELECT AVAILABLE VEHICLE</h2>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px;">
            ${availableVehicles.length === 0 ? `
              <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                NO VEHICLES CURRENTLY AVAILABLE FOR LEASE
              </div>
            ` : availableVehicles.map(v => `
              <div class="panel-brutal clickable-row" 
                   style="border: 2px solid ${v.id === wizardState.selectedVehicleId ? 'var(--text-main)' : 'var(--border-color)'}; background-color: ${v.id === wizardState.selectedVehicleId ? 'var(--bg-card)' : 'var(--bg-canvas)'};"
                   onclick="window.app.wizardSelectVehicle('${v.id}', ${v.dailyRate}, ${v.mileage}, ${v.fuelLevel})">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <span class="mono-val" style="font-size: 11px; font-weight: 700;">${v.reg}</span>
                  <span class="status-pill status-available"><span class="status-dot"></span>AVAILABLE</span>
                </div>
                <div style="font-weight: 900; font-size: 16px; margin-top: 8px;">${v.make} ${v.model}</div>
                <div style="display: flex; justify-content: space-between; margin-top: 16px; font-size: 12px;">
                  <span style="color: var(--text-muted);">${v.mileage.toLocaleString()} mi</span>
                  <span class="mono-val" style="font-weight: 900; font-size: 14px;">&pound;${v.dailyRate} / DAY</span>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 24px;">
            <button class="btn-brutal btn-brutal-secondary" onclick="window.app.wizardSetStep(1)">&larr; BACK</button>
            <button class="btn-brutal" onclick="window.app.wizardSetStep(3)">NEXT: RENTAL DETAILS &rarr;</button>
          </div>

        ` : step === 3 ? `
          <!-- STEP 03: RENTAL DETAILS -->
          <div class="panel-header">
            <div>
              <div class="label-meta">STEP 03 OF 06</div>
              <h2>RENTAL TERMS & DATES</h2>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div class="form-group">
              <label class="label-meta">START DATE & TIME</label>
              <input type="datetime-local" class="form-input" value="${wizardState.startDate}" onchange="window.app.wizardUpdateTerm('startDate', this.value)" />
            </div>

            <div class="form-group">
              <label class="label-meta">EXPECTED RETURN DATE & TIME</label>
              <input type="datetime-local" class="form-input" value="${wizardState.expectedReturnDate}" onchange="window.app.wizardUpdateTerm('expectedReturnDate', this.value)" />
            </div>

            <div class="form-group">
              <label class="label-meta">DAILY RENTAL RATE (&pound;)</label>
              <input type="number" class="form-input" value="${wizardState.dailyRate}" onchange="window.app.wizardUpdateTerm('dailyRate', parseFloat(this.value))" />
            </div>

            <div class="form-group">
              <label class="label-meta">DEPOSIT AMOUNT (&pound;)</label>
              <input type="number" class="form-input" value="${wizardState.deposit}" onchange="window.app.wizardUpdateTerm('deposit', parseFloat(this.value))" />
            </div>

            <div class="form-group">
              <label class="label-meta">START MILEAGE</label>
              <input type="number" class="form-input" value="${wizardState.startMileage}" onchange="window.app.wizardUpdateTerm('startMileage', parseInt(this.value))" />
            </div>

            <div class="form-group">
              <label class="label-meta">START FUEL LEVEL (%)</label>
              <input type="number" class="form-input" value="${wizardState.startFuel}" min="0" max="100" onchange="window.app.wizardUpdateTerm('startFuel', parseInt(this.value))" />
            </div>
          </div>

          <!-- Auto Calculation Summary Panel -->
          <div style="padding: 20px; background-color: var(--bg-dark); color: #FFFFFF; margin-bottom: 24px;">
            <div class="label-meta" style="color: #8E8E88;">AUTOMATED CALCULATIONS</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 12px;">
              <div>
                <div class="label-meta" style="color: #8E8E88;">LEASE DURATION</div>
                <div class="mono-val" style="font-size: 20px; font-weight: 900;">${diffDays} DAYS</div>
              </div>
              <div>
                <div class="label-meta" style="color: #8E8E88;">BASE CHARGE</div>
                <div class="mono-val" style="font-size: 20px; font-weight: 900;">&pound;${basePrice.toLocaleString()}</div>
              </div>
              <div>
                <div class="label-meta" style="color: #8E8E88;">DEPOSIT HELD</div>
                <div class="mono-val" style="font-size: 20px; font-weight: 900;">&pound;${wizardState.deposit.toLocaleString()}</div>
              </div>
              <div>
                <div class="label-meta" style="color: #8E8E88;">TOTAL PAYABLE</div>
                <div class="mono-val" style="font-size: 20px; font-weight: 900; color: var(--status-available);">&pound;${totalAmount.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between;">
            <button class="btn-brutal btn-brutal-secondary" onclick="window.app.wizardSetStep(2)">&larr; BACK</button>
            <button class="btn-brutal" onclick="window.app.wizardSetStep(4)">NEXT: VERIFY DOCUMENTS &rarr;</button>
          </div>

        ` : step === 4 ? `
          <!-- STEP 04: DOCUMENT VERIFICATION -->
          <div class="panel-header">
            <div>
              <div class="label-meta">STEP 04 OF 06</div>
              <h2>DOCUMENT & LICENCE VERIFICATION</h2>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div style="border: 1px solid var(--border-color); padding: 16px; background-color: var(--bg-canvas);">
              <div style="font-weight: 800; font-size: 14px;">DRIVING LICENCE</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">VERIFIED: ${customer ? customer.licenceNumber : 'YES'}</div>
              <div style="margin-top: 12px;">
                <span class="status-pill status-active"><span class="status-dot"></span>LICENCE VALID</span>
              </div>
            </div>

            <div style="border: 1px solid var(--border-color); padding: 16px; background-color: var(--bg-canvas);">
              <div style="font-weight: 800; font-size: 14px;">PASSPORT / NATIONAL ID</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">VERIFIED: PASSPORT_UK.PDF</div>
              <div style="margin-top: 12px;">
                <span class="status-pill status-active"><span class="status-dot"></span>ID VERIFIED</span>
              </div>
            </div>

            <div style="border: 1px solid var(--border-color); padding: 16px; background-color: var(--bg-canvas);">
              <div style="font-weight: 800; font-size: 14px;">INSURANCE COVER</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">POLICY: ${vehicle.insuranceInfo}</div>
              <div style="margin-top: 12px;">
                <span class="status-pill status-active"><span class="status-dot"></span>INSURANCE ACTIVE</span>
              </div>
            </div>

            <div style="border: 1px solid var(--border-color); padding: 16px; background-color: var(--bg-canvas);">
              <div style="font-weight: 800; font-size: 14px;">MOT & SERVICE VALIDATION</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">MOT EXPIRY: ${vehicle.motExpiry}</div>
              <div style="margin-top: 12px;">
                <span class="status-pill status-active"><span class="status-dot"></span>MOT COMPLIANT</span>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between;">
            <button class="btn-brutal btn-brutal-secondary" onclick="window.app.wizardSetStep(3)">&larr; BACK</button>
            <button class="btn-brutal" onclick="window.app.wizardSetStep(5)">NEXT: SIGN AGREEMENT &rarr;</button>
          </div>

        ` : step === 5 ? `
          <!-- STEP 05: LEGAL AGREEMENT & DIGITAL SIGNATURE -->
          <div class="panel-header">
            <div>
              <div class="label-meta">STEP 05 OF 06</div>
              <h2>RENTAL AGREEMENT & DIGITAL SIGNATURE</h2>
            </div>
            ${wizardState.signed ? `
              <span class="status-pill status-active" style="font-size: 12px;"><span class="status-dot"></span>AGREEMENT SIGNED ✓</span>
            ` : ''}
          </div>

          <div style="padding: 20px; background-color: #FAFAFA; border: 1px solid var(--border-color); max-height: 200px; overflow-y: auto; margin-bottom: 20px; font-size: 12px; font-family: var(--font-mono);">
            <div style="font-weight: 900; font-size: 14px; margin-bottom: 8px;">RENTAL.OS OPERATING AGREEMENT &mdash; CONTRACT SPECIFICATION</div>
            <p>Customer <strong>${customer.fullName}</strong> agrees to lease <strong>${vehicle.make} ${vehicle.model} (${vehicle.reg})</strong> from RENTAL.OS for <strong>${diffDays} DAYS</strong> starting <strong>${new Date(wizardState.startDate).toLocaleString('en-GB')}</strong> at &pound;${wizardState.dailyRate}/day for a total payable of &pound;${totalAmount}. Security deposit of &pound;${wizardState.deposit} is held.</p>
            <p style="margin-top: 8px;">The customer agrees to return the vehicle in identical mechanical condition, adhering to speed limits and UK traffic legislation. Track use strictly prohibited.</p>
          </div>

          <div style="margin-bottom: 20px;">
            <div class="label-meta" style="margin-bottom: 8px;">CUSTOMER DIGITAL SIGNATURE</div>
            <div style="border: 1px dashed var(--border-dark); background: #FFFFFF; height: 140px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;"
                 onclick="window.app.wizardSimulateSignature()">
              ${wizardState.signed ? `
                <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 32px; color: var(--text-main); font-weight: 700; transform: rotate(-3deg);">${customer.fullName}</div>
                <div style="font-size: 10px; color: var(--status-available); font-weight: 800; margin-top: 8px;">DIGITALLY SIGNED & VERIFIED ✓</div>
              ` : `
                <div style="font-size: 13px; font-weight: 700; color: var(--text-muted);">CLICK TO SIGN DIGITALLY AS ${customer.fullName}</div>
                <div class="label-meta" style="margin-top: 4px; font-size: 10px;">MOUSE / TOUCHPAD SIGNATURE PAD</div>
              `}
            </div>
          </div>

          <div style="display: flex; justify-content: space-between;">
            <button class="btn-brutal btn-brutal-secondary" onclick="window.app.wizardSetStep(4)">&larr; BACK</button>
            <button class="btn-brutal" ${!wizardState.signed ? 'disabled style="opacity:0.5;"' : ''} onclick="window.app.wizardSetStep(6)">NEXT: FINAL RELEASE SUMMARY &rarr;</button>
          </div>

        ` : `
          <!-- STEP 06: FINAL RELEASE VEHICLE -->
          <div class="panel-header">
            <div>
              <div class="label-meta">STEP 06 OF 06</div>
              <h2>FINAL RELEASE CONFIRMATION</h2>
            </div>
          </div>

          <div style="padding: 24px; background-color: var(--bg-dark); color: #FFFFFF; margin-bottom: 24px;">
            <div style="font-size: 24px; font-weight: 900;">${vehicle.make} ${vehicle.model}</div>
            <div class="mono-val" style="font-size: 14px; color: #B8B8B5; margin-top: 2px;">REGISTRATION: ${vehicle.reg}</div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; border-top: 1px solid #272727; border-bottom: 1px solid #272727; padding: 16px 0; margin: 16px 0;">
              <div>
                <div class="label-meta" style="color: #8E8E88;">CUSTOMER</div>
                <div style="font-weight: 800; font-size: 15px; margin-top: 4px;">${customer.fullName}</div>
              </div>

              <div>
                <div class="label-meta" style="color: #8E8E88;">DEPARTURE MILEAGE</div>
                <div class="mono-val" style="font-weight: 800; font-size: 15px; margin-top: 4px;">${wizardState.startMileage.toLocaleString()} mi</div>
              </div>

              <div>
                <div class="label-meta" style="color: #8E8E88;">FUEL LEVEL</div>
                <div class="mono-val" style="font-weight: 800; font-size: 15px; margin-top: 4px;">${wizardState.startFuel}%</div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div class="label-meta" style="color: #8E8E88;">TOTAL DUE</div>
                <div class="number-huge" style="font-size: 28px; color: var(--status-available); margin-top: 2px;">&pound;${totalAmount.toLocaleString()}</div>
              </div>

              <div style="text-align: right;">
                <span class="status-pill status-active"><span class="status-dot"></span>READY FOR RELEASE</span>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between;">
            <button class="btn-brutal btn-brutal-secondary" onclick="window.app.wizardSetStep(5)">&larr; BACK</button>
            <button class="btn-brutal" style="background-color: var(--status-available); border-color: var(--status-available); padding: 14px 28px; font-size: 14px;" 
                    onclick="window.app.wizardSubmitRelease()">
              RELEASE VEHICLE &rarr;
            </button>
          </div>
        `}
      </div>
    </div>
  `;
}

window.app = window.app || {};

window.app.wizardSetStep = function(s) {
  wizardState.step = s;
  window.app.render();
};

window.app.wizardSelectCustomer = function(id) {
  wizardState.selectedCustomerId = id;
  window.app.render();
};

window.app.wizardCreateNewCustomer = function() {
  const name = document.getElementById('newCustName').value;
  const licence = document.getElementById('newCustLicence').value;
  const phone = document.getElementById('newCustPhone').value;
  const email = document.getElementById('newCustEmail').value;

  if (!name || !licence) {
    alert('Please enter Customer Name and Licence Number.');
    return;
  }

  const created = store.addCustomer({ fullName: name.toUpperCase(), licenceNumber: licence, phone, email });
  wizardState.selectedCustomerId = created.id;
  alert(`Customer ${created.fullName} created successfully.`);
  window.app.render();
};

window.app.wizardSelectVehicle = function(id, rate, mileage, fuel) {
  wizardState.selectedVehicleId = id;
  wizardState.dailyRate = rate;
  wizardState.startMileage = mileage;
  wizardState.startFuel = fuel;
  window.app.render();
};

window.app.wizardUpdateTerm = function(key, val) {
  wizardState[key] = val;
  window.app.render();
};

window.app.wizardSimulateSignature = function() {
  wizardState.signed = true;
  wizardState.signatureData = 'SIGNED_OK';
  window.app.render();
};

window.app.wizardSubmitRelease = function() {
  const newRental = store.createRental({
    customerId: wizardState.selectedCustomerId,
    vehicleId: wizardState.selectedVehicleId,
    startDate: wizardState.startDate,
    expectedReturnDate: wizardState.expectedReturnDate,
    dailyRate: wizardState.dailyRate,
    deposit: wizardState.deposit,
    startMileage: wizardState.startMileage,
    startFuel: wizardState.startFuel,
    notes: wizardState.notes
  });

  alert(`Vehicle successfully released! Rental #${newRental.id} is now ACTIVE.`);
  wizardState.step = 1;
  wizardState.signed = false;
  window.app.setView('RENTAL_DETAIL', { rentalId: newRental.id });
};
