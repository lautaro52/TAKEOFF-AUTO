import { API_CONFIG } from '../config';

// Cache de geolocalización para evitar solicitar múltiples veces
let cachedLocation = null;
let locationPromise = null;

/**
 * Obtener la geolocalización del usuario
 * @returns {Promise<Object>} Objeto con latitude, longitude, city, region
 */
export const getGeolocation = async () => {
    // Si ya tenemos la ubicación en caché, retornarla
    if (cachedLocation) {
        return cachedLocation;
    }

    // Si ya hay una petición en proceso, retornar esa promesa
    if (locationPromise) {
        return locationPromise;
    }

    locationPromise = new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.warn('Geolocalización no disponible en este navegador');
            resolve({ latitude: null, longitude: null, city: null, region: null });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    city: null,
                    region: null
                };

                // Intentar obtener ciudad/región mediante reverse geocoding
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
                    );
                    const data = await response.json();

                    if (data.address) {
                        location.city = data.address.city || data.address.town || data.address.village || null;
                        location.region = data.address.state || data.address.region || null;
                    }
                } catch (error) {
                    console.warn('Error obteniendo nombre de ubicación:', error);
                }

                cachedLocation = location;
                resolve(location);
            },
            (error) => {
                console.warn('Error obteniendo geolocalización:', error.message);
                resolve({ latitude: null, longitude: null, city: null, region: null });
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 3600000 // 1 hora
            }
        );
    });

    return locationPromise;
};

/**
 * Registrar un evento de analytics
 * @param {Object} eventData - Datos del evento a registrar
 * @returns {Promise<Object>} Respuesta del servidor
 */
const recordEvent = async (eventData) => {
    try {
        const response = await fetch(API_CONFIG.ANALYTICS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData)
        });

        const data = await response.json();

        if (!data.success) {
            console.error('Error registrando evento:', data.message);
        }

        return data;
    } catch (error) {
        // No interrumpir la experiencia del usuario si falla el tracking
        console.warn('Error al enviar evento de analytics:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Trackear un cambio de filtros de búsqueda
 * @param {Object} filters - Filtros aplicados
 */
export const trackSearch = async (filters) => {
    const location = await getGeolocation();

    const eventData = {
        event_type: 'search',
        brand: filters.selectedBrands?.[0] || null, // Primera marca seleccionada
        type: filters.selectedType || null,
        price_min: filters.priceMin ? parseFloat(filters.priceMin) : null,
        price_max: filters.priceMax ? parseFloat(filters.priceMax) : null,
        fuel: filters.selectedFuel?.[0] || null,
        transmission: filters.selectedTransmission?.[0] || null,
        color: filters.selectedColors?.[0] || null,
        ...location
    };

    return recordEvent(eventData);
};

/**
 * Trackear la visualización de un auto específico
 * @param {number} carId - ID del auto
 * @param {Object} carData - Datos del auto visualizado
 */
export const trackCarView = async (carId, carData) => {
    const location = await getGeolocation();

    const eventData = {
        event_type: 'view',
        car_id: carId,
        brand: carData.brand,
        model: carData.model,
        type: carData.type,
        ...location
    };

    return recordEvent(eventData);
};

/**
 * Trackear un cambio de filtro específico
 * @param {Object} filterChange - Información del filtro cambiado
 */
export const trackFilterChange = async (filterChange) => {
    const location = await getGeolocation();

    const eventData = {
        event_type: 'filter_change',
        ...filterChange,
        ...location
    };

    return recordEvent(eventData);
};

/**
 * Obtener los modelos más populares
 * @param {Object} options - Opciones de filtrado (days, city, region)
 * @returns {Promise<Array>} Lista de modelos populares
 */
export const getPopularModels = async (options = {}) => {
    try {
        const params = new URLSearchParams({
            type: 'popular_models',
            ...options
        });

        const response = await fetch(`${API_CONFIG.ANALYTICS_URL}?${params}`);
        const data = await response.json();

        if (data.success) {
            return data.data;
        } else {
            console.error('Error obteniendo modelos populares:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching popular models:', error);
        return [];
    }
};

/**
 * Obtener tendencias de búsqueda
 * @param {string} period - Período (day, week, month)
 * @param {number} days - Días hacia atrás
 * @returns {Promise<Array>} Datos de tendencias
 */
export const getSearchTrends = async (period = 'day', days = 30) => {
    try {
        const params = new URLSearchParams({
            type: 'search_trends',
            period,
            days
        });

        const response = await fetch(`${API_CONFIG.ANALYTICS_URL}?${params}`);
        const data = await response.json();

        if (data.success) {
            return data.data;
        } else {
            console.error('Error obteniendo tendencias:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching search trends:', error);
        return [];
    }
};

/**
 * Obtener insights por ubicación
 * @param {number} days - Días hacia atrás
 * @returns {Promise<Array>} Insights por ubicación
 */
export const getLocationInsights = async (days = 30) => {
    try {
        const params = new URLSearchParams({
            type: 'location_insights',
            days
        });

        const response = await fetch(`${API_CONFIG.ANALYTICS_URL}?${params}`);
        const data = await response.json();

        if (data.success) {
            return data.data;
        } else {
            console.error('Error obteniendo insights de ubicación:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching location insights:', error);
        return [];
    }
};
