/**
 * Mock Authentication Service
 * Simulates Firebase Auth behavior without requiring real Firebase configuration
 * Great for development and testing
 */

const STORAGE_KEY = 'takeoffauto_user';

// Mock users for testing
const MOCK_USERS = [
    {
        uid: 'mock-user-1',
        email: 'usuario@takeoffauto.com',
        displayName: 'Usuario Demo',
        photoURL: 'https://ui-avatars.com/api/?name=Usuario+Demo&background=0D8ABC&color=fff'
    },
    {
        uid: 'mock-user-2',
        email: 'cliente@gmail.com',
        displayName: 'Cliente TAKEOFF',
        photoURL: 'https://ui-avatars.com/api/?name=Cliente+TAKEOFF&background=4CAF50&color=fff'
    }
];

import { API_CONFIG } from '../config';

// URL for the email notification script
const EMAIL_API_URL = API_CONFIG.SEND_EMAIL_URL;

/**
 * Simulates Google Sign-In
 * @returns {Promise<{user: object}>}
 */
export const signInWithGoogleMock = async () => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            // Use the first mock user by default
            const user = MOCK_USERS[0];

            // Store in localStorage to persist across page reloads
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

            // Send email notification (fire and forget)
            try {
                fetch(EMAIL_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: user.displayName,
                        email: user.email,
                        uid: user.uid
                    })
                }).catch(err => console.error('Error sending email notification:', err));
            } catch (e) {
                console.error('Error initiating email notification:', e);
            }

            resolve({ user });
        }, 500); // Simulate network delay
    });
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const signOutMock = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            localStorage.removeItem(STORAGE_KEY);
            resolve();
        }, 300);
    });
};

/**
 * Get the currently logged-in user
 * @returns {object|null}
 */
export const getCurrentUserMock = () => {
    const userJson = localStorage.getItem(STORAGE_KEY);
    if (!userJson) return null;

    try {
        return JSON.parse(userJson);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

/**
 * Listen to authentication state changes
 * @param {Function} callback - Called when auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChangedMock = (callback) => {
    // Call immediately with current user
    const currentUser = getCurrentUserMock();
    callback(currentUser);

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = (e) => {
        if (e.key === STORAGE_KEY) {
            const newUser = e.newValue ? JSON.parse(e.newValue) : null;
            callback(newUser);
        }
    };

    window.addEventListener('storage', handleStorageChange);

    // Return unsubscribe function
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
};
