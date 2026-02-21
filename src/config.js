const hostname = window.location.hostname;
const isLocal = hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.');

const ROOT_URL = isLocal
    ? `http://${hostname}`
    : 'https://takeoffauto.online';

const BASE_URL = `${ROOT_URL}/takeoffauto-api/api`;

export const USD_QUOTATION = 1500;

export const API_CONFIG = {
    BASE_URL,
    API_URL: `${BASE_URL}/cars.php`,
    UPLOAD_URL: `${BASE_URL}/upload.php`,
    UPLOADS_URL: `${BASE_URL}/uploads/`, // Direct access to uploads in api/uploads
    IMAGE_BASE_URL: `${BASE_URL}/`, // Images are served relative to api/
    ANALYTICS_URL: `${BASE_URL}/analytics.php`,
    SEND_EMAIL_URL: `${BASE_URL}/send_new_user_email.php`,
    WHATSAPP_NUMBER: "5493516752879",
    WHATSAPP_LINK: "https://wa.me/5493516752879",
    INSTAGRAM_LINK: "https://www.instagram.com/takeoff.auto/",
    YOUTUBE_LINK: "https://www.youtube.com/@TakeOff-p5x"
};
