<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // 1. Schema SQL
    $schema = "
    CREATE TABLE IF NOT EXISTS cars (
        id INT AUTO_INCREMENT PRIMARY KEY,
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INT NOT NULL,
        price DECIMAL(15,2) NOT NULL,
        specs TEXT,
        km INT,
        transmission VARCHAR(50),
        fuel VARCHAR(50),
        type VARCHAR(50),
        color VARCHAR(50),
        city VARCHAR(100),
        status ENUM('disponible', 'reservado', 'vendido') DEFAULT 'disponible',
        featured BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        whatsapp VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        cbu_alias VARCHAR(100),
        residence_zone VARCHAR(100),
        balance_available DECIMAL(15,2) DEFAULT 0.00,
        balance_pending DECIMAL(15,2) DEFAULT 0.00,
        sales_total_amount DECIMAL(15,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        partner_id INT,
        car_id INT,
        client_name VARCHAR(255) NOT NULL,
        client_whatsapp VARCHAR(50) NOT NULL,
        status ENUM('recibido', 'en_gestion', 'aprobacion_crediticia', 'venta_cerrada', 'caida') DEFAULT 'recibido',
        caida_reason TEXT,
        commission_amount DECIMAL(15,2) DEFAULT 300000.00,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (partner_id) REFERENCES partners(id)
    );";

    $db->exec($schema);

    // 2. Data Seeds
    $seeds = "
    -- Limpiar para demo
    DELETE FROM leads;
    DELETE FROM partners;
    DELETE FROM cars;

    -- Insertar Partner con 1.2M
    INSERT INTO partners (id, full_name, whatsapp, password, cbu_alias, residence_zone, balance_available, balance_pending, sales_total_amount)
    VALUES (1, 'Juan Datero', '1122334455', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'JUAN.DATERO.MP', 'Palermo', 1200000.00, 300000.00, 1200000.00);

    -- Insertar 5 Autos demo
    INSERT INTO cars (id, brand, model, year, price, specs, km, transmission, fuel, type, color, city, status, featured) VALUES
    (1, 'Ford', 'Ranger XLT', 2022, 35000000.00, '3.2 4x4 • Automática • Cuero', 25000, 'automatico', 'diesel', 'pickup', 'gris', 'Demo Store', 'disponible', 1),
    (2, 'Toyota', 'Corolla SEG', 2021, 28000000.00, 'Hybrid • Automático • Full', 15000, 'automatico', 'hibrido', 'sedan', 'blanco', 'Demo Store', 'disponible', 1),
    (3, 'Volkswagen', 'Amarok V6', 2023, 42000000.00, 'Extreme • 4x4 • 258 CV', 10000, 'automatico', 'diesel', 'pickup', 'negro', 'Demo Store', 'disponible', 1),
    (4, 'Chevrolet', 'Cruze RS', 2022, 22000000.00, '1.4 Turbo • Hatchback • Deportivo', 18000, 'automatico', 'gasolina', 'hatchback', 'rojo', 'Demo Store', 'disponible', 1),
    (5, 'Honda', 'HR-V EXL', 2020, 25000000.00, 'i-VTEC • Automática • Unico Dueño', 35000, 'automatico', 'gasolina', 'suv', 'azul', 'Demo Store', 'disponible', 1);

    -- Insertar 5 Leads
    INSERT INTO leads (partner_id, car_id, client_name, client_whatsapp, note, status) VALUES
    (1, 1, 'Lucia Fernandez', '1166554433', 'Interesada en la Ranger', 'recibido'),
    (1, 1, 'Marcos Lopez', '1155443322', 'Visitando agencia mañana', 'en_gestion'),
    (1, 2, 'Sofia Rodriguez', '1144332211', 'Esperando aprobación de crédito', 'aprobacion_crediticia'),
    (1, 4, 'Daniela Paz', '1133221100', 'Vio el video y quiere test drive', 'en_gestion'),
    (1, 5, 'Ignacio Ruiz', '1122110099', 'Recién cargado', 'recibido');
    ";

    $db->exec($seeds);

    echo json_encode([
        "success" => true,
        "message" => "Base de datos actualizada con ÉXITO. Saldo de $1.2M y 5 leads cargados."
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al sembrar datos: " . $e->getMessage()
    ]);
}
?>