// RENTAL.OS Executive Reports & Analytics View

import { store } from '../store/appStore.js';

let reportPeriod = '30 DAYS';

export function renderReportsView() {
  const stats = store.getStats();
  const utilization = Math.round(((stats.totalVehicles - stats.available) / stats.totalVehicles) * 100);

  return `
    <div class="page-container">
      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <div class="label-meta">EXECUTIVE TELEMETRY</div>
          <h1>REPORTS & ANALYTICS</h1>
        </div>
        
        <!-- Date Filters -->
        <div class="tabs-nav" style="margin-bottom: 0;">
          ${['TODAY', '7 DAYS', '30 DAYS', '90 DAYS'].map(p => `
            <button class="tab-item ${reportPeriod === p ? 'active' : ''}" onclick="window.app.setReportPeriod('${p}')">${p}</button>
          `).join('')}
        </div>
      </div>

      <!-- Top Metric Cards -->
      <div class="stats-grid">
        <div class="stat-box">
          <div class="label-meta">FLEET UTILIZATION</div>
          <div class="number-huge" style="margin-top: 8px;">${utilization}%</div>
        </div>

        <div class="stat-box">
          <div class="label-meta">TOTAL REVENUE (${reportPeriod})</div>
          <div class="number-huge" style="margin-top: 8px;">&pound;24,800</div>
        </div>

        <div class="stat-box">
          <div class="label-meta">AVERAGE RENTAL DURATION</div>
          <div class="number-huge" style="margin-top: 8px;">4.2 DAYS</div>
        </div>

        <div class="stat-box">
          <div class="label-meta">TOTAL RENTALS DISPATCHED</div>
          <div class="number-huge" style="margin-top: 8px;">18</div>
        </div>
      </div>

      <!-- Monochrome SVG Charts Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
        <!-- Utilization Trend Chart -->
        <div class="panel-brutal">
          <div class="panel-header">
            <div>
              <div class="label-meta">FLEET UTILIZATION TREND</div>
              <h2>DAILY LEASE DENSITY</h2>
            </div>
          </div>

          <div style="height: 180px; width: 100%; display: flex; align-items: flex-end; gap: 12px; padding-top: 20px;">
            ${[65, 72, 80, 85, 78, 92, 88, 75, 82, 90, 95, 84, 88, 92].map((val, idx) => `
              <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
                <div style="width: 100%; height: ${val}%; background-color: var(--text-main);"></div>
                <span class="mono-val" style="font-size: 9px; color: var(--text-muted);">${idx + 1}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Revenue Breakdown by Vehicle Model -->
        <div class="panel-brutal">
          <div class="panel-header">
            <div>
              <div class="label-meta">REVENUE CONTRIBUTION BY ASSET</div>
              <h2>TOP PERFORMING VEHICLES</h2>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${[
              { model: 'AUDI RS7 SPORTBACK', amount: 6400, pct: 85 },
              { model: 'MERCEDES-AMG G63', amount: 5800, pct: 75 },
              { model: 'PORSCHE 911 GT3 RS', amount: 4500, pct: 60 },
              { model: 'BMW X5M COMPETITION', amount: 3200, pct: 45 }
            ].map(item => `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 800; margin-bottom: 4px;">
                  <span>${item.model}</span>
                  <span class="mono-val">&pound;${item.amount.toLocaleString()}</span>
                </div>
                <div style="width: 100%; height: 8px; background-color: var(--bg-canvas); border: 1px solid var(--border-color);">
                  <div style="width: ${item.pct}%; height: 100%; background-color: var(--text-main);"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

window.app = window.app || {};

window.app.setReportPeriod = function(p) {
  reportPeriod = p;
  window.app.render();
};
