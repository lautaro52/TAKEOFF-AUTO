// Servicio para gestionar los autos en localStorage
const STORAGE_KEY = 'concesionaria_cars';

// Generar ID único para cada auto
const generateId = () => {
    return `car_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Obtener todos los autos
export const getAllCars = () => {
    try {
        const cars = localStorage.getItem(STORAGE_KEY);
        return cars ? JSON.parse(cars) : [];
    } catch (error) {
        console.error('Error al obtener autos:', error);
        return [];
    }
};

// Obtener un auto por ID
export const getCarById = (id) => {
    const cars = getAllCars();
    return cars.find(car => car.id === id);
};

// Agregar un nuevo auto
export const addCar = (carData) => {
    try {
        const cars = getAllCars();
        const newCar = {
            id: generateId(),
            ...carData,
            isReserved: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        cars.push(newCar);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
        return { success: true, car: newCar };
    } catch (error) {
        console.error('Error al agregar auto:', error);
        return { success: false, error: error.message };
    }
};

// Actualizar un auto existente
export const updateCar = (id, carData) => {
    try {
        const cars = getAllCars();
        const index = cars.findIndex(car => car.id === id);

        if (index === -1) {
            return { success: false, error: 'Auto no encontrado' };
        }

        cars[index] = {
            ...cars[index],
            ...carData,
            id, // Mantener el ID original
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
        return { success: true, car: cars[index] };
    } catch (error) {
        console.error('Error al actualizar auto:', error);
        return { success: false, error: error.message };
    }
};

// Eliminar un auto
export const deleteCar = (id) => {
    try {
        const cars = getAllCars();
        const filteredCars = cars.filter(car => car.id !== id);

        if (cars.length === filteredCars.length) {
            return { success: false, error: 'Auto no encontrado' };
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCars));
        return { success: true };
    } catch (error) {
        console.error('Error al eliminar auto:', error);
        return { success: false, error: error.message };
    }
};

// Marcar/desmarcar como apartado
export const toggleReserved = (id) => {
    try {
        const cars = getAllCars();
        const index = cars.findIndex(car => car.id === id);

        if (index === -1) {
            return { success: false, error: 'Auto no encontrado' };
        }

        cars[index].isReserved = !cars[index].isReserved;
        cars[index].updatedAt = new Date().toISOString();

        localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
        return { success: true, car: cars[index] };
    } catch (error) {
        console.error('Error al cambiar estado de reserva:', error);
        return { success: false, error: error.message };
    }
};

// Limpiar todos los datos (solo para desarrollo/testing)
export const clearAllCars = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return { success: true };
    } catch (error) {
        console.error('Error al limpiar datos:', error);
        return { success: false, error: error.message };
    }
};
