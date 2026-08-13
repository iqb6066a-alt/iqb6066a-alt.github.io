// RENTAL.OS Payments & Ledger View

import { store } from '../store/appStore.js';

export function renderPaymentsView() {
  const payments = store.payments;

  const totalCollected = payments.reduce((acc, p) => acc + (p.status === 'PAID' ? p.amount : 0), 0);
  const depositsHeld = payments.reduce((acc, p) => acc + (p.depositAmount || 0), 0);
  const outstanding = payments.reduce((acc, p) => acc + (p.status === 'OUTSTANDING' || p.status === 'PARTIALLY_PAID' ? p.amount : 0), 0);

  return `
    <div class="page-container">
      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <div class="label-meta">FINANCIAL LEDGER</div>
          <h1>PAYMENTS MANAGEMENT</h1>
        </div>
        <button class="btn-brutal" onclick="window.app.recordPaymentPrompt()">+ RECORD PAYMENT</button>
      </div>

      <!-- Financial Metrics -->
      <div class="stats-grid">
        <div class="stat-box">
          <div class="label-meta">TOTAL REVENUE COLLECTED</div>
          <div class="number-huge" style="margin-top: 8px;">&pound;${totalCollected.toLocaleString()}</div>
        </div>

        <div class="stat-box">
          <div class="label-meta">DEPOSIT POOL HELD</div>
          <div class="number-huge" style="margin-top: 8px; color: var(--status-returning);">&pound;${depositsHeld.toLocaleString()}</div>
        </div>

        <div class="stat-box highlight">
          <div class="label-meta">OUTSTANDING BALANCE</div>
          <div class="number-huge" style="margin-top: 8px; color: #FCA5A5;">&pound;${outstanding.toLocaleString()}</div>
        </div>
      </div>

      <div class="panel-brutal">
        <div class="table-container">
          <table class="table-brutal">
            <thead>
              <tr>
                <th>PAYMENT ID</th>
                <th>RENTAL ID</th>
                <th>CLIENT</th>
                <th>VEHICLE</th>
                <th>AMOUNT</th>
                <th>DEPOSIT HELD</th>
                <th>DATE</th>
                <th>METHOD</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              ${payments.map(p => `
                <tr>
                  <td class="mono-val" style="font-weight: 800;">${p.id}</td>
                  <td class="mono-val" style="font-weight: 700;">#${p.rentalId}</td>
                  <td style="font-weight: 800;">${p.customerName}</td>
                  <td class="mono-val">${p.vehicleName}</td>
                  <td class="mono-val" style="font-weight: 800;">&pound;${p.amount.toLocaleString()}</td>
                  <td class="mono-val">&pound;${(p.depositAmount || 0).toLocaleString()}</td>
                  <td class="mono-val">${p.date}</td>
                  <td class="mono-val">${p.method}</td>
                  <td>
                    <span class="status-pill ${p.status === 'PAID' ? 'status-active' : 'status-overdue'}">${p.status}</span>
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

window.app.recordPaymentPrompt = function() {
  const rentalId = prompt("Enter Rental ID (e.g. R00187):");
  if (rentalId) {
    const amount = prompt("Enter Payment Amount (£):");
    if (amount) {
      store.payments.unshift({
        id: `PAY00${store.payments.length + 1}`,
        rentalId,
        customerName: "S PATEL",
        vehicleName: "BMW M4",
        amount: parseFloat(amount),
        depositAmount: 1000,
        date: new Date().toISOString().split('T')[0],
        type: "LATE_FEE",
        status: "PAID",
        method: "CREDIT_CARD"
      });
      store.notify();
      alert("Payment recorded successfully.");
    }
  }
};
