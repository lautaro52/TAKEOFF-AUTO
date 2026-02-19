/**
 * CRM Service
 * Frontend service for CRM API integration
 */

import { API_CONFIG } from '../config.js';
import { getAuthHeader } from './authService.js';

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get authentication headers
 */
const getAuthHeaders = () => {
    return {
        'Content-Type': 'application/json',
        ...getAuthHeader()
    };
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    if (!data.success) {
        throw new Error(data.message || 'Request failed');
    }

    return data;
};

/**
 * Handle API error
 */
const handleError = (error) => {
    console.error('CRM Service Error:', error);
    throw error;
};

// =====================================================
// VALIDATION FUNCTIONS
// =====================================================

/**
 * Validate email format
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone format (Argentine)
 */
export const validatePhone = (phone) => {
    // Accept formats: +54 9 11 1234-5678, 11 1234-5678, 1112345678
    const phoneRegex = /^(\+54\s?9?\s?)?(\d{2,4})\s?(\d{4})-?(\d{4})$/;
    return phoneRegex.test(phone);
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const validateDate = (date) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;

    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj);
};

// =====================================================
// CUSTOMERS API
// =====================================================

/**
 * Get customers with filters
 */
export const getCustomers = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_CONFIG.CUSTOMERS_URL}?${params}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Get customer by ID
 */
