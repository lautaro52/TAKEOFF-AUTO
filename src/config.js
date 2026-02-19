const isLocal = window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.');

// When accessing from mobile/network, use the PC's IP
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const ROOT_URL = isLocal
    ? 'http://localhost:8000'
    : 'https://takeoffauto.online';

const BASE_URL = `${ROOT_URL}/api`;

export const USD_QUOTATION = 1500;

export const API_CONFIG = {
    BASE_URL,
    API_URL: `${BASE_URL}/cars.php`,
    UPLOAD_URL: `${BASE_URL}/upload.php`,
    UPLOADS_URL: `${BASE_URL}/uploads/`, // Direct access to uploads in api/uploads
    IMAGE_BASE_URL: `${BASE_URL}/`, // Images are served relative to api/
    ANALYTICS_URL: `${BASE_URL}/analytics.php`,
    SEND_EMAIL_URL: `${BASE_URL}/send_new_user_email.php`,

    // CRM API Endpoints
    CUSTOMERS_URL: `${BASE_URL}/customers.php`,
    OPPORTUNITIES_URL: `${BASE_URL}/opportunities.php`,
    ACTIVITIES_URL: `${BASE_URL}/activities.php`,
    TASKS_URL: `${BASE_URL}/tasks.php`,
    USERS_URL: `${BASE_URL}/users.php`
};

