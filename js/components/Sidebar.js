// CAVE Apple-Styled Sidebar Component with macOS Window Traffic Lights

import { store } from '../store/appStore.js';

export function renderSidebar() {
  const v = store.currentView;

  const navItems = [
    { id: 'DASHBOARD', num: '01', label: 'DASHBOARD' },
    { id: 'VEHICLES', num: '02', label: 'VEHICLES' },
    { id: 'CUSTOMERS', num: '03', label: 'CUSTOMERS' },
    { id: 'RENTALS', num: '04', label: 'RENTALS' },
    { id: 'TICKETS', num: '05', label: 'TICKETS & APPEALS' }
  ];

  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <!-- macOS Window Control Traffic Lights -->
        <div class="mac-traffic-lights" style="margin-bottom: 16px;">
          <span class="mac-dot mac-dot-red" title="Close"></span>
          <span class="mac-dot mac-dot-yellow" title="Minimize"></span>
          <span class="mac-dot mac-dot-green" title="Maximize"></span>
        </div>

        <div class="brand-logo">
          <span class="brand-dot"></span>
          CAVE.
        </div>
        <div class="label-meta" style="margin-top: 6px; font-size: 9px; color: #8E8E93;">AUTOMOTIVE OPERATING SYSTEM</div>
      </div>

      <nav class="sidebar-nav">
        ${navItems.map(item => `
          <div class="nav-item ${v === item.id || (v === 'CUSTOMER_DETAIL' && item.id === 'CUSTOMERS') || (v === 'VEHICLE_DETAIL' && item.id === 'VEHICLES') || (v === 'RENTAL_DETAIL' && item.id === 'RENTALS') ? 'active' : ''}" 
               onclick="window.app.setView('${item.id}')">
            <span class="nav-num">${item.num}</span>
            <span>${item.label}</span>
          </div>
        `).join('')}
      </nav>

      <div class="sidebar-footer">
        <div style="font-size: 11px; font-weight: 700; color: #636366;">CAVE OS v2.5 PROD</div>
      </div>
    </aside>
  `;
}