export const getCustomerById = async (id) => {
    try {
        const response = await fetch(`${API_CONFIG.CUSTOMERS_URL}?id=${id}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Create customer
 */
export const createCustomer = async (data) => {
    try {
        // Validate email if provided
        if (data.email && !validateEmail(data.email)) {
            throw new Error('Invalid email format');
        }

        const response = await fetch(API_CONFIG.CUSTOMERS_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Update customer
 */
export const updateCustomer = async (id, data) => {
    try {
        // Validate email if provided
        if (data.email && !validateEmail(data.email)) {
            throw new Error('Invalid email format');
        }

        const response = await fetch(API_CONFIG.CUSTOMERS_URL, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ...data, id })
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Delete customer
 */
export const deleteCustomer = async (id) => {
    try {
        const response = await fetch(`${API_CONFIG.CUSTOMERS_URL}?id=${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Search customers
 */
export const searchCustomers = async (query) => {
    try {
        const response = await fetch(`${API_CONFIG.CUSTOMERS_URL}?action=search&query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Get customer statistics
 */
export const getCustomerStats = async () => {
    try {
        const response = await fetch(`${API_CONFIG.CUSTOMERS_URL}?action=stats`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

// =====================================================
// OPPORTUNITIES API
// =====================================================

/**
 * Get opportunities with filters
 */
export const getOpportunities = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_CONFIG.OPPORTUNITIES_URL}?${params}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Get opportunity by ID
 */
export const getOpportunityById = async (id) => {
    try {
        const response = await fetch(`${API_CONFIG.OPPORTUNITIES_URL}?id=${id}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Create opportunity
 */
export const createOpportunity = async (data) => {
    try {
        // Validate date if provided
        if (data.expected_close_date && !validateDate(data.expected_close_date)) {
            throw new Error('Invalid date format. Use YYYY-MM-DD');
        }

        const response = await fetch(API_CONFIG.OPPORTUNITIES_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Update opportunity
 */
export const updateOpportunity = async (id, data) => {
    try {
        // Validate date if provided
        if (data.expected_close_date && !validateDate(data.expected_close_date)) {
            throw new Error('Invalid date format. Use YYYY-MM-DD');
        }

        const response = await fetch(API_CONFIG.OPPORTUNITIES_URL, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ...data, id })
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Get pipeline data for Kanban board
 */
export const getPipelineData = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_CONFIG.OPPORTUNITIES_URL}?action=pipeline&${params}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Update opportunity stage
 */
export const updateOpportunityStage = async (id, newStage, lostReason = null) => {
    try {
        const response = await fetch(`${API_CONFIG.OPPORTUNITIES_URL}?action=update_stage`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                id,
                new_stage: newStage,
                lost_reason: lostReason
            })
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Close opportunity (won or lost)
 */
export const closeOpportunity = async (id, won, actualValue = null, reason = null) => {
    try {
        const response = await fetch(`${API_CONFIG.OPPORTUNITIES_URL}?action=close`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                id,
                won,
                actual_value: actualValue,
                reason
            })
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Get conversion metrics
 */
export const getConversionMetrics = async (dateFrom, dateTo) => {
    try {
        const response = await fetch(`${API_CONFIG.OPPORTUNITIES_URL}?action=conversion_metrics&from=${dateFrom}&to=${dateTo}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

// =====================================================
// ACTIVITIES API
// =====================================================

/**
 * Get customer activities (timeline)
 */
export const getCustomerActivities = async (customerId, limit = 50) => {
    try {
        const response = await fetch(`${API_CONFIG.ACTIVITIES_URL}?customer_id=${customerId}&limit=${limit}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Get opportunity activities
 */
export const getOpportunityActivities = async (opportunityId) => {
    try {
        const response = await fetch(`${API_CONFIG.ACTIVITIES_URL}?opportunity_id=${opportunityId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Create activity
 */
export const createActivity = async (data) => {
    try {
        const response = await fetch(API_CONFIG.ACTIVITIES_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Get recent activities by user
 */
export const getRecentActivities = async (userId, limit = 20) => {
    try {
        const response = await fetch(`${API_CONFIG.ACTIVITIES_URL}?created_by=${userId}&limit=${limit}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Update activity
 */
export const updateActivity = async (id, data) => {
    try {
        const response = await fetch(API_CONFIG.ACTIVITIES_URL, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ...data, id })
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Delete activity
 */
export const deleteActivity = async (id) => {
    try {
        const response = await fetch(`${API_CONFIG.ACTIVITIES_URL}?id=${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

// =====================================================
// TASKS API
// =====================================================

/**
 * Get tasks with filters
 */
export const getTasks = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_CONFIG.TASKS_URL}?${params}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Get overdue tasks
 */
export const getOverdueTasks = async (userId) => {
    try {
        const response = await fetch(`${API_CONFIG.TASKS_URL}?action=overdue&assigned_to=${userId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Get upcoming tasks
 */
export const getUpcomingTasks = async (userId, days = 7) => {
    try {
        const response = await fetch(`${API_CONFIG.TASKS_URL}?action=upcoming&assigned_to=${userId}&days=${days}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Create task
 */
export const createTask = async (data) => {
    try {
        // Validate due date
        if (data.due_date && !validateDate(data.due_date)) {
            throw new Error('Invalid due date format. Use YYYY-MM-DD');
        }

        const response = await fetch(API_CONFIG.TASKS_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Update task
 */
export const updateTask = async (id, data) => {
    try {
        // Validate due date if provided
        if (data.due_date && !validateDate(data.due_date)) {
            throw new Error('Invalid due date format. Use YYYY-MM-DD');
        }

        const response = await fetch(API_CONFIG.TASKS_URL, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ...data, id })
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Complete task
 */
export const completeTask = async (id) => {
    try {
        const response = await fetch(`${API_CONFIG.TASKS_URL}?action=complete&id=${id}`, {
            method: 'POST',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Delete task
 */
export const deleteTask = async (id) => {
    try {
        const response = await fetch(`${API_CONFIG.TASKS_URL}?id=${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default {
    // Customers
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    getCustomerStats,

    // Opportunities
    getOpportunities,
    getOpportunityById,
    createOpportunity,
    updateOpportunity,
    getPipelineData,
    updateOpportunityStage,
    closeOpportunity,
    getConversionMetrics,

    // Activities
    getCustomerActivities,
    getOpportunityActivities,
    createActivity,
    getRecentActivities,
    updateActivity,
    deleteActivity,

    // Tasks
    getTasks,
    getOverdueTasks,
    getUpcomingTasks,
    createTask,
    updateTask,
    completeTask,
    deleteTask,

    // Validators
    validateEmail,
    validatePhone,
    validateDate
};
