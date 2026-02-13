-- Semillas de datos de ejemplo para Take Off Partners (ACTUALIZADO)
USE takeoffauto_db;

-- 1. Asegurar que existe el Partner 1 con $1.200.000 de saldo disponible
INSERT INTO partners (id, full_name, whatsapp, password, cbu_alias, residence_zone, balance_available, balance_pending, sales_total_amount)
VALUES (1, 'Juan Datero', '1122334455', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'JUAN.DATERO.MP', 'Palermo', 1200000.00, 300000.00, 1200000.00)
ON DUPLICATE KEY UPDATE balance_available = 1200000.00, balance_pending = 300000.00, sales_total_amount = 1200000.00;

-- 2. Insertar 5 autos ficticios al stock
-- Primero limpiamos si queremos un stock controlado
DELETE FROM cars WHERE brand IN ('Ford', 'Toyota', 'Volkswagen', 'Chevrolet', 'Honda') AND city = 'Demo Store';

INSERT INTO cars (brand, model, year, price, specs, km, transmission, fuel, type, color, city, status, featured) VALUES
('Ford', 'Ranger XLT', 2022, 35000000.00, '3.2 4x4 • Automática • Cuero', 25000, 'automatico', 'diesel', 'pickup', 'gris', 'Demo Store', 'disponible', true),
('Toyota', 'Corolla SEG', 2021, 28000000.00, 'Hybrid • Automático • Full', 15000, 'automatico', 'hibrido', 'sedan', 'blanco', 'Demo Store', 'disponible', true),
('Volkswagen', 'Amarok V6', 2023, 42000000.00, 'Extreme • 4x4 • 258 CV', 10000, 'automatico', 'diesel', 'pickup', 'negro', 'Demo Store', 'disponible', true),
('Chevrolet', 'Cruze RS', 2022, 22000000.00, '1.4 Turbo • Hatchback • Deportivo', 18000, 'automatico', 'gasolina', 'hatchback', 'rojo', 'Demo Store', 'disponible', true),
('Honda', 'HR-V EXL', 2020, 25000000.00, 'i-VTEC • Automática • Unico Dueño', 35000, 'automatico', 'gasolina', 'suv', 'azul', 'Demo Store', 'disponible', true);

-- 3. Cargar 5 Leads ficticios para el Partner 1 (Seguimiento)
DELETE FROM leads WHERE partner_id = 1;

INSERT INTO leads (partner_id, car_id, client_name, client_whatsapp, note, status) VALUES
(1, (SELECT id FROM cars WHERE brand = 'Ford' LIMIT 1), 'Lucia Fernandez', '1166554433', 'Interesada en la Ranger', 'recibido'),
(1, (SELECT id FROM cars WHERE brand = 'Toyota' LIMIT 1), 'Marcos Lopez', '1155443322', 'Visitando agencia mañana', 'en_gestion'),
(1, (SELECT id FROM cars WHERE brand = 'Volkswagen' LIMIT 1), 'Sofia Rodriguez', '1144332211', 'Esperando aprobación de crédito', 'aprobacion_crediticia'),
(1, (SELECT id FROM cars WHERE brand = 'Chevrolet' LIMIT 1), 'Daniela Paz', '1133221100', 'Vio el video y quiere test drive', 'en_gestion'),
(1, (SELECT id FROM cars WHERE brand = 'Honda' LIMIT 1), 'Ignacio Ruiz', '1122110099', 'Recién cargado', 'recibido');
