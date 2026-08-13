// RENTAL.OS Notification Drawer Component

import { store } from '../store/appStore.js';

export function renderNotificationDrawer() {
  if (!store.notificationDrawerOpen) return '';

  const notifications = store.notifications;

  return `
    <div class="modal-overlay" style="justify-content: flex-end; padding: 0;" onclick="if(event.target === this) window.app.toggleNotificationDrawer(false)">
      <div style="width: 400px; height: 100vh; background-color: var(--bg-card); border-left: 1px solid var(--border-dark); display: flex; flex-direction: column;">
        <div class="modal-header">
          <div>
            <div class="label-meta">SYSTEM NOTIFICATIONS</div>
            <div style="font-weight: 900; font-size: 16px; margin-top: 2px;">ALERTS & EXPIRIES</div>
          </div>
          <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.toggleNotificationDrawer(false)">CLOSE</button>
        </div>

        <div style="flex: 1; padding: 20px; overflow-y: auto;">
          ${notifications.length === 0 ? `
            <div style="text-align: center; color: var(--text-muted); padding: 40px 0;">
              NO ACTIVE ALERTS
            </div>
          ` : notifications.map(n => `
            <div class="panel-brutal" style="padding: 16px; margin-bottom: 12px; border-left: 4px solid ${n.priority === 'HIGH' ? 'var(--status-overdue)' : 'var(--status-maintenance)'};">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="label-meta" style="color: ${n.priority === 'HIGH' ? 'var(--status-overdue)' : 'var(--text-muted)'};">${n.title}</span>
                <span class="mono-val" style="font-size: 10px; color: var(--text-muted);">${n.date}</span>
              </div>
              <div style="font-size: 13px; font-weight: 700; margin-top: 6px; color: var(--text-main);">${n.message}</div>
              <div style="margin-top: 12px; display: flex; justify-content: flex-end;">
                ${n.title.includes('OVERDUE') ? `
                  <button class="btn-brutal btn-brutal-sm" onclick="window.app.setView('RENTAL_DETAIL', { rentalId: 'R00187' }); window.app.toggleNotificationDrawer(false);">OPEN RENTAL</button>
                ` : n.title.includes('MOT') ? `
                  <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.setView('DOCUMENTS'); window.app.toggleNotificationDrawer(false);">VIEW MOT</button>
                ` : `
                  <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.setView('CUSTOMERS'); window.app.toggleNotificationDrawer(false);">VIEW CUSTOMER</button>
                `}
              </div>
            </div>
          `).join('')}
        </div>

        <div style="padding: 16px 20px; border-top: 1px solid var(--border-color); background-color: var(--bg-canvas); text-align: center;">
          <span style="font-size: 11px; color: var(--text-muted); font-weight: 700;">SYSTEM STATUS: ALL SERVICES OPERATIONAL</span>
        </div>
      </div>
    </div>
  `;
}
