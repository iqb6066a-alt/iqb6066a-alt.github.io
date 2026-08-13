// CAVE iPhone Mobile Bottom Navigation Bar with Tickets & Appeals

import { store } from '../store/appStore.js';

export function renderMobileNav() {
  const v = store.currentView;

  return `
    <nav class="mobile-nav">
      <div class="mobile-nav-item ${v === 'DASHBOARD' ? 'active' : ''}" onclick="window.app.setView('DASHBOARD')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="7" height="7" rx="2"></rect><rect x="14" y="3" width="7" height="7" rx="2"></rect><rect x="14" y="14" width="7" height="7" rx="2"></rect><rect x="3" y="14" width="7" height="7" rx="2"></rect></svg>
        <span>DASHBOARD</span>
      </div>

      <div class="mobile-nav-item ${v === 'VEHICLES' || v === 'VEHICLE_DETAIL' ? 'active' : ''}" onclick="window.app.setView('VEHICLES')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 3.1C1.4 11.5 1 12.2 1 13v3c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle></svg>
        <span>FLEET</span>
      </div>

      <div class="mobile-nav-item ${v === 'CUSTOMERS' || v === 'CUSTOMER_DETAIL' ? 'active' : ''}" onclick="window.app.setView('CUSTOMERS')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
        <span>CLIENTS</span>
      </div>

      <div class="mobile-nav-item ${v === 'RENTALS' || v === 'RENTAL_DETAIL' ? 'active' : ''}" onclick="window.app.setView('RENTALS')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        <span>LEASES</span>
      </div>

      <div class="mobile-nav-item ${v === 'TICKETS' ? 'active' : ''}" onclick="window.app.setView('TICKETS')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <span>TICKETS</span>
      </div>
    </nav>
  `;
}
