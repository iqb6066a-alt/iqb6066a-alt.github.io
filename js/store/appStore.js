// CAVE State Store with Instant Cross-Device Real-Time Server Sync & Permanent Disk Storage

import {
  INITIAL_VEHICLES,
  INITIAL_CUSTOMERS,
  INITIAL_RENTALS
} from '../data/initialData.js';

class AppStore {
  constructor() {
    this.listeners = [];
    this.currentView = 'DASHBOARD'; // DASHBOARD | VEHICLES | CUSTOMERS | CUSTOMER_DETAIL | RENTALS | RENTAL_DETAIL | TICKETS
    this.selectedCustomerId = 'C000184';
    this.selectedVehicleId = 'V001';
    this.selectedRentalId = 'R00184';
    
    // Modal states
    this.pdfModalOpen = false;
    this.activeCustomerForPdf = null;
    this.addVehicleModalOpen = false;
    this.editVehicleModalOpen = false;
    this.activeVehicleToEdit = null;
    this.addCustomerModalOpen = false;

    this.vehicles = INITIAL_VEHICLES;
    this.customers = INITIAL_CUSTOMERS;
    this.rentals = INITIAL_RENTALS;
    this.tickets = [];

    // Hydrate state from local storage first, then fetch authoritative server DB
    this.loadState();
    this.fetchServerStateImmediately();

    // 2-Second background cross-device real-time sync loop
    setInterval(() => this.fetchServerStateSilently(), 2000);
  }

