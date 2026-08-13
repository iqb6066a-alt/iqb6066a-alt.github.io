// RENTAL.OS Documents Management View

import { store } from '../store/appStore.js';

let activeCategory = 'ALL';

export function renderDocumentsView() {
  const documents = store.documents;
  const filtered = activeCategory === 'ALL' ? documents : activeCategory === 'EXPIRING' ? documents.filter(d => d.status === 'EXPIRING_SOON') : documents.filter(d => d.category === activeCategory);

  const expiringCount = documents.filter(d => d.status === 'EXPIRING_SOON').length;

  return `
    <div class="page-container">
      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <div class="label-meta">DOCUMENT VAULT & COMPLIANCE</div>
          <h1>DOCUMENT MANAGEMENT</h1>
        </div>
        <button class="btn-brutal" onclick="window.app.uploadDocumentPrompt()">+ UPLOAD DOCUMENT</button>
      </div>

      <!-- Urgent Expiring Alert Banner if any -->
      ${expiringCount > 0 ? `
        <div class="panel-brutal" style="margin-bottom: 24px; border-left: 4px solid var(--status-overdue); background-color: #FFF5F5;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div class="label-meta" style="color: var(--status-overdue);">COMPLIANCE ALERT</div>
              <div style="font-weight: 800; font-size: 15px; margin-top: 2px; color: var(--text-main);">
                ${expiringCount} DOCUMENTS ARE EXPIRING SOON OR REQUIRE RENEWAL
              </div>
            </div>
            <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.setDocCategory('EXPIRING')">VIEW EXPIRING (&sup1;${expiringCount})</button>
          </div>
        </div>
      ` : ''}

      <!-- Category Filter Tabs -->
      <div class="tabs-nav">
        ${['ALL', 'EXPIRING', 'LICENCES', 'ID', 'RENTAL_AGREEMENTS', 'INSURANCE', 'MOT'].map(c => `
          <button class="tab-item ${activeCategory === c ? 'active' : ''}" onclick="window.app.setDocCategory('${c}')">
            ${c.replace('_', ' ')} (${c === 'ALL' ? documents.length : c === 'EXPIRING' ? expiringCount : documents.filter(d => d.category === c).length})
          </button>
        `).join('')}
      </div>

      <div class="panel-brutal">
        <div class="table-container">
          <table class="table-brutal">
            <thead>
              <tr>
                <th>DOCUMENT ID</th>
                <th>DOCUMENT NAME</th>
                <th>CATEGORY</th>
                <th>ENTITY ID</th>
                <th>UPLOAD DATE</th>
                <th>EXPIRY DATE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0 ? `
                <tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">NO DOCUMENTS IN CATEGORY "${activeCategory}"</td></tr>
              ` : filtered.map(d => `
                <tr>
                  <td class="mono-val" style="font-weight: 800;">${d.id}</td>
                  <td style="font-weight: 800;">${d.name}</td>
                  <td class="mono-val">${d.category}</td>
                  <td class="mono-val">${d.entityId}</td>
                  <td class="mono-val">${d.uploadDate}</td>
                  <td class="mono-val" style="font-weight: 700;">${d.expiryDate}</td>
                  <td>
                    <span class="status-pill ${d.status === 'EXPIRING_SOON' ? 'status-overdue' : 'status-active'}">${d.status}</span>
                  </td>
                  <td>
                    <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="alert('Viewing document preview for ${d.name}...')">VIEW</button>
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

window.app.setDocCategory = function(cat) {
  activeCategory = cat;
  window.app.render();
};

window.app.uploadDocumentPrompt = function() {
  const name = prompt("Enter Document Name:");
  if (name) {
    store.documents.unshift({
      id: `DOC00${store.documents.length + 1}`,
      name,
      category: "LICENCES",
      entityType: "CUSTOMER",
      entityId: "C000184",
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: "2029-01-01",
      status: "VALID"
    });
    store.notify();
  }
};
