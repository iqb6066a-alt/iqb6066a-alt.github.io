// CAVE Add & Edit Vehicle Modals - High Contrast Buttons

import { store } from '../store/appStore.js';

export function renderAddVehicleModal() {
  if (!store.addVehicleModalOpen) return '';

  return `
    <div class="modal-overlay" onclick="if(event.target === this) window.app.toggleAddVehicleModal(false)">
      <div class="modal-brutal" style="max-width: 600px;">
        <div class="modal-header" style="background: #000000; color: #FFFFFF;">
          <div>
            <div class="label-meta" style="color: #8E8E93;">FLEET CATALOG</div>
            <div style="font-weight: 800; font-size: 18px; color: #FFFFFF;">+ ADD NEW VEHICLE TO FLEET</div>
          </div>
          <button type="button" class="btn-brutal btn-brutal-secondary btn-brutal-sm" style="background: #2C2C2E !important; color: #FFFFFF !important; border: none;" onclick="window.app.toggleAddVehicleModal(false)">ESC</button>
        </div>

        <form onsubmit="event.preventDefault(); window.app.submitAddVehicleForm();" class="modal-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            
            <div class="form-group">
              <label class="label-meta">MAKE (e.g. AUDI, PORSCHE)</label>
              <input type="text" id="addMake" class="form-input" placeholder="AUDI" required />
            </div>

            <div class="form-group">
              <label class="label-meta">MODEL (e.g. RS7, 911 GT3)</label>
              <input type="text" id="addModel" class="form-input" placeholder="RS7 SPORTBACK" required />
            </div>

            <div class="form-group">
              <label class="label-meta">REGISTRATION NUMBER</label>
              <input type="text" id="addReg" class="form-input" placeholder="XX24 CAVE" required />
            </div>

            <div class="form-group">
              <label class="label-meta">DAILY RENTAL RATE (&pound;/DAY)</label>
              <input type="number" id="addDailyRate" class="form-input" placeholder="250" required />
            </div>

            <div class="form-group">
              <label class="label-meta">WEEKLY RENTAL RATE (&pound;/WEEK)</label>
              <input type="number" id="addWeeklyRate" class="form-input" placeholder="1500" />
            </div>

            <div class="form-group">
              <label class="label-meta">CURRENT ODOMETER (MILES)</label>
              <input type="number" id="addMileage" class="form-input" placeholder="12000" />
            </div>

            <div class="form-group">
              <label class="label-meta">YEAR</label>
              <input type="number" id="addYear" class="form-input" value="2025" />
            </div>

            <div class="form-group">
              <label class="label-meta">COLOUR</label>
              <input type="text" id="addColour" class="form-input" placeholder="Nardo Grey" />
            </div>

          </div>

          <div class="form-group" style="margin-top: 12px;">
            <label class="label-meta">STUDIO CUTOUT IMAGE URL</label>
            <select id="addImageSelect" class="form-select">
              <option value="https://pngimg.com/d/audi_PNG99285.png">Audi RS7 Cutout (PNG)</option>
              <option value="https://pngimg.com/d/mercedes_PNG1864.png">Mercedes G63 AMG Cutout (PNG)</option>
              <option value="https://pngimg.com/d/porsche_PNG10622.png">Porsche 911 Cutout (PNG)</option>
              <option value="https://pngimg.com/d/bmw_PNG99553.png">BMW M4 Cutout (PNG)</option>
              <option value="https://pngimg.com/d/lamborghini_PNG10709.png">Lamborghini Urus Cutout (PNG)</option>
            </select>
          </div>

          <div class="modal-footer" style="padding-x: 0; padding-bottom: 0;">
            <button type="button" class="btn-brutal btn-brutal-secondary" onclick="window.app.toggleAddVehicleModal(false)">CANCEL</button>
            <button type="submit" class="btn-brutal" style="background-color: #000000 !important; color: #FFFFFF !important;">+ SAVE VEHICLE TO FLEET</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function renderEditVehicleModal() {
  if (!store.editVehicleModalOpen || !store.activeVehicleToEdit) return '';

  const v = store.activeVehicleToEdit;

  return `
    <div class="modal-overlay" onclick="if(event.target === this) window.app.closeEditVehicleModal()">
      <div class="modal-brutal" style="max-width: 600px;">
        <div class="modal-header" style="background: #000000; color: #FFFFFF;">
          <div>
            <div class="label-meta" style="color: #8E8E93;">PRICING & ASSET SPECIFICATION</div>
            <div style="font-weight: 800; font-size: 18px; color: #FFFFFF;">EDIT ${v.make} ${v.model} (${v.reg})</div>
          </div>
          <button type="button" class="btn-brutal btn-brutal-secondary btn-brutal-sm" style="background: #2C2C2E !important; color: #FFFFFF !important; border: none;" onclick="window.app.closeEditVehicleModal()">ESC</button>
        </div>

        <form onsubmit="event.preventDefault(); window.app.submitEditVehicleForm('${v.id}');" class="modal-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            
            <div class="form-group">
              <label class="label-meta">DAILY RENTAL RATE (&pound;/DAY)</label>
              <input type="number" id="editDailyRate" class="form-input" value="${v.dailyRate}" required />
            </div>

            <div class="form-group">
              <label class="label-meta">WEEKLY RENTAL RATE (&pound;/WEEK)</label>
              <input type="number" id="editWeeklyRate" class="form-input" value="${v.weeklyRate || v.dailyRate * 6}" required />
            </div>

            <div class="form-group">
              <label class="label-meta">FLEET STATUS</label>
              <select id="editStatus" class="form-select">
                <option value="AVAILABLE" ${v.status === 'AVAILABLE' ? 'selected' : ''}>AVAILABLE</option>
                <option value="RENTED" ${v.status === 'RENTED' ? 'selected' : ''}>RENTED</option>
                <option value="RETURNING" ${v.status === 'RETURNING' ? 'selected' : ''}>RETURNING</option>
                <option value="MAINTENANCE" ${v.status === 'MAINTENANCE' ? 'selected' : ''}>MAINTENANCE</option>
              </select>
            </div>

            <div class="form-group">
              <label class="label-meta">ODOMETER (MILES)</label>
              <input type="number" id="editMileage" class="form-input" value="${v.mileage}" required />
            </div>

            <div class="form-group">
              <label class="label-meta">FUEL LEVEL (%)</label>
              <input type="number" id="editFuelLevel" class="form-input" value="${v.fuelLevel}" min="0" max="100" required />
            </div>

            <div class="form-group">
              <label class="label-meta">INSURANCE POLICY</label>
              <input type="text" id="editInsurance" class="form-input" value="${v.insuranceInfo}" />
            </div>

          </div>

          <div class="modal-footer" style="padding-x: 0; padding-bottom: 0;">
            <button type="button" class="btn-brutal btn-brutal-secondary" onclick="window.app.closeEditVehicleModal()">CANCEL</button>
            <button type="submit" class="btn-brutal" style="background-color: #000000 !important; color: #FFFFFF !important;">SAVE PRICE & DETAILS &rarr;</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

window.app = window.app || {};

window.app.submitAddVehicleForm = function() {
  const make = document.getElementById('addMake').value;
  const model = document.getElementById('addModel').value;
  const reg = document.getElementById('addReg').value;
  const dailyRate = document.getElementById('addDailyRate').value;
  const weeklyRate = document.getElementById('addWeeklyRate').value;
  const mileage = document.getElementById('addMileage').value;
  const year = document.getElementById('addYear').value;
  const colour = document.getElementById('addColour').value;
  const image = document.getElementById('addImageSelect').value;

  const created = store.addVehicle({ make, model, reg, dailyRate, weeklyRate, mileage, year, colour, image });
  alert(`Vehicle ${created.make} ${created.model} (${created.reg}) added to CAVE fleet successfully!`);
};

window.app.submitEditVehicleForm = function(id) {
  const dailyRate = parseFloat(document.getElementById('editDailyRate').value);
  const weeklyRate = parseFloat(document.getElementById('editWeeklyRate').value);
  const status = document.getElementById('editStatus').value;
  const mileage = parseInt(document.getElementById('editMileage').value);
  const fuelLevel = parseInt(document.getElementById('editFuelLevel').value);
  const insuranceInfo = document.getElementById('editInsurance').value;

  store.updateVehicle(id, { dailyRate, weeklyRate, status, mileage, fuelLevel, insuranceInfo });
  alert("Vehicle prices and details updated successfully!");
};
