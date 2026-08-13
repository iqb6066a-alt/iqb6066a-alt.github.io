// CAVE Tickets & AI Legal Appeal Assistant View - Matched Customer & Contract Refs

import { store } from '../store/appStore.js';

let ticketStatusFilter = 'ALL';
let generatedAppealText = '';
let activeTicketForAi = null;

const CONTRAVENTION_PRESETS = [
  { code: 'Code 31: Box Junction', desc: 'Entering and stopping in a box junction when prohibited' },
  { code: 'Code 01: Parking Restriction', desc: 'Parked in a restricted street during prescribed hours' },
  { code: 'Code 52: Bus Lane', desc: 'Failing to comply with a prohibition on certain types of vehicle (Bus Lane)' },
  { code: 'Code 33: Bus Gate', desc: 'Using a route restricted to certain vehicles' },
  { code: 'Code 12: Resident Bay', desc: 'Parked in a residents or shared use parking place without a permit' },
  { code: 'Code 02: Loading Bay', desc: 'Parked or loading/unloading in a restricted street' }
];

export function renderTicketsView() {
  const tickets = store.tickets;
  const customers = store.customers;
  const vehicles = store.vehicles;

  const filteredTickets = ticketStatusFilter === 'ALL' 
    ? tickets 
    : tickets.filter(t => t.status === ticketStatusFilter);

  // Quick stats
  const unpaidCount = tickets.filter(t => t.status === 'UNPAID' || t.status === 'UNAPPEALED').length;
  const paidCount = tickets.filter(t => t.status === 'PAID').length;
  const appealedCount = tickets.filter(t => t.status === 'APPEALED' || t.status === 'APPEAL_SENT').length;

  return `
    <div class="page-container">
      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <div class="label-meta">PENALTY CHARGE NOTICES & FINES</div>
          <h1>TICKETS & FINES</h1>
        </div>
        <button class="btn-brutal" onclick="window.app.toggleAddTicketForm()">+ LOG NEW TICKET</button>
      </div>

      <!-- Ticket Status Overview Stat Bar -->
      <div class="stats-grid" style="margin-bottom: 24px;">
        <div class="stat-box">
          <div class="label-meta">UNPAID / PENDING FINES</div>
          <div class="number-huge" style="margin-top: 8px; color: var(--apple-red);">${unpaidCount}</div>
        </div>
        <div class="stat-box">
          <div class="label-meta">PAID FINES</div>
          <div class="number-huge" style="margin-top: 8px; color: var(--apple-green);">${paidCount}</div>
        </div>
        <div class="stat-box">
          <div class="label-meta">APPEALED TO COUNCIL</div>
          <div class="number-huge" style="margin-top: 8px; color: var(--apple-blue);">${appealedCount}</div>
        </div>
      </div>

      <!-- Ticket Registration Form (Hidden by default) -->
      <div id="addTicketFormEl" class="panel-brutal" style="display: none; margin-bottom: 28px; background: #FFFFFF;">
        <div class="panel-header">
          <div>
            <div class="label-meta">NEW PCN LOGGING</div>
            <h3>LOG PENALTY CHARGE NOTICE</h3>
          </div>
          <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.toggleAddTicketForm()">CLOSE</button>
        </div>

        <form onsubmit="event.preventDefault(); window.app.submitAddTicket();" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
          
          <div class="form-group">
            <label class="label-meta">PCN REFERENCE NUMBER *</label>
            <input type="text" id="tckRef" class="form-input" placeholder="e.g. PCN-99814-LON" required />
          </div>

          <div class="form-group">
            <label class="label-meta">CUSTOMER / DRIVER *</label>
            <select id="tckCust" class="form-select" required>
              ${customers.map(c => `<option value="${c.id}">${c.fullName} (${c.licenceNumber})</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="label-meta">VEHICLE *</label>
            <select id="tckVeh" class="form-select" required>
              ${vehicles.map(v => `<option value="${v.id}">${v.make} ${v.model} (${v.reg})</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="label-meta">CONTRAVENTION CODE *</label>
            <select id="tckCode" class="form-select" required>
              ${CONTRAVENTION_PRESETS.map(p => `<option value="${p.code}">${p.code} &mdash; ${p.desc}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="label-meta">INITIAL TICKET STATUS *</label>
            <select id="tckInitialStatus" class="form-select" required>
              <option value="UNPAID">UNPAID (Pending Decision)</option>
              <option value="UNAPPEALED">UNAPPEALED</option>
              <option value="PAID">PAID (Valid Ticket Paid)</option>
              <option value="APPEALED">APPEALED</option>
            </select>
          </div>

          <div class="form-group">
            <label class="label-meta">FINE AMOUNT (&pound;) *</label>
            <input type="number" id="tckFine" class="form-input" value="130" required />
          </div>

          <div class="form-group">
            <label class="label-meta">ISSUE DATE & TIME</label>
            <input type="datetime-local" id="tckDate" class="form-input" value="${new Date().toISOString().slice(0,16)}" />
          </div>

          <div style="grid-column: 1/-1; display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
            <button type="button" class="btn-brutal btn-brutal-secondary" onclick="window.app.toggleAddTicketForm()">CANCEL</button>
            <button type="submit" class="btn-brutal">+ LOG TICKET & OPEN AI APPEAL GENERATOR &rarr;</button>
          </div>

        </form>
      </div>

      <!-- AI Ticket Appeal Assistant Panel -->
      <div class="panel-brutal" style="margin-bottom: 28px; background: linear-gradient(135deg, #000000 0%, #1C1C1E 100%); color: #FFFFFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <div class="label-meta" style="color: #007AFF;">🤖 AI LEGAL APPEAL ASSISTANT</div>
            <h2 style="color: #FFFFFF; margin-top: 2px;">IF YOU'RE TOO SLOW TO APPEAL YOURSELF, USE THIS.</h2>
          </div>
          <span class="status-pill status-active" style="background: rgba(52, 199, 89, 0.2); color: #34C759;">UK ROAD TRAFFIC ACT READY ✓</span>
        </div>

        <p style="font-size: 13px; color: #8E8E93; margin-bottom: 20px; max-width: 800px;">
          Select any ticket below to automatically generate an official legal representation letter under Schedule 10 of the Road Traffic Act with 100% matched customer & contract reference codes.
        </p>

        <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px;">
          ${tickets.map(t => `
            <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" 
                    style="${activeTicketForAi && activeTicketForAi.id === t.id ? 'background: #007AFF !important; color: #FFF !important;' : 'background: rgba(255,255,255,0.15) !important; color: #FFF !important;'}"
                    onclick="window.app.selectTicketForAi('${t.id}')">
              ${t.ticketRef} (${t.customerName}) &bull; ${t.status}
            </button>
          `).join('')}
        </div>

        ${activeTicketForAi ? `
          <div style="background: rgba(255,255,255,0.08); border-radius: var(--radius-md); padding: 20px; border: 1px solid rgba(255,255,255,0.12);">
            <div style="font-size: 14px; font-weight: 800; margin-bottom: 10px;">
              TARGET TICKET: ${activeTicketForAi.ticketRef} &bull; ${activeTicketForAi.contraventionCode} &bull; ${activeTicketForAi.customerName}
            </div>

            <div style="display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap;">
              <button class="btn-brutal btn-brutal-sm" style="background: #007AFF !important;" onclick="window.app.generateAiAppealLetter('HIRE_TRANSFER')">
                🤖 GENERATE TRANSFER LIABILITY TO CLIENT LETTER
              </button>
              <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" style="background: rgba(255,255,255,0.2) !important; color: #FFF !important;" onclick="window.app.generateAiAppealLetter('OBSCURED_SIGN')">
                🤖 GENERATE INVALID SIGNAGE APPEAL
              </button>
            </div>

            ${generatedAppealText ? `
              <div style="margin-top: 14px;">
                <div class="label-meta" style="color: #8E8E93; margin-bottom: 6px;">GENERATED LEGAL APPEAL LETTER (MATCHED CONTRACT REFS)</div>
                <textarea class="form-textarea" style="height: 220px; font-family: var(--font-mono); font-size: 12px; background: #000; color: #34C759; border-color: rgba(255,255,255,0.2);">${generatedAppealText}</textarea>
                <div style="margin-top: 10px; display: flex; justify-content: flex-end; gap: 10px;">
                  <button class="btn-brutal btn-brutal-sm" style="background: #34C759 !important; color: #000 !important;" onclick="window.app.copyAppealText()">📋 COPY APPEAL LETTER</button>
                  <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" style="background: rgba(255,255,255,0.2) !important; color: #FFF !important;" onclick="window.app.markAppealStatus('${activeTicketForAi.id}', 'APPEALED')">✓ MARK AS APPEALED</button>
                </div>
              </div>
            ` : ''}
          </div>
        ` : `
          <div style="font-size: 12px; color: #636366;">Click any ticket above to generate an instant legal appeal letter.</div>
        `}
      </div>

      <!-- iOS Segmented Filter Tabs -->
      <div class="tabs-nav">
        ${['ALL', 'UNPAID', 'PAID', 'UNAPPEALED', 'APPEALED'].map(st => `
          <button class="tab-item ${ticketStatusFilter === st ? 'active' : ''}" onclick="window.app.setTicketStatusFilter('${st}')">
            ${st}
          </button>
        `).join('')}
      </div>

      <!-- Tickets Table with Status Toggles -->
      <div class="panel-brutal">
        <div class="panel-header">
          <div>
            <div class="label-meta">LOGGED PCNS & FINES</div>
            <h2>TICKETS MANAGEMENT & STATUS</h2>
          </div>
        </div>

        <div class="table-container">
          <table class="table-brutal">
            <thead>
              <tr>
                <th>PCN REF</th>
                <th>CUSTOMER / DRIVER</th>
                <th>VEHICLE</th>
                <th>CONTRAVENTION</th>
                <th>FINE</th>
                <th>DEADLINE</th>
                <th>PAYMENT / APPEAL STATUS</th>
                <th>CHANGE STATUS</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTickets.length === 0 ? `
                <tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 28px;">NO TICKETS FOUND FOR STATUS "${ticketStatusFilter}"</td></tr>
              ` : filteredTickets.map(t => `
                <tr>
                  <td class="mono-val" style="font-weight: 800;">${t.ticketRef}</td>
                  <td style="font-weight: 700;">${t.customerName}</td>
                  <td class="mono-val">${t.vehicleReg}</td>
                  <td style="font-size: 13px;">${t.contraventionCode}</td>
                  <td class="mono-val" style="font-weight: 800;">&pound;${t.fineAmount}</td>
                  <td>
                    <span class="mono-val" style="font-size: 11px; color: var(--text-muted);">
                      ${t.appealDeadline}
                    </span>
                  </td>
                  <td>
                    ${t.status === 'PAID' ? `
                      <span class="status-pill status-active"><span class="status-dot"></span>PAID ✓</span>
                    ` : t.status === 'APPEALED' || t.status === 'APPEAL_SENT' ? `
                      <span class="status-pill status-returning"><span class="status-dot"></span>APPEALED</span>
                    ` : t.status === 'UNPAID' ? `
                      <span class="status-pill status-overdue"><span class="status-dot"></span>UNPAID</span>
                    ` : `
                      <span class="status-pill status-returning"><span class="status-dot"></span>UNAPPEALED</span>
                    `}
                  </td>
                  <td>
                    <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                      <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" style="font-size: 10px; padding: 4px 8px;" onclick="window.app.markAppealStatus('${t.id}', 'PAID')">
                        PAID
                      </button>
                      <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" style="font-size: 10px; padding: 4px 8px;" onclick="window.app.markAppealStatus('${t.id}', 'UNPAID')">
                        UNPAID
                      </button>
                      <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" style="font-size: 10px; padding: 4px 8px;" onclick="window.app.markAppealStatus('${t.id}', 'APPEALED')">
                        APPEALED
                      </button>
                      <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" style="font-size: 10px; padding: 4px 8px;" onclick="window.app.markAppealStatus('${t.id}', 'UNAPPEALED')">
                        UNAPPEALED
                      </button>
                    </div>
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

window.app = window.app || {};

window.app.setTicketStatusFilter = function(st) {
  ticketStatusFilter = st;
  window.app.render();
};

window.app.toggleAddTicketForm = function() {
  const el = document.getElementById('addTicketFormEl');
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
};

window.app.submitAddTicket = function() {
  const ticketRef = document.getElementById('tckRef').value;
  const customerId = document.getElementById('tckCust').value;
  const vehicleId = document.getElementById('tckVeh').value;
  const contraventionCode = document.getElementById('tckCode').value;
  const initialStatus = document.getElementById('tckInitialStatus').value;
  const fineAmount = document.getElementById('tckFine').value;
  const issueDate = document.getElementById('tckDate').value;

  const newTck = store.addTicket({ ticketRef, customerId, vehicleId, contraventionCode, fineAmount, issueDate });
  if (initialStatus) store.updateTicketStatus(newTck.id, initialStatus);

  alert(`Ticket ${newTck.ticketRef} logged successfully with status "${initialStatus}"!`);
  window.app.toggleAddTicketForm();
  window.app.render();
};

window.app.selectTicketForAi = function(ticketId) {
  activeTicketForAi = store.tickets.find(t => t.id === ticketId);
  generatedAppealText = '';
  window.app.render();
};

window.app.generateAiAppealLetter = function(type) {
  if (!activeTicketForAi) return;

  const t = activeTicketForAi;
  const cust = store.customers.find(c => c.id === t.customerId) || {
    fullName: t.customerName,
    id: t.customerId,
    licenceNumber: 'UK999888777',
    address: '42 Mayfair Green, London',
    phone: '07700 900184',
    email: 'client@cave.co.uk',
    agreementSignedDate: '12 AUG 2026'
  };

  const rental = store.rentals.find(r => r.customerId === t.customerId || r.vehicleReg === t.vehicleReg) || {
    id: `R00${t.customerId.slice(-3)}`
  };

  if (type === 'HIRE_TRANSFER') {
    generatedAppealText = `FORMAL REPRESENTATION & TRANSFER OF LIABILITY UNDER SCHEDULE 10 OF ROAD TRAFFIC OFFENDERS ACT 1988

To: Parking & Traffic Enforcement Appeals Department
PCN Reference Number: ${t.ticketRef}
Vehicle Registration: ${t.vehicleReg}
Alleged Contravention: ${t.contraventionCode}

We write formally as the registered keeper of vehicle registration ${t.vehicleReg} in response to Penalty Charge Notice ${t.ticketRef}.

Pursuant to Schedule 10 of the Road Traffic Offenders Act 1988 (and Section 66 of the Road Traffic Act 1991), we hereby give statutory notice that at the exact date and time of the alleged contravention, the vehicle was subject to a formal vehicle hire agreement and was in the exclusive possession and control of the hirer specified below.

MATCHED HIRER & CONTRACT DOSSIER RECORD:
• Customer Dossier ID: #${cust.id}
• Rental Contract Ref: CAVE-CONTRACT-#${cust.id}-2026 (Lease #${rental.id})
• Full Name of Hirer: ${cust.fullName}
• Driver Licence Number: ${cust.licenceNumber}
• Hirer Registered Address: ${cust.address}
• Contact Telephone: ${cust.phone}
• Contact Email: ${cust.email}
• Date Rental Contract Executed: ${cust.agreementSignedDate || '12 AUG 2026'}

Under statutory regulations governing hired vehicles, liability for this Penalty Charge Notice rests entirely with the hirer named above. We request that liability for PCN ${t.ticketRef} be transferred to ${cust.fullName} at the above address, and that the notice issued to the registered keeper be cancelled forthwith. A copy of the signed hire agreement is held on file and can be supplied upon request.

Yours faithfully,
CAVE Automotive Rentals Compliance & Legal Department`;
  } else {
    generatedAppealText = `FORMAL APPEAL AGAINST PENALTY CHARGE NOTICE: ${t.ticketRef}

To the Appeals Officer,

I am writing to formally challenge Penalty Charge Notice ${t.ticketRef} issued for vehicle ${t.vehicleReg} concerning ${t.contraventionCode}.

MATCHED HIRER RECORD:
Customer Ref: #${cust.id}
Hirer Name: ${cust.fullName}
Contract Ref: CAVE-CONTRACT-#${cust.id}-2026

GROUNDS OF APPEAL:
1. The contravention signage / road markings at the location were obscured and non-compliant with the Traffic Signs Regulations and General Directions (TSRGD).
2. The vehicle was unable to clear the junction safely due to unannounced traffic congestion.

I request that this PCN be cancelled with immediate effect.

Yours sincerely,
CAVE Compliance & Legal Department`;
  }
  window.app.render();
};

window.app.copyAppealText = function() {
  if (generatedAppealText) {
    navigator.clipboard.writeText(generatedAppealText);
    alert("AI Legal Appeal Letter copied to clipboard! Ready to send to Council or TfL.");
  }
};

window.app.markAppealStatus = function(ticketId, newStatus) {
  store.updateTicketStatus(ticketId, newStatus);
  alert(`Ticket #${ticketId} status updated to ${newStatus}!`);
  window.app.render();
};
