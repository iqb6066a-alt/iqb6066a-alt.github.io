// RENTAL.OS Audit Log View

import { store } from '../store/appStore.js';

export function renderAuditLogView() {
  const auditLog = store.auditLog;

  return `
    <div class="page-container">
      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <div class="label-meta">SYSTEM COMPLIANCE LOG</div>
          <h1>AUDIT LOG</h1>
        </div>
      </div>

      <div class="panel-brutal">
        <div class="table-container">
          <table class="table-brutal">
            <thead>
              <tr>
                <th>LOG ID</th>
                <th>TIMESTAMP</th>
                <th>OPERATOR</th>
                <th>ACTION</th>
                <th>ENTITY TYPE</th>
                <th>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              ${auditLog.map(log => `
                <tr>
                  <td class="mono-val" style="font-weight: 800;">${log.id}</td>
                  <td class="mono-val">${log.timestamp}</td>
                  <td class="mono-val" style="font-weight: 700;">${log.operator}</td>
                  <td class="mono-val" style="font-weight: 800; color: var(--text-main);">${log.action}</td>
                  <td class="mono-val">${log.entityType}</td>
                  <td style="font-size: 13px;">${log.details}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
