-- Tabla para guardar las solicitudes de cotización
CREATE TABLE IF NOT EXISTS quote_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    model VARCHAR(100) NOT NULL,
    version VARCHAR(100) NOT NULL,
    km VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    vehicle_condition VARCHAR(50) NOT NULL,
    features TEXT, -- Características adicionales (JSON string)
    recent_improvements TEXT, -- Mejoras (JSON string)
    other_features VARCHAR(255),
    other_improvements VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para guardar las imágenes asociadas a cada cotización
CREATE TABLE IF NOT EXISTS quote_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES quote_submissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
