-- ================================================
-- CRM Schema for TAKEOFF-AUTO
-- ================================================

-- Admin users (for CRM login)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin','vendedor') DEFAULT 'admin',
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CRM Clients (sales pipeline)
CREATE TABLE IF NOT EXISTS crm_clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) DEFAULT NULL,
    email VARCHAR(150) DEFAULT NULL,
    dni VARCHAR(20) DEFAULT NULL,
    stage ENUM('sin_gestionar','primer_contacto','negociacion','venta_realizada','dado_de_baja') DEFAULT 'sin_gestionar',
    source VARCHAR(50) DEFAULT 'manual',
    car_id INT DEFAULT NULL,
    assigned_to INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_stage (stage),
    INDEX idx_assigned (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CRM Notes (per client)
CREATE TABLE IF NOT EXISTS crm_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    admin_id INT DEFAULT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES crm_clients(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_client (client_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CRM Tasks (scheduled follow-ups)
CREATE TABLE IF NOT EXISTS crm_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    admin_id INT DEFAULT NULL,
    description VARCHAR(500) NOT NULL,
    due_date DATETIME DEFAULT NULL,
    completed TINYINT(1) DEFAULT 0,
    completed_at DATETIME DEFAULT NULL,
    result_note TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES crm_clients(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_client (client_id),
    INDEX idx_due (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CRM Sales (completed transactions)
CREATE TABLE IF NOT EXISTS crm_sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    car_id INT DEFAULT NULL,
    amount DECIMAL(15,2) DEFAULT 0,
    sale_date DATE DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES crm_clients(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL,
    INDEX idx_date (sale_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CRM Activity Log (stage changes for reporting)
CREATE TABLE IF NOT EXISTS crm_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    admin_id INT DEFAULT NULL,
    action VARCHAR(50) NOT NULL,
    from_stage VARCHAR(30) DEFAULT NULL,
    to_stage VARCHAR(30) DEFAULT NULL,
    detail TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES crm_clients(id) ON DELETE CASCADE,
    INDEX idx_client (client_id),
    INDEX idx_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add has_photos flag to cars table (for "no photo" logic)
ALTER TABLE cars ADD COLUMN IF NOT EXISTS has_photos TINYINT(1) DEFAULT 1;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS domain VARCHAR(20) DEFAULT NULL;
ALTER TABLE cars ADD INDEX IF NOT EXISTS idx_domain (domain);

-- Seed admin user (password: takeoff2025)
INSERT INTO admin_users (email, password_hash, full_name, role)
VALUES ('admin@takeoffauto.com', '$2y$10$c4VLqkrnVGbO3G/XXhMS3uDteFsnkGEpx.eiRJXV5YlEdsMAmmft.', 'Admin TakeOff', 'admin')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);
