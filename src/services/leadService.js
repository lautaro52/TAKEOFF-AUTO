import { API_CONFIG } from '../config';

const BASE_URL = API_CONFIG.API_URL.replace('cars.php', '');
const PARTNERS_URL = `${BASE_URL}partners.php`;
const LEADS_URL = `${BASE_URL}leads.php`;

export const partnerService = {
    register: async (data) => {
        const response = await fetch(`${PARTNERS_URL}?action=register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },
    login: async (whatsapp, password) => {
        const response = await fetch(`${PARTNERS_URL}?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ whatsapp, password })
        });
        return response.json();
    },
    getProfile: async (id) => {
        const response = await fetch(`${PARTNERS_URL}?id=${id}`);
        return response.json();
    }
};

export const leadService = {
    create: async (data) => {
        const response = await fetch(LEADS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },
    getByPartner: async (partnerId) => {
        const response = await fetch(`${LEADS_URL}?partner_id=${partnerId}`);
        return response.json();
    },
    getAll: async () => {
        const response = await fetch(LEADS_URL);
        return response.json();
    },
    updateStatus: async (id, status, caida_reason = null) => {
        const response = await fetch(LEADS_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status, caida_reason })
        });
        return response.json();
    }
};
