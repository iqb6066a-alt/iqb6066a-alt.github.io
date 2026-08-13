// CAVE Apple-Styled Header Component

import { store } from '../store/appStore.js';

export function renderHeader() {
  return `
    <header class="top-header">
      <div style="font-size: 15px; font-weight: 800; letter-spacing: -0.01em; color: #1D1D1F;">
        CAVE AUTOMOTIVE
      </div>

      <div class="top-actions">
        <div class="date-pill">12 AUG 2026</div>

        <button class="btn-brutal btn-brutal-sm" onclick="window.app.setView('RENTALS')">
          + NEW RENTAL
        </button>

        <button class="btn-brutal btn-brutal-secondary btn-brutal-sm" onclick="window.app.toggleAddCustomerModal(true)">
          + ADD CUSTOMER
        </button>
      </div>
    </header>
  `;
}
