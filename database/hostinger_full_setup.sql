-- ============================================================
-- TAKEOFF AUTO - Full Database Setup for Hostinger
-- Database: u236151574_takeoffauto
-- Execute this file in phpMyAdmin on Hostinger to set up
-- all required tables from scratch.
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. CARS (Core inventory)
-- ============================================================
CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    version VARCHAR(100),
    year INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    specs TEXT,
    km INT,
    transmission ENUM('automatico', 'manual') DEFAULT 'automatico',
    fuel ENUM('gasolina', 'diesel', 'hibrido', 'electrico') DEFAULT 'gasolina',
    engine_size VARCHAR(20),
    horsepower VARCHAR(20),
    valves_per_cylinder TINYINT,
    length_mm INT,
    width_mm INT,
    height_mm INT,
    wheelbase_mm INT,
    fuel_tank_liters INT,
    abs_brakes BOOLEAN DEFAULT FALSE,
    airbags VARCHAR(100),
    cruise_control BOOLEAN DEFAULT FALSE,
    air_conditioning BOOLEAN DEFAULT FALSE,
    onboard_computer BOOLEAN DEFAULT FALSE,
    cup_holders BOOLEAN DEFAULT FALSE,
    steering_type VARCHAR(50),
    traction_control VARCHAR(50),
    am_fm_radio BOOLEAN DEFAULT FALSE,
    bluetooth BOOLEAN DEFAULT FALSE,
    mp3_player BOOLEAN DEFAULT FALSE,
    type ENUM('sedan', 'suv', 'hatchback', 'pickup', 'coupe', 'convertible', 'van', 'wagon') DEFAULT 'sedan',
    color VARCHAR(50),
    doors TINYINT,
    passengers TINYINT,
    city VARCHAR(100),
    status ENUM('disponible', 'apartado', 'vendido') DEFAULT 'disponible',
    featured BOOLEAN DEFAULT FALSE,
    home_section VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_brand (brand),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_featured (featured),
    INDEX idx_home_section (home_section)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. CAR IMAGES
-- ============================================================
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

-- ============================================================
-- 3. QUOTE SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS quote_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    model VARCHAR(100) NOT NULL,
    version VARCHAR(100) NOT NULL,
    km VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    vehicle_condition VARCHAR(50) NOT NULL,
    features TEXT,
    recent_improvements TEXT,
    other_features VARCHAR(255),
    other_improvements VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. QUOTE IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS quote_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES quote_submissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    whatsapp VARCHAR(20) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_dni (dni)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. USER FAVORITES
-- ============================================================
CREATE TABLE IF NOT EXISTS user_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, car_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. USER RECENT QUOTES (Activity Panel)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_recent_quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    quoted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    INDEX idx_user_quotes (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. PARTNERS (Lead generators)
-- ============================================================
CREATE TABLE IF NOT EXISTS partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    cbu_alias VARCHAR(100) NOT NULL,
    residence_zone VARCHAR(100),
    balance_available DECIMAL(10, 2) DEFAULT 0.00,
    balance_pending DECIMAL(10, 2) DEFAULT 0.00,
    sales_total_amount DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. LEADS (Oportunidades)
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id INT NOT NULL,
    car_id INT,
    client_name VARCHAR(255) NOT NULL,
    client_whatsapp VARCHAR(50) NOT NULL,
    note TEXT,
    status ENUM('recibido', 'en_gestion', 'aprobacion_crediticia', 'venta_cerrada', 'caida') DEFAULT 'recibido',
    caida_reason TEXT,
    commission_amount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL,
    INDEX idx_partner_id (partner_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. PAYOUTS
-- ============================================================
CREATE TABLE IF NOT EXISTS payouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pendiente', 'procesado', 'rechazado') DEFAULT 'pendiente',
    payment_proof VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. SEARCH ANALYTICS
-- ============================================================
CREATE TABLE IF NOT EXISTS search_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type ENUM('search', 'view', 'filter_change') NOT NULL,
    car_id INT NULL,
    brand VARCHAR(100) NULL,
    model VARCHAR(100) NULL,
    type VARCHAR(50) NULL,
    price_min DECIMAL(10, 2) NULL,
    price_max DECIMAL(10, 2) NULL,
    fuel VARCHAR(50) NULL,
    transmission VARCHAR(50) NULL,
    color VARCHAR(50) NULL,
    latitude DECIMAL(10, 7) NULL,
    longitude DECIMAL(10, 7) NULL,
    city VARCHAR(100) NULL,
    region VARCHAR(100) NULL,
    country VARCHAR(50) DEFAULT 'Argentina',
    user_agent TEXT NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_type (event_type),
    INDEX idx_brand (brand),
    INDEX idx_model (model),
    INDEX idx_type (type),
    INDEX idx_city (city),
    INDEX idx_created_at (created_at),
    INDEX idx_brand_model (brand, model),
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS idx_location_date ON search_analytics(city, created_at);
CREATE INDEX IF NOT EXISTS idx_popular_models ON search_analytics(brand, model, event_type, created_at);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- SETUP COMPLETE
-- Total tables: 11
--   cars, car_images, quote_submissions, quote_images,
--   users, user_favorites, user_recent_quotes,
--   partners, leads, payouts, search_analytics
-- ============================================================
