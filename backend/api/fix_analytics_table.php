<?php
require_once __DIR__ . '/../config/database.php';
$database = new Database();
$db = $database->getConnection();

$query = "CREATE TABLE IF NOT EXISTS search_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    car_id INT NULL,
    brand VARCHAR(100) NULL,
    model VARCHAR(100) NULL,
    type VARCHAR(50) NULL,
    price_min DECIMAL(15,2) NULL,
    price_max DECIMAL(15,2) NULL,
    fuel VARCHAR(50) NULL,
    transmission VARCHAR(50) NULL,
    color VARCHAR(50) NULL,
    latitude DECIMAL(10,8) NULL,
    longitude DECIMAL(11,8) NULL,
    city VARCHAR(100) NULL,
    region VARCHAR(100) NULL,
    country VARCHAR(100) DEFAULT 'Argentina',
    user_agent TEXT NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

try {
    $db->exec($query);
    echo "Tabla 'search_analytics' creada exitosamente.\n";
} catch (PDOException $e) {
    echo "Error al crear la tabla: " . $e->getMessage() . "\n";
}
?>
