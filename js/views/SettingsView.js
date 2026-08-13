// RENTAL.OS Settings & Database Management View

import { store } from '../store/appStore.js';

export function renderSettingsView() {
  return `
    <div class="page-container">
      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <div class="label-meta">SYSTEM CONFIGURATION</div>
          <h1>SYSTEM SETTINGS</h1>
        </div>
      </div>

      <div class="panel-brutal" style="margin-bottom: 24px;">
        <div class="panel-header">
          <div>
            <div class="label-meta">ORGANIZATION IDENTIFIER</div>
            <h2>OPERATING COMPANY DETAILS</h2>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label class="label-meta">COMPANY NAME</label>
            <input type="text" class="form-input" value="APEX AUTOMOTIVE LEASING LTD" />
          </div>

          <div class="form-group">
            <label class="label-meta">OPERATING SYSTEM INSTANCE</label>
            <input type="text" class="form-input" value="RENTAL.OS v2.4 PROD" readonly />
          </div>

          <div class="form-group">
            <label class="label-meta">OPERATOR DISPATCH NAME</label>
            <input type="text" class="form-input" value="J. VANCE (SENIOR DISPATCHER)" />
          </div>

          <div class="form-group">
            <label class="label-meta">COMMERCIAL FLEET POLICY NO.</label>
            <input type="text" class="form-input" value="AV-99014-UK-COMMERCIAL" />
          </div>
        </div>
      </div>

      <div class="panel-brutal" style="border-color: var(--status-overdue);">
        <div class="panel-header">
          <div>
            <div class="label-meta" style="color: var(--status-overdue);">DATABASE STORAGE</div>
            <h2>RESET DEMO STATE DATA</h2>
          </div>
        </div>
        <p style="margin-bottom: 16px; font-size: 13px; color: var(--text-muted);">
          Restores all initial luxury fleet demo data (18 vehicles, 25 customers, active/overdue rentals, legal agreements, documents, audit logs).
        </p>
        <button class="btn-brutal btn-danger" onclick="window.app.resetAppDatabase()">RESET ALL DATA TO FACTORY DEMO STATE</button>
      </div>
    </div>
  `;
}

window.app = window.app || {};

window.app.resetAppDatabase = function() {
  if (confirm("Are you sure you want to reset the database to initial demo state? All local edits will be restored.")) {
    store.resetDatabase();
    alert("Database reset successfully.");
    window.app.setView('DASHBOARD');
  }
};
