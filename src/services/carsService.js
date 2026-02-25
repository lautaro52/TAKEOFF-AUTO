import { API_CONFIG } from '../config';
import { applyDealershipSync } from './syncService';

const API_URL = API_CONFIG.API_URL;
const UPLOAD_URL = API_CONFIG.UPLOAD_URL;

// Utility to clean mis-encoded strings
const fixEncoding = (obj) => {
    try {
        if (!obj) return obj;
        if (typeof obj === 'string') {
            return obj
                // Fix: ├½ -> ë
                .replace(/\u251c\u00bd/g, 'ë')
                // Fix: ├│ -> ó
                .replace(/\u251c\u2502/g, 'ó')
                // Fix: Ã« -> ë
                .replace(/\u00c3\u00ab/g, 'ë')
                // Fix: Ã³ -> ó
                .replace(/\u00c3\u00b3/g, 'ó')
                // Fix: Ãº -> ú
                .replace(/\u00c3\u00ba/g, 'ú')
                // Fix: Ã -> í (common prefix if stripped)
                .replace(/\u00c3\u00ad/g, 'í')
                // Fix: Ã¡ -> á
                .replace(/\u00c3\u00a1/g, 'á')
                // Fix: Ã© -> é
                .replace(/\u00c3\u00a9/g, 'é')
                // Fix: Ã± -> ñ
                .replace(/\u00c3\u00b1/g, 'ñ');
        }
        if (Array.isArray(obj)) {
            return obj.map(item => fixEncoding(item));
        }
        if (typeof obj === 'object') {
            const newObj = {};
            Object.keys(obj).forEach(key => {
                newObj[key] = fixEncoding(obj[key]);
            });
            return newObj;
        }
    } catch (e) {
        console.error('Error fixing encoding:', e);
        return obj;
    }
    return obj;
};

// Utility to normalize car data (encoding + prices)
const processCarData = (obj) => {
    if (!obj) return obj;

    // Fix encoding first
    const fixed = fixEncoding(obj);

    // Helper to process a single car
    const processSingle = (car) => {
        if (!car || typeof car !== 'object') return car;

        // Robust check for photos
        car.hasPhotos = car.images &&
            car.images.length > 0 &&
            car.images[0] &&
            car.images[0].trim() !== "" &&
            !car.images[0].includes('placeholder');

        const rawPrice = Number(car.price);
        if (!isNaN(rawPrice) && rawPrice > 0) {
            // Assume prices < 1,000,000 are in USD (less than 7 figures)
            car.isUSD = rawPrice < 1000000;
            car.arsPrice = car.isUSD ? rawPrice * 1500 : rawPrice;
            car.arsDownpayment = car.arsPrice * 0.2;
        } else {
            car.arsPrice = 0;
            car.arsDownpayment = 0;
            car.isUSD = false;
        }
        return car;
    };

    if (Array.isArray(fixed)) {
        return fixed.map(item => processSingle(item));
    }
    return processSingle(fixed);
};

/**
 * Get all cars from the API
 */
export const getCars = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        if (data.success) {
            return processCarData(data.data);
        } else {
            throw new Error(data.message || 'Error fetching cars');
        }
    } catch (error) {
        console.error('Error getting cars from API:', error);
        // Fallback or empty state
        return [];
    }
};

/**
 * Get a single car by ID
 */
export const getCarById = async (id) => {
    try {
        const response = await fetch(`${API_URL}?id=${id}`);
        const data = await response.json();

        if (data.success) {
            return processCarData(data.data);
        } else {
            throw new Error(data.message || 'Car not found');
        }
    } catch (error) {
        console.error('Error getting car:', error);
        throw error;
    }
};

/**
 * Add a new car with images
 */
export const addCar = async (carData, images) => {
    try {
        console.log('🚗 Creating car in Database:', carData);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carData),
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'Error creating car');

        const carId = data.id;

        // Upload images if provided
        if (images && images.length > 0) {
            const formData = new FormData();
            formData.append('car_id', carId);

            for (let i = 0; i < images.length; i++) {
                formData.append('images[]', images[i]);
            }

            const uploadResponse = await fetch(UPLOAD_URL, {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadResponse.json();
            if (!uploadData.success) {
                console.error('❌ Upload failed:', uploadData.message);
            }
        }

        return carId;
    } catch (error) {
        console.error('❌ Error adding car to DB:', error);
        throw error;
    }
};

/**
 * Update an existing car
 */
export const updateCar = async (id, carData, newImages = null) => {
    try {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carData),
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'Error updating car');

        if (newImages && newImages.length > 0) {
            const formData = new FormData();
            formData.append('car_id', id);
            for (let i = 0; i < newImages.length; i++) {
                formData.append('images[]', newImages[i]);
            }
            await fetch(UPLOAD_URL, {
                method: 'POST',
                body: formData,
            });
        }

        return true;
    } catch (error) {
        console.error('Error updating car:', error);
        throw error;
    }
};

/**
 * Delete a car
 */
export const deleteCar = async (id) => {
    try {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error deleting car:', error);
        throw error;
    }
};

/**
 * Listen to real-time updates (Polling)
 */
export const listenToCars = (callback, interval = 60000) => {
    let isSubscribed = true;
    let lastCars = [];

    const fetchAndNotify = async () => {
        try {
            // 1. Get base data from DB immediately
            const baseCars = await getCars();

            if (baseCars.length === 0 && lastCars.length > 0) {
                console.warn('API returned 0 cars, keeping previous state.');
                return;
            }

            // Deliver base data instantly to UI
            if (isSubscribed && baseCars.length > 0) {
                lastCars = baseCars;
                callback(baseCars);
            }

            // 2. Attempt sync in background
            try {
                const syncResult = await applyDealershipSync(baseCars, {
                    forceRefresh: false,
                    generateDescriptions: false,
                    includeDescriptions: true
                });

                if (isSubscribed && syncResult && syncResult.cars && syncResult.cars.length > 0) {
                    lastCars = syncResult.cars;
                    callback(syncResult.cars);
                }
            } catch (syncError) {
                console.error('Background sync failed:', syncError);
                // No need to notify, UI already has baseCars
            }
        } catch (error) {
            console.error('Discovery error in car listener:', error);
        }
    };

    fetchAndNotify();
    const pollInterval = setInterval(fetchAndNotify, interval);

    return () => {
        isSubscribed = false;
        clearInterval(pollInterval);
    };
};

/**
 * Get featured cars
 */
export const getFeaturedCars = async (limit = 10) => {
    const cars = await getCars();
    return cars.filter(car => car.featured).slice(0, limit);
};

/**
 * Get cars by type
 */
export const getCarsByType = async (type) => {
    const cars = await getCars();
    return cars.filter(car => car.type === type);
};
