-- Script to repair double-encoded characters in the database
-- Reverses mangling caused by UTF-8 -> CP850 -> UTF-8 cycle

UPDATE cars SET 
    brand = REPLACE(brand, UNHEX('E2949CC2BD'), 'ë'),
    model = REPLACE(model, UNHEX('E2949CC2BD'), 'ë'),
    specs = REPLACE(specs, UNHEX('E2949CC2BD'), 'ë');

UPDATE cars SET 
    city = REPLACE(city, UNHEX('E2949CE29482'), 'ó'),
    brand = REPLACE(brand, UNHEX('E2949CE29482'), 'ó'),
    model = REPLACE(model, UNHEX('E2949CE29482'), 'ó'),
    specs = REPLACE(specs, UNHEX('E2949CE29482'), 'ó');

UPDATE cars SET 
    city = REPLACE(city, UNHEX('E2949CC3AD'), 'á'),
    brand = REPLACE(brand, UNHEX('E2949CC3AD'), 'á'),
    model = REPLACE(model, UNHEX('E2949CC3AD'), 'á'),
    specs = REPLACE(specs, UNHEX('E2949CC3AD'), 'á');

UPDATE cars SET 
    city = REPLACE(city, UNHEX('E2949CC2A9'), 'é'),
    brand = REPLACE(brand, UNHEX('E2949CC2A9'), 'é'),
    model = REPLACE(model, UNHEX('E2949CC2A9'), 'é'),
    specs = REPLACE(specs, UNHEX('E2949CC2A9'), 'é');

UPDATE cars SET 
    city = REPLACE(city, UNHEX('E2949CC2A1'), 'í'),
    brand = REPLACE(brand, UNHEX('E2949CC2A1'), 'í'),
    model = REPLACE(model, UNHEX('E2949CC2A1'), 'í'),
    specs = REPLACE(specs, UNHEX('E2949CC2A1'), 'í');

UPDATE cars SET 
    city = REPLACE(city, UNHEX('E2949CC2BA'), 'ú'),
    brand = REPLACE(brand, UNHEX('E2949CC2BA'), 'ú'),
    model = REPLACE(model, UNHEX('E2949CC2BA'), 'ú'),
    specs = REPLACE(specs, UNHEX('E2949CC2BA'), 'ú');

UPDATE cars SET 
    city = REPLACE(city, UNHEX('E2949CC2B1'), 'ñ'),
    brand = REPLACE(brand, UNHEX('E2949CC2B1'), 'ñ'),
    model = REPLACE(model, UNHEX('E2949CC2B1'), 'ñ'),
    specs = REPLACE(specs, UNHEX('E2949CC2B1'), 'ñ');

-- Handle some common uppercase variants if they exist
UPDATE cars SET 
    city = REPLACE(city, UNHEX('E2949CC393'), 'Ó'),
    brand = REPLACE(brand, UNHEX('E2949CC393'), 'Ó'),
    model = REPLACE(model, UNHEX('E2949CC393'), 'Ó'),
    specs = REPLACE(specs, UNHEX('E2949CC393'), 'Ó');
