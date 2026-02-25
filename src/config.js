const hostname = window.location.hostname;
const isLocal = hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.');

const ROOT_URL = isLocal
    ? `http://${hostname}`
    : 'https://takeoffauto.online';

const API_ROOT = `${ROOT_URL}/takeoffauto-api`;
const BASE_URL = `${API_ROOT}/api`;

export const USD_QUOTATION = 1500;

export const API_CONFIG = {
    BASE_URL,
    API_URL: `${BASE_URL}/cars.php`,
    UPLOAD_URL: `${BASE_URL}/upload.php`,
    UPLOADS_URL: `${API_ROOT}/uploads/`,
    IMAGE_BASE_URL: `${API_ROOT}/`,
    ANALYTICS_URL: `${BASE_URL}/analytics.php`,
    SEND_EMAIL_URL: `${BASE_URL}/send_new_user_email.php`,
    WHATSAPP_NUMBER: "5493516752879",
    WHATSAPP_LINK: "https://wa.me/5493516752879",
    INSTAGRAM_LINK: "https://www.instagram.com/takeoff.auto/",
    YOUTUBE_LINK: "https://www.youtube.com/@TakeOff-p5x"
};

export const GOOGLE_CONFIG = {
    API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || '',
    DRIVE_FOLDER_ID: import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID || '',
    SHEET_ID: import.meta.env.VITE_GOOGLE_SHEET_ID || '',
    SHEET_RANGES: ['Hoja 1!A:Z', 'Stock!A:Z', 'Hoja1!A:Z', 'Sheet1!A:Z'],
    CACHE_TTL_MS: 5 * 60 * 1000
};

export const OPENAI_CONFIG = {
    API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
    MODEL: 'gpt-4.1-mini',
    TEMPERATURE: 0.7,
    MAX_TOKENS: 320
};
