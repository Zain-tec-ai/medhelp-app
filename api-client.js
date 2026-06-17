// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// API Helper Functions
const api = {
  // Appointments
  appointments: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/appointments`);
      return response.json();
    },
    create: async (data) => {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: data.name,
          phone: data.phone,
          department: data.department,
          preferred_date: data.date,
          reason: data.reason
        })
      });
      return response.json();
    },
    updateStatus: async (id, status) => {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return response.json();
    }
  },

  // Contact Messages
  contacts: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/contacts`);
      return response.json();
    },
    create: async (data) => {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          message: data.message
        })
      });
      return response.json();
    },
    updateStatus: async (id, status) => {
      const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return response.json();
    }
  },

  // Health Topics
  topics: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/health-topics`);
      return response.json();
    },
    getByType: async (type) => {
      const response = await fetch(`${API_BASE_URL}/health-topics/type/${type}`);
      return response.json();
    }
  },

  // Salt Scans
  saltScans: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/salt-scans`);
      return response.json();
    },
    create: async (data) => {
      const response = await fetch(`${API_BASE_URL}/salt-scans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          detected_text: data.detectedText,
          matched_salts: data.salts,
          image_url: data.imageUrl || null
        })
      });
      return response.json();
    }
  },

  // Health Check
  health: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
};