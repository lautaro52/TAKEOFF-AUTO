-- Tabla de autos
CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    specs TEXT,
    km INT,
    transmission ENUM('automatico', 'manual') DEFAULT 'automatico',
    fuel ENUM('gasolina', 'diesel', 'hibrido', 'electrico') DEFAULT 'gasolina',
    type ENUM('sedan', 'suv', 'hatchback', 'pickup', 'coupe', 'convertible', 'van', 'wagon') DEFAULT 'sedan',
    color VARCHAR(50),
    city VARCHAR(100),
    status ENUM('disponible', 'apartado', 'vendido') DEFAULT 'disponible',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_brand (brand),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_featured (featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de imágenes de autos
CREATE TABLE IF NOT EXISTS car_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    INDEX idx_car_id (car_id),
    INDEX idx_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo (opcional)
INSERT INTO cars (brand, model, year, price, specs, km, transmission, fuel, type, color, city, status, featured) VALUES
('Mazda', 'CX-5', 2021, 390999.00, '2.5 S Turbo • AWD • Automático', 30560, 'automatico', 'gasolina', 'suv', 'rojo', 'Monterrey', 'disponible', true),
('Honda', 'Civic', 2023, 510000.00, 'Touring • Automático • Turbo', 12000, 'automatico', 'gasolina', 'sedan', 'blanco', 'Ciudad de México', 'disponible', true),
('Toyota', 'RAV4', 2020, 620000.00, 'Hybrid Limited • AWD • Automático', 45000, 'automatico', 'hibrido', 'suv', 'blanco', 'Monterrey', 'disponible', false);

-- Insertar imágenes de ejemplo (ajustar rutas según sea necesario)
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(1, 'uploads/cars/1/image1.jpg', true, 1),
(2, 'uploads/cars/2/image1.jpg', true, 1),
(3, 'uploads/cars/3/image1.jpg', true, 1);
