-- Database schema update for Partners and Leads
USE takeoffauto_db;

-- Table for Partners (Lead Generators)
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

-- Table for Leads (Oportunidades)
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

-- Table for Payout Requests
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
