const fs = require('fs');
const path = require('path');

const CATALOG_BASE_DIR = path.join(__dirname, 'catalog_source');
const UPLOADS_DIR = path.join(__dirname, 'backend', 'api', 'uploads', 'cars');
const OUTPUT_SQL = 'database/ingest_90_cars.sql';

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const folders = fs.readdirSync(CATALOG_BASE_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

let sqlOutput = 'USE takeoffauto_db;\n\n';

folders.forEach((folderName, index) => {
    const folderPath = path.join(CATALOG_BASE_DIR, folderName);
    const fichaPath = path.join(folderPath, 'ficha_tecnica.txt');

    if (!fs.existsSync(fichaPath)) return;

    let content;
    try {
        content = fs.readFileSync(fichaPath, 'utf8');
    } catch (e) {
        console.error(`Error reading ${fichaPath}: ${e.message}`);
        return;
    }

    const specs = {};

    // Basic fields from top
    const priceMatch = content.match(/Precio: \$([0-9.]+)/);
    const kmMatch = content.match(/Kilometraje: ([0-9]+)/);
    const yearMatch = content.match(/Año: ([0-9]+)/);

    // Parse specs list
    const lines = content.split('\n');
    lines.forEach(line => {
        const match = line.match(/• (.*?): (.*)/);
        if (match) {
            specs[match[1].trim()] = match[2].trim();
        }
    });

    // Map to DB fields
    const fuelMap = { 'Nafta': 'gasolina', 'Diesel': 'diesel', 'Híbrido': 'hibrido', 'Eléctrico': 'electrico', 'GNC': 'gasolina' };
    const typeMap = { 'Sedán': 'sedan', 'SUV': 'suv', 'Hatchback': 'hatchback', 'Pickup': 'pickup', 'Cupé': 'coupe', 'Convertible': 'convertible', 'Van': 'van', 'Wagon': 'wagon' };

    // Parse dimensions: 4063 mm x 1549 mm x 1835 mm
    let length = 0, height = 0, width = 0;
    const dimMatch = (specs['Largo x Altura x Ancho'] || '').match(/([0-9]+) mm x ([0-9]+) mm x ([0-9]+) mm/);
    if (dimMatch) {
        length = parseInt(dimMatch[1]);
        height = parseInt(dimMatch[2]);
        width = parseInt(dimMatch[3]);
    }

    const data = {
        brand: specs['Marca'] || '',
        model: specs['Modelo'] || '',
        version: specs['Versión'] || '',
        year: yearMatch ? parseInt(yearMatch[1]) : (specs['Año'] ? parseInt(specs['Año']) : 0),
        price: priceMatch ? parseInt(priceMatch[1].replace(/\./g, '')) : 0,
        km: kmMatch ? parseInt(kmMatch[1]) : (specs['Kilómetros'] ? parseInt(specs['Kilómetros'].replace(/\D/g, '')) : 0),
        transmission: (specs['Transmisión'] || '').toLowerCase().includes('auto') ? 'automatico' : 'manual',
        fuel: fuelMap[specs['Tipo de combustible']] || 'gasolina',
        engine_size: specs['Motor'] || '',
        horsepower: specs['Potencia'] || '',
        valves_per_cylinder: parseInt(specs['Válvulas por cilindro'] || 0),
        length_mm: length,
        width_mm: width,
        height_mm: height,
        wheelbase_mm: parseInt((specs['Distancia entre ejes'] || '0').replace(/\D/g, '')),
        fuel_tank_liters: parseInt((specs['Capacidad del tanque'] || '0').replace(/\D/g, '')),
        abs_brakes: specs['Frenos ABS'] === 'Sí' ? 1 : 0,
        airbags: (specs['Airbag para conductor y pasajero'] === 'Sí' || specs['Airbag'] === 'Sí') ? 'Conductor y pasajero' : 'No',
        cruise_control: specs['Piloto automático'] === 'Sí' ? 1 : 0,
        air_conditioning: specs['Aire acondicionado'] === 'Sí' ? 1 : 0,
        onboard_computer: specs['Computadora de abordo'] === 'Sí' ? 1 : 0,
        cup_holders: specs['Porta vasos'] === 'Sí' ? 1 : 0,
        steering_type: specs['Dirección'] || '',
        traction_control: specs['Control de tracción'] || '',
        am_fm_radio: specs['AM/FM'] === 'Sí' ? 1 : 0,
        bluetooth: specs['Bluetooth'] === 'Sí' ? 1 : 0,
        mp3_player: specs['Reproductor de MP3'] === 'Sí' ? 1 : 0,
        type: typeMap[specs['Tipo de carrocería']] || 'sedan',
        color: specs['Color'] || '',
        doors: parseInt((specs['Puertas'] || '0').replace(/\D/g, '')),
        passengers: parseInt((specs['Capacidad de personas'] || '0').replace(/\D/g, '')),
        city: 'Córdoba Capital',
        status: 'disponible',
        featured: (index < 6) ? 1 : 0
    };

    // Clean data (escape single quotes)
    for (let key in data) {
        if (typeof data[key] === 'string') {
            data[key] = data[key].replace(/'/g, "''");
        }
        if (typeof data[key] === 'number' && isNaN(data[key])) {
            data[key] = 0;
        }
    }

    // Identify images
    const images = fs.readdirSync(folderPath).filter(f => f.endsWith('.webp'));
    const carImageNames = [];

    images.forEach(img => {
        const safeFolderName = folderName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const newImgName = `${safeFolderName}_${img}`;
        const destPath = path.join(UPLOADS_DIR, newImgName);

        try {
            fs.copyFileSync(path.join(folderPath, img), destPath);
            carImageNames.push(`uploads/cars/${newImgName}`);
        } catch (e) {
            console.error(`Error copying image ${img}: ${e.message}`);
        }
    });

    // Generate SQL
    sqlOutput += `-- ${data.brand} ${data.model} ${data.year}\n`;
    const keys = Object.keys(data);
    const values = Object.values(data).map(v => typeof v === 'string' ? `'${v}'` : v);
    sqlOutput += `INSERT INTO cars (${keys.join(', ')}) VALUES (${values.join(', ')});\n`;
    sqlOutput += `SET @car_id = LAST_INSERT_ID();\n`;

    if (carImageNames.length > 0) {
        sqlOutput += `INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES\n`;
        const imgInserts = carImageNames.map((imgPath, i) => `(@car_id, '${imgPath}', ${i === 0 ? 1 : 0}, ${i})`).join(',\n');
        sqlOutput += `${imgInserts};\n\n`;
    }
});

fs.writeFileSync(OUTPUT_SQL, sqlOutput);
console.log(`Success! SQL generated at ${OUTPUT_SQL} and images copied.`);
