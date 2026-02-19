/**
 * Authentication Service
 * Handles user authentication and session management
 */

const TOKEN_KEY = 'takeoff_auth_token';
const USER_KEY = 'takeoff_user';

// Get API base URL from config
import { API_CONFIG } from '../config.js';

const AUTH_API_URL = `${API_CONFIG.BASE_URL}/users.php`;

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and token
 */
export const login = async (email, password) => {
    try {
        const response = await fetch(`${AUTH_API_URL}?action=login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            // Store token and user data
            localStorage.setItem(TOKEN_KEY, data.data.session_token);
            localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
            return data.data;
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user data
 */
export const register = async (userData) => {
    try {
        const response = await fetch(`${AUTH_API_URL}?action=register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (data.success) {
            return data.data.user;
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logout = async () => {
    try {
        const token = getToken();
        if (token) {
            await fetch(`${AUTH_API_URL}?action=logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Clear local storage regardless of API call success
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
};

/**
 * Get current user from API
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No authentication token');
        }

        const response = await fetch(`${AUTH_API_URL}?action=me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (data.success) {
            // Update stored user data
            localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
            return data.data.user;
        } else {
            throw new Error(data.message || 'Failed to get user');
        }
    } catch (error) {
        console.error('Get current user error:', error);
        // If token is invalid, clear storage
        logout();
        throw error;
    }
};

/**
 * Get stored user data (from localStorage)
 * @returns {Object|null} User data or null
 */
export const getStoredUser = () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing stored user:', error);
            return null;
        }
    }
    return null;
};

/**
 * Get authentication token
 * @returns {string|null} Token or null
 */
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
    return !!getToken();
};

/**
 * Get authorization header for API requests
 * @returns {Object} Authorization header object
 */
export const getAuthHeader = () => {
    const token = getToken();
    if (token) {
        return {
            'Authorization': `Bearer ${token}`,
        };
    }
    return {};
};

/**
 * Change user password
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const changePassword = async (newPassword) => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No authentication token');
        }

        const response = await fetch(`${AUTH_API_URL}?action=change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ new_password: newPassword }),
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to change password');
        }
    } catch (error) {
        console.error('Change password error:', error);
        throw error;
    }
};

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export const updateProfile = async (userData) => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No authentication token');
        }

        const response = await fetch(AUTH_API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (data.success) {
            // Update stored user data
            localStorage.setItem(USER_KEY, JSON.stringify(data.data));
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Update profile error:', error);
        throw error;
    }
};

/**
 * Check if user has specific role
 * @param {string} role - Role to check
 * @returns {boolean} True if user has role
 */
export const hasRole = (role) => {
    const user = getStoredUser();
    return user && user.role === role;
};

/**
 * Check if user has permission
 * @param {string} permission - Permission to check
 * @returns {boolean} True if user has permission
 */
export const hasPermission = (permission) => {
    const user = getStoredUser();
    if (!user) return false;

    // Admin has all permissions
    if (user.role === 'admin') return true;

    // Check specific permission
    if (user.permissions && Array.isArray(user.permissions)) {
        return user.permissions.includes(permission);
    }

    return false;
};

export default {
    login,
    register,
    logout,
    getCurrentUser,
    getStoredUser,
    getToken,
    isAuthenticated,
    getAuthHeader,
    changePassword,
    updateProfile,
    hasRole,
    hasPermission,
};
