import { API_CONFIG, GOOGLE_CONFIG, OPENAI_CONFIG } from '../config';

const CRM_BASE = API_CONFIG.BASE_URL;

const TOKEN_KEY = 'crm_admin_token';
const ADMIN_KEY = 'crm_admin_data';

// ─── Auth ───────────────────────────────────────────
export const crmAuth = {
    async login(email, password) {
        const res = await fetch(`${CRM_BASE}/crm_auth.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', email, password })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin));
        }
        return data;
    },
    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ADMIN_KEY);
    },
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },
    getAdmin() {
        const d = localStorage.getItem(ADMIN_KEY);
        return d ? JSON.parse(d) : null;
    },
    isLoggedIn() {
        const token = this.getToken();
        if (!token) return false;
        try {
            const decoded = JSON.parse(atob(token));
            return decoded.exp > Math.floor(Date.now() / 1000);
        } catch { return false; }
    }
};

// ─── Generic fetch with token ───
const crmFetch = async (endpoint, options = {}) => {
    const token = crmAuth.getToken();
    const url = new URL(`${CRM_BASE}/${endpoint}`);

    if (options.method === 'GET' || !options.method) {
        url.searchParams.set('token', token);
        if (options.params) {
            Object.entries(options.params).forEach(([k, v]) => {
                if (v !== null && v !== undefined) url.searchParams.set(k, v);
            });
        }
        const res = await fetch(url.toString());
        return res.json();
    }

    const body = { ...(options.body || {}), token };
    const res = await fetch(url.toString(), {
        method: options.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return res.json();
};

// ─── Clients ────────────────────────────────────────
export const crmClients = {
    list(stage = null, search = null) {
        return crmFetch('crm_clients.php', { params: { stage, search } });
    },
    create(data) {
        return crmFetch('crm_clients.php', { method: 'POST', body: data });
    },
    update(data) {
        return crmFetch('crm_clients.php', { method: 'PUT', body: data });
    },
    updateStage(id, stage) {
        return crmFetch('crm_clients.php', { method: 'PUT', body: { id, stage } });
    },
    remove(id, reason = null) {
        return crmFetch('crm_clients.php', { method: 'DELETE', body: { id, reason } });
    }
};

// ─── Notes ──────────────────────────────────────────
export const crmNotes = {
    list(clientId) {
        return crmFetch('crm_notes.php', { params: { client_id: clientId } });
    },
    create(data) {
        // Accepts { client_id, content }
        return crmFetch('crm_notes.php', { method: 'POST', body: data });
    }
};

// ─── Tasks ──────────────────────────────────────────
export const crmTasks = {
    list(clientId = null, pending = false) {
        const params = {};
        if (clientId) params.client_id = clientId;
        if (pending) params.pending = 1;
        return crmFetch('crm_tasks.php', { params });
    },
    create(data) {
        // Accepts { client_id, description, due_date }
        return crmFetch('crm_tasks.php', { method: 'POST', body: data });
    },
    complete(id, resultNote = null) {
        return crmFetch('crm_tasks.php', { method: 'PUT', body: { id, result_note: resultNote } });
    }
};

// ─── Dashboard ──────────────────────────────────────
export const crmDashboard = {
    getStats(from = null, to = null) {
        return crmFetch('crm_dashboard.php', { params: { from, to } });
    }
};

// ─── Stock Sync ─────────────────────────────────────
export const crmStockSync = {
    sync(downloadImages = false) {
        return crmFetch('crm_stock_sync.php', {
            method: 'POST',
            body: {
                google_api_key: GOOGLE_CONFIG.API_KEY,
                sheet_id: GOOGLE_CONFIG.SHEET_ID,
                drive_folder_id: GOOGLE_CONFIG.DRIVE_FOLDER_ID,
                openai_api_key: OPENAI_CONFIG.API_KEY,
                sheet_ranges: GOOGLE_CONFIG.SHEET_RANGES,
                download_images: downloadImages
            }
        });
    },
    reorderPhotos(carId) {
        return crmFetch('crm_reorder_photos.php', {
            method: 'POST',
            body: {
                car_id: carId,
                openai_api_key: OPENAI_CONFIG.API_KEY
            }
        });
    }
};