  loadState() {
    try {
      const stored = localStorage.getItem('CAVE_RENTALS_STATE_V5');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.vehicles) this.vehicles = parsed.vehicles;
        if (parsed.customers) this.customers = parsed.customers;
        if (parsed.rentals) this.rentals = parsed.rentals;
        if (parsed.tickets) this.tickets = parsed.tickets;
      }
    } catch (e) {
      console.warn('LocalStorage load fallback:', e);
    }
  }

  saveState() {
    try {
      const stateObj = {
        vehicles: this.vehicles,
        customers: this.customers,
        rentals: this.rentals,
        tickets: this.tickets
      };
      localStorage.setItem('CAVE_RENTALS_STATE_V5', JSON.stringify(stateObj));
      this.syncWithServer();
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }

  async syncWithServer() {
    try {
      const stateObj = {
        vehicles: this.vehicles,
        customers: this.customers,
        rentals: this.rentals,
        tickets: this.tickets
      };
      await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stateObj)
      });
    } catch (e) {
      // Offline fallback
    }
  }

  async fetchServerStateImmediately() {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        if (data.vehicles && data.customers && data.rentals) {
          this.vehicles = data.vehicles;
          this.customers = data.customers;
          this.rentals = data.rentals;
          if (data.tickets) this.tickets = data.tickets;
          localStorage.setItem('CAVE_RENTALS_STATE_V5', JSON.stringify(data));
          this.notify(false);
        }
      }
    } catch (e) {
      // Server offline fallback
    }
  }

  async fetchServerStateSilently() {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        if (data.vehicles && data.customers && data.rentals) {
          const currentStr = JSON.stringify({ vehicles: this.vehicles, customers: this.customers, rentals: this.rentals, tickets: this.tickets });
          const incomingStr = JSON.stringify({ vehicles: data.vehicles, customers: data.customers, rentals: data.rentals, tickets: data.tickets || [] });
          
          if (currentStr !== incomingStr) {
            this.vehicles = data.vehicles;
            this.customers = data.customers;
            this.rentals = data.rentals;
            if (data.tickets) this.tickets = data.tickets;
            localStorage.setItem('CAVE_RENTALS_STATE_V5', JSON.stringify(data));
            this.notify(false);
          }
        }
      }
    } catch (e) {
      // Offline fallback
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(save = true) {
    if (save) this.saveState();
    this.listeners.forEach(listener => listener());
  }

  setView(view, params = {}) {
    this.currentView = view;
    if (params.customerId) this.selectedCustomerId = params.customerId;
    if (params.vehicleId) this.selectedVehicleId = params.vehicleId;
    if (params.rentalId) this.selectedRentalId = params.rentalId;
    this.notify(false);
  }

  openPdfAgreementModal(customerId) {
    this.activeCustomerForPdf = this.customers.find(c => c.id === customerId) || this.customers[0];
    this.pdfModalOpen = true;
    this.notify(false);
  }

  closePdfModal() {
    this.pdfModalOpen = false;
    this.notify(false);
  }

  toggleAddCustomerModal(open) {
    this.addCustomerModalOpen = typeof open === 'boolean' ? open : !this.addCustomerModalOpen;
    this.notify(false);
  }

  toggleAddVehicleModal(open) {
    this.addVehicleModalOpen = typeof open === 'boolean' ? open : !this.addVehicleModalOpen;
    this.notify(false);
  }

  openEditVehicleModal(vehicleId) {
    this.activeVehicleToEdit = this.vehicles.find(v => v.id === vehicleId) || this.vehicles[0];
    this.editVehicleModalOpen = true;
    this.notify(false);
  }

  closeEditVehicleModal() {
    this.editVehicleModalOpen = false;
    this.activeVehicleToEdit = null;
    this.notify(false);
  }

  addVehicle(vData) {
    const id = `V0${this.vehicles.length + 1}`.padStart(4, 'V00');
    const newVehicle = {
      id,
      make: vData.make.toUpperCase(),
      model: vData.model.toUpperCase(),
      reg: vData.reg.toUpperCase(),
      year: parseInt(vData.year) || 2025,
      colour: vData.colour || 'Nardo Grey',
      mileage: parseInt(vData.mileage) || 12000,
      fuelLevel: parseInt(vData.fuelLevel) || 100,
      status: 'AVAILABLE',
      dailyRate: parseFloat(vData.dailyRate) || 250,
      weeklyRate: parseFloat(vData.weeklyRate) || 1500,
      image: vData.image || 'https://pngimg.com/d/audi_PNG99285.png',
      insuranceInfo: vData.insuranceInfo || 'Aviva Fleet Commercial',
      motExpiry: '2027-01-01',
      currentRentalId: null
    };
    this.vehicles.unshift(newVehicle);
    this.addVehicleModalOpen = false;
    this.notify(true);
    return newVehicle;
  }

  updateVehicle(id, patch) {
    const idx = this.vehicles.findIndex(v => v.id === id);
    if (idx !== -1) {
      this.vehicles[idx] = { ...this.vehicles[idx], ...patch };
      this.editVehicleModalOpen = false;
      this.notify(true);
    }
  }

  deleteVehicle(id) {
    this.vehicles = this.vehicles.filter(v => v.id !== id);
    this.notify(true);
  }

  uploadCustomerLicence(customerId, imageUrl) {
    const cust = this.customers.find(c => c.id === customerId);
    if (cust) {
      cust.licenceImage = imageUrl;
      cust.verificationStatus = 'VERIFIED';
      this.notify(true);
    }
  }

  signCustomerAgreement(customerId, signatureStr) {
    const cust = this.customers.find(c => c.id === customerId);
    if (cust) {
      cust.agreementSigned = true;
      cust.agreementSignature = signatureStr || cust.fullName;
      cust.agreementSignedDate = new Date().toISOString().split('T')[0];
      this.notify(true);
    }
  }

  addCustomer(data) {
    const id = `C000${this.customers.length + 188}`;
    const newCust = {
      id,
      fullName: data.fullName.toUpperCase(),
      phone: data.phone || '07700 900999',
      email: data.email || 'customer@cave.co.uk',
      address: data.address || 'London, UK',
      licenceNumber: data.licenceNumber || 'UK999888777',
      licenceExpiry: data.licenceExpiry || '2029-12-31',
      licenceImage: data.licenceImage || null,
      verificationStatus: 'VERIFIED',
      totalRentals: 0,
      totalSpend: 0,
      agreementSigned: false,
      agreementSignature: null,
      agreementSignedDate: null,
      notes: 'New customer'
    };
    this.customers.unshift(newCust);
    this.notify(true);
    return newCust;
  }

  deleteCustomer(id) {
    this.customers = this.customers.filter(c => c.id !== id);
    this.notify(true);
  }

  createRental(rentalData) {
    const id = `R00${this.rentals.length + 188}`;
    const customer = this.customers.find(c => c.id === rentalData.customerId);
    const vehicle = this.vehicles.find(v => v.id === rentalData.vehicleId);

    const newRental = {
      id,
      customerId: rentalData.customerId,
      customerName: customer ? customer.fullName : 'UNKNOWN',
      vehicleId: rentalData.vehicleId,
      vehicleName: vehicle ? `${vehicle.make} ${vehicle.model}`.toUpperCase() : 'UNKNOWN',
      vehicleReg: vehicle ? vehicle.reg : '',
      startDate: rentalData.startDate || new Date().toISOString(),
      expectedReturnDate: rentalData.expectedReturnDate,
      dailyRate: rentalData.dailyRate || (vehicle ? vehicle.dailyRate : 200),
      deposit: rentalData.deposit || 1000,
      totalAmount: rentalData.totalAmount || 1200,
      status: 'ACTIVE',
      startMileage: vehicle ? vehicle.mileage : 0,
      startFuel: 100,
      agreementSigned: true
    };

    if (vehicle) {
      vehicle.status = 'RENTED';
      vehicle.currentRentalId = id;
    }

    if (customer) {
      customer.totalRentals += 1;
      customer.totalSpend += newRental.totalAmount;
      customer.agreementSigned = true;
      customer.agreementSignature = customer.fullName;
      customer.agreementSignedDate = new Date().toISOString().split('T')[0];
    }

    this.rentals.unshift(newRental);
    this.notify(true);
    return newRental;
  }

  completeReturn(rentalId) {
    const rental = this.rentals.find(r => r.id === rentalId);
    if (!rental) return;

    rental.status = 'COMPLETED';
    const vehicle = this.vehicles.find(v => v.id === rental.vehicleId || v.reg === rental.vehicleReg);
    if (vehicle) {
      vehicle.status = 'AVAILABLE';
      vehicle.currentRentalId = null;
    }
    this.notify(true);
  }

  addTicket(data) {
    const id = `TCK-990${this.tickets.length + 1}`;
    const cust = this.customers.find(c => c.id === data.customerId);
    const veh = this.vehicles.find(v => v.id === data.vehicleId);

    const newTicket = {
      id,
      ticketRef: data.ticketRef || `PCN-${Math.floor(Math.random()*89999)+10000}`,
      customerId: data.customerId,
      customerName: cust ? cust.fullName : 'UNKNOWN DRIVER',
      vehicleId: data.vehicleId,
      vehicleReg: veh ? veh.reg : 'UNKNOWN',
      contraventionCode: data.contraventionCode || 'Code 01: Parking Restriction',
      contraventionDesc: data.contraventionDesc || 'Parked in a restricted street',
      issueDate: data.issueDate || new Date().toISOString(),
      fineAmount: parseFloat(data.fineAmount) || 130,
      status: 'UNPAID',
      appealDeadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      appealLetter: data.appealLetter || '',
      notes: data.notes || ''
    };

    this.tickets.unshift(newTicket);
    this.notify(true);
    return newTicket;
  }

  updateTicketStatus(ticketId, status) {
    const t = this.tickets.find(tk => tk.id === ticketId);
    if (t) {
      t.status = status;
      this.notify(true);
    }
  }

  deleteTicket(id) {
    this.tickets = this.tickets.filter(t => t.id !== id);
    this.notify(true);
  }

  resetDatabase() {
    localStorage.removeItem('CAVE_RENTALS_STATE_V5');
    this.loadState();
    this.notify(true);
  }
}

export const store = new AppStore();
