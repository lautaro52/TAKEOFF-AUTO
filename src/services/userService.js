import { API_CONFIG } from '../config';

const BACKEND_URL = API_CONFIG.BASE_URL; // Assuming BASE_URL points to the backend folder
const USERS_API = `${BACKEND_URL}/users.php`;
const ACTIVITIES_API = `${BACKEND_URL}/user_activities.php`;

export const userService = {
    // Register or login user
    async login(userData) {
        try {
            const response = await fetch(USERS_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (data.success) {
                // Store user in localStorage (using the key 'takeoff_user' consistent with other methods)
                localStorage.setItem('takeoff_user', JSON.stringify(data.user));
                return data.user;
            }
            throw new Error(data.message || 'Login failed');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // Logout
    logout() {
        localStorage.removeItem('takeoff_user');
    },

    // Get current user from storage
    getCurrentUser() {
        const user = localStorage.getItem('takeoff_user');
        return user ? JSON.parse(user) : null;
    },

    // Toggle favorite
    async toggleFavorite(carId, isFavorite) {
        const user = this.getCurrentUser();
        if (!user) throw new Error('User not logged in');

        try {
            const response = await fetch(ACTIVITIES_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    car_id: carId,
                    action: isFavorite ? 'unfavorite' : 'favorite'
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Toggle favorite error:', error);
            throw error;
        }
    },

    // Record a quote
    async recordQuote(carId) {
        const user = this.getCurrentUser();
        if (!user) return; // Silent return if not logged in

        try {
            await fetch(ACTIVITIES_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    car_id: carId,
                    action: 'quote'
                })
            });
        } catch (error) {
            console.error('Record quote error:', error);
        }
    },

    // Get user activities (favorites and quotes)
    async getActivities() {
        const user = this.getCurrentUser();
        if (!user) throw new Error('User not logged in');

        try {
            const response = await fetch(`${ACTIVITIES_API}?user_id=${user.id}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get activities error:', error);
            throw error;
        }
    }
};
