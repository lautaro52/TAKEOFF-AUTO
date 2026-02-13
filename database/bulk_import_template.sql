-- TEMPLATE PARA CARGA MASIVA DE AUTOS (SQL)
-- Usa este archivo para cargar varios autos a la vez en phpMyAdmin de Hostinger

USE takeoffauto_db;

-- 1. Insertar el auto (Ejemplo: Chevrolet Agile 1.4 Ls)
INSERT INTO cars (
    brand, model, version, year, price, km, transmission, fuel, 
    engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm,
    fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer,
    cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player,
    type, color, doors, passengers, city, status, featured
) VALUES (
    'Chevrolet',           -- brand
    'Agile',               -- model
    '1.4 Ls',             -- version
    2013,                  -- year
    4900000.00,            -- price
    125500,                -- km
    'manual',              -- transmission (manual / automatico)
    'gasolina',            -- fuel (gasolina / diesel / hibrido / electrico)
    '1.4',                 -- engine_size
    '92 hp',               -- horsepower
    2,                     -- valves_per_cylinder
    3996,                  -- length_mm
    1683,                  -- width_mm
    1474,                  -- height_mm
    2488,                  -- wheelbase_mm
    54,                    -- fuel_tank_liters
    0,                     -- abs_brakes (0 = No, 1 = Sí)
    'Conductor y acompañante', -- airbags
    0,                     -- cruise_control (0/1)
    1,                     -- air_conditioning (0/1)
    1,                     -- onboard_computer (0/1)
    1,                     -- cup_holders (0/1)
    'Hidráulica',          -- steering_type
    'Delantera',           -- traction_control
    1,                     -- am_fm_radio (0/1)
    1,                     -- bluetooth (0/1)
    1,                     -- mp3_player (0/1)
    'hatchback',           -- type (sedan, suv, hatchback, pickup, coupe, convertible, van, wagon)
    'Gris',                -- color
    5,                     -- doors
    5,                     -- passengers
    'Buenos Aires',        -- city
    'disponible',          -- status (disponible / apartado / vendido)
    0                      -- featured (0/1)
);

-- Obtener el ID del último auto insertado
SET @last_car_id = LAST_INSERT_ID();

-- 2. Vincular Imágenes
-- Asegúrate de subir las fotos a: backend/api/uploads/cars/
-- Ejemplo de vinculación de 3 fotos:
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@last_car_id, 'uploads/cars/agile_front.jpg', 1, 0),
(@last_car_id, 'uploads/cars/agile_back.jpg', 0, 1),
(@last_car_id, 'uploads/cars/agile_inter.jpg', 0, 2);
