// RENTAL.OS Vehicle Return Workflow View

import { store } from '../store/appStore.js';

let returnState = {
  selectedRentalId: 'R00185',
  returnDate: '2026-08-12T18:00',
  returnMileage: 18720,
  returnFuel: 92,
  damageNotes: '',
  damageCost: 0,
  photosUploaded: true
};

export function renderReturnVehicleView() {
  const activeRentals = store.rentals.filter(r => r.status === 'ACTIVE' || r.status === 'RETURNING' || r.status === 'OVERDUE');
  const rental = store.rentals.find(r => r.id === returnState.selectedRentalId) || activeRentals[0] || store.rentals[0];
  const vehicle = store.vehicles.find(v => v.id === rental.vehicleId || v.reg === rental.vehicleReg);

  // Mileage and fuel calculations
  const startMileage = rental ? rental.startMileage : 0;
  const milesDriven = Math.max(0, returnState.returnMileage - startMileage);
  const extraMileage = Math.max(0, milesDriven - 500); // 500 miles free allowance
  const mileageFee = extraMileage * 1.5; // £1.50/mi for extra miles

  // Fuel calculation
  const fuelDifference = (rental ? rental.startFuel : 100) - returnState.returnFuel;
  const fuelFee = fuelDifference > 5 ? fuelDifference * 2.5 : 0; // £2.50 per % missing fuel

  // Late return calculation
  const expReturnMs = new Date(rental ? rental.expectedReturnDate : new Date()).getTime();
  const actualReturnMs = new Date(returnState.returnDate).getTime();
  const isLate = actualReturnMs > expReturnMs;
  const lateHours = isLate ? Math.ceil((actualReturnMs - expReturnMs) / (1000 * 60 * 60)) : 0;
  const lateFee = lateHours * 50; // £50/hr late penalty

  const totalAdditionalCharges = mileageFee + fuelFee + lateFee + returnState.damageCost;
  const finalTotalAmount = rental ? rental.baseAmount + totalAdditionalCharges : 0;

  return `
    <div class="page-container" style="max-width: 900px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <div class="label-meta">RETURN DISPATCH</div>
          <h1>RETURN VEHICLE INSP</h1>
        </div>
        <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.setView('DASHBOARD')">CANCEL</button>
      </div>

      <!-- Select Active Rental -->
      <div class="panel-brutal" style="margin-bottom: 24px;">
        <div class="label-meta" style="margin-bottom: 8px;">SELECT RENTAL TO RETURN</div>
        <select class="form-select" onchange="window.app.selectReturnRental(this.value)">
          ${activeRentals.map(r => `
            <option value="${r.id}" ${r.id === returnState.selectedRentalId ? 'selected' : ''}>
              #${r.id} &mdash; ${r.vehicleName} (${r.vehicleReg}) | CLIENT: ${r.customerName} [${r.status}]
            </option>
          `).join('')}
        </select>
      </div>

      ${rental ? `
        <!-- Original Lease Summary Panel -->
        <div class="panel-brutal" style="margin-bottom: 24px; background-color: var(--bg-dark); color: #FFFFFF;">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
            <div>
              <div class="label-meta" style="color: #8E8E88;">LEASE ID</div>
              <div class="mono-val" style="font-size: 16px; font-weight: 800; margin-top: 4px;">#${rental.id}</div>
            </div>
            <div>
              <div class="label-meta" style="color: #8E8E88;">VEHICLE</div>
              <div style="font-size: 16px; font-weight: 800; margin-top: 4px;">${rental.vehicleName}</div>
              <div class="mono-val" style="font-size: 11px; color: #B8B8B5;">${rental.vehicleReg}</div>
            </div>
            <div>
              <div class="label-meta" style="color: #8E8E88;">CUSTOMER</div>
              <div style="font-size: 16px; font-weight: 800; margin-top: 4px;">${rental.customerName}</div>
            </div>
            <div>
              <div class="label-meta" style="color: #8E8E88;">START MILEAGE</div>
              <div class="mono-val" style="font-size: 16px; font-weight: 800; margin-top: 4px;">${rental.startMileage.toLocaleString()} mi</div>
            </div>
          </div>
        </div>

        <!-- Inspection Form -->
        <div class="panel-brutal" style="margin-bottom: 24px;">
          <div class="panel-header">
            <div>
              <div class="label-meta">INSPECTION TELEMETRY</div>
              <h2>RETURN TELEMETRY & DAMAGE</h2>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div class="form-group">
              <label class="label-meta">ACTUAL RETURN DATE & TIME</label>
              <input type="datetime-local" class="form-input" value="${returnState.returnDate}" onchange="window.app.updateReturnField('returnDate', this.value)" />
            </div>

            <div class="form-group">
              <label class="label-meta">ODOMETER MILEAGE ON RETURN</label>
              <input type="number" class="form-input" value="${returnState.returnMileage}" onchange="window.app.updateReturnField('returnMileage', parseInt(this.value))" />
            </div>

            <div class="form-group">
              <label class="label-meta">RETURN FUEL LEVEL (%)</label>
              <input type="number" class="form-input" value="${returnState.returnFuel}" min="0" max="100" onchange="window.app.updateReturnField('returnFuel', parseInt(this.value))" />
            </div>

            <div class="form-group">
              <label class="label-meta">NEW DAMAGE SURCHARGE (&pound;)</label>
              <input type="number" class="form-input" value="${returnState.damageCost}" onchange="window.app.updateReturnField('damageCost', parseFloat(this.value))" />
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <label class="label-meta">INSPECTION DAMAGE & RETURN NOTES</label>
            <textarea class="form-textarea" rows="3" placeholder="Note any body scuffs, interior condition, or fuel levels..." onchange="window.app.updateReturnField('damageNotes', this.value)">${returnState.damageNotes}</textarea>
          </div>

          <!-- Photo Upload Simulator -->
          <div style="margin-bottom: 24px;">
            <div class="label-meta" style="margin-bottom: 8px;">VEHICLE RETURN PHOTOS</div>
            <div style="border: 1px dashed var(--border-dark); padding: 20px; background-color: var(--bg-canvas); text-align: center;">
              <div style="font-weight: 800; font-size: 13px;">4 INSPECTION PHOTOS ATTACHED ✓</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Front, Rear, Left Side, Right Side high-res photos captured</div>
            </div>
          </div>

          <!-- Automated Financial Recalculation -->
          <div style="padding: 20px; background-color: var(--bg-canvas); border: 1px solid var(--border-color); margin-bottom: 24px;">
            <div class="label-meta">AUTOMATED FINANCIAL RECALCULATION</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 12px; font-size: 13px;">
              <div>
                <span class="label-meta">BASE RENTAL:</span>
                <div class="mono-val" style="font-weight: 800; margin-top: 2px;">&pound;${rental.baseAmount.toLocaleString()}</div>
              </div>
              <div>
                <span class="label-meta">LATE FEE:</span>
                <div class="mono-val" style="font-weight: 800; color: ${lateFee > 0 ? 'var(--status-overdue)' : 'var(--text-main)'}; margin-top: 2px;">&pound;${lateFee}</div>
              </div>
              <div>
                <span class="label-meta">FUEL/MILEAGE FEES:</span>
                <div class="mono-val" style="font-weight: 800; margin-top: 2px;">&pound;${(fuelFee + mileageFee).toFixed(2)}</div>
              </div>
              <div>
                <span class="label-meta">FINAL TOTAL PAYABLE:</span>
                <div class="mono-val" style="font-weight: 900; font-size: 18px; color: var(--status-available); margin-top: 2px;">&pound;${finalTotalAmount.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button class="btn-brutal" style="background-color: var(--status-available); border-color: var(--status-available); padding: 14px 28px; font-size: 14px;"
                    onclick="window.app.submitCompleteReturn()">
              COMPLETE RENTAL &rarr;
            </button>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

window.app = window.app || {};

window.app.selectReturnRental = function(id) {
  returnState.selectedRentalId = id;
  const rental = store.rentals.find(r => r.id === id);
  if (rental) {
    returnState.returnMileage = rental.startMileage + 280;
  }
  window.app.render();
};

window.app.updateReturnField = function(key, val) {
  returnState[key] = val;
  window.app.render();
};

window.app.submitCompleteReturn = function() {
  store.completeReturn(returnState.selectedRentalId, returnState);
  alert(`Rental #${returnState.selectedRentalId} has been successfully COMPLETED. Vehicle is now AVAILABLE.`);
  window.app.setView('DASHBOARD');
};
