-- Tabla para analytics de búsquedas
-- Esta tabla registra eventos de búsqueda, visualización y filtros aplicados por los usuarios

CREATE TABLE IF NOT EXISTS search_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Tipo de evento
    event_type ENUM('search', 'view', 'filter_change') NOT NULL,
    
    -- Datos del auto (nullable para eventos generales)
    car_id INT NULL,
    brand VARCHAR(100) NULL,
    model VARCHAR(100) NULL,
    type VARCHAR(50) NULL,
    
    -- Filtros aplicados
    price_min DECIMAL(10, 2) NULL,
    price_max DECIMAL(10, 2) NULL,
    fuel VARCHAR(50) NULL,
    transmission VARCHAR(50) NULL,
    color VARCHAR(50) NULL,
    
    -- Geolocalización
    latitude DECIMAL(10, 7) NULL,
    longitude DECIMAL(10, 7) NULL,
    city VARCHAR(100) NULL,
    region VARCHAR(100) NULL,
    country VARCHAR(50) DEFAULT 'Argentina',
    
    -- Información técnica
    user_agent TEXT NULL,
    ip_address VARCHAR(45) NULL,
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices para mejorar performance de queries
    INDEX idx_event_type (event_type),
    INDEX idx_brand (brand),
    INDEX idx_model (model),
    INDEX idx_type (type),
    INDEX idx_city (city),
    INDEX idx_created_at (created_at),
    INDEX idx_brand_model (brand, model),
    
    -- Foreign key opcional (permite NULL si el auto es eliminado)
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índice compuesto para queries de tendencias por ubicación
CREATE INDEX idx_location_date ON search_analytics(city, created_at);

-- Índice para queries de modelos populares
CREATE INDEX idx_popular_models ON search_analytics(brand, model, event_type, created_at);
