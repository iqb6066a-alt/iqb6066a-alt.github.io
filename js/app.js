// CAVE Main Application Controller with Password Lock Gate

import { store } from './store/appStore.js';
import { renderLockScreen, init3DDriftCarCanvas } from './components/LockScreen.js';

import { renderSidebar } from './components/Sidebar.js';
import { renderHeader } from './components/Header.js';
import { renderMobileNav } from './components/MobileNav.js';
import { renderPdfAgreementModal } from './components/PdfAgreementModal.js';
import { renderAddVehicleModal, renderEditVehicleModal } from './components/VehicleModals.js';
import { renderAddCustomerModal } from './components/CustomerModal.js';

import { renderDashboardView } from './views/DashboardView.js';
import { renderVehiclesView } from './views/VehiclesView.js';
import { renderCustomersView } from './views/CustomersView.js';
import { renderRentalsView } from './views/RentalsView.js';
import { renderTicketsView } from './views/TicketsView.js';

class AppController {
  constructor() {
    this.appEl = document.getElementById('app');
    this.isUnlocked = sessionStorage.getItem('CAVE_UNLOCKED_V1') === 'true';
    
    // Bind store state subscription
    store.subscribe(() => this.render());

    // Register global window helper functions
    window.app = window.app || {};
    window.app.render = () => this.render();
    window.app.setView = (view, params) => store.setView(view, params);
    window.app.openPdfAgreementModal = (customerId) => store.openPdfAgreementModal(customerId);
    window.app.closePdfModal = () => store.closePdfModal();
    window.app.toggleAddVehicleModal = (open) => store.toggleAddVehicleModal(open);
    window.app.openEditVehicleModal = (vId) => store.openEditVehicleModal(vId);
    window.app.closeEditVehicleModal = () => store.closeEditVehicleModal();
    window.app.toggleAddCustomerModal = (open) => store.toggleAddCustomerModal(open);

    // Password Lock Gate Handlers
    window.app.togglePasscodeInput = () => {
      const box = document.getElementById('passcodePromptBox');
      const btn = document.getElementById('passBtnEl');
      if (box) {
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
        if (box.style.display === 'block') {
          const inp = document.getElementById('lockPassInput');
          if (inp) inp.focus();
          if (btn) btn.style.display = 'none';
        }
      }
    };

    window.app.checkLockPassword = () => {
      const inp = document.getElementById('lockPassInput');
      const err = document.getElementById('passErrorMsg');
      if (inp) {
        const val = inp.value.trim();
        if (val.toLowerCase() === 'egg') {
          this.isUnlocked = true;
          sessionStorage.setItem('CAVE_UNLOCKED_V1', 'true');
          this.render();
        } else {
          if (err) err.style.display = 'block';
          inp.style.borderColor = '#FF3B30';
          inp.value = '';
          inp.focus();
        }
      }
    };

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (store.pdfModalOpen) store.closePdfModal();
        if (store.addVehicleModalOpen) store.toggleAddVehicleModal(false);
        if (store.editVehicleModalOpen) store.closeEditVehicleModal();
        if (store.addCustomerModalOpen) store.toggleAddCustomerModal(false);
      }
    });

    this.render();
  }

  render() {
    if (!this.appEl) return;

    // Password Lock Gate Check
    if (!this.isUnlocked) {
      this.appEl.innerHTML = renderLockScreen();
      setTimeout(() => init3DDriftCarCanvas(), 50);
      return;
    }

    let viewContent = '';
    const v = store.currentView;

    switch (v) {
      case 'DASHBOARD':
        viewContent = renderDashboardView();
        break;
      case 'VEHICLES':
      case 'VEHICLE_DETAIL':
        viewContent = renderVehiclesView();
        break;
      case 'CUSTOMERS':
      case 'CUSTOMER_DETAIL':
        viewContent = renderCustomersView();
        break;
      case 'RENTALS':
      case 'RENTAL_DETAIL':
        viewContent = renderRentalsView();
        break;
      case 'TICKETS':
        viewContent = renderTicketsView();
        break;
      default:
        viewContent = renderDashboardView();
    }

    this.appEl.innerHTML = `
      <div class="app-container">
        ${renderSidebar()}
        
        <div class="main-content-wrapper">
          ${renderHeader()}
          <main>
            ${viewContent}
          </main>
        </div>

        ${renderMobileNav()}
        ${renderPdfAgreementModal()}
        ${renderAddVehicleModal()}
        ${renderEditVehicleModal()}
        ${renderAddCustomerModal()}
      </div>
    `;
  }
}

// Instantiate app on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new AppController();
});
