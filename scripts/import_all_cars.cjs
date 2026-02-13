const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const PUBLICIDAD_FOLDER = 'C:\\Users\\lauta\\OneDrive\\Desktop\\lautaro\\TAKE OFF\\TAKE OFF AUTO FIAT TURING\\publicidad';
const API_BASE_URL = 'http://localhost/takeoffauto-api';
const UPLOAD_DIR = 'C:\\xampp\\htdocs\\takeoffauto-api\\api\\uploads\\cars';

// Monthly payment calculation constants
const FINANCING_PERCENT = 0.70; // 70% financing
const DOWN_PAYMENT_PERCENT = 0.30; // 30% down payment
const PAYMENT_FACTOR = 25.82; // Factor for 60 months
const MAX_CAR_AGE_FOR_FINANCING = 6; // Only cars 6 years or newer

/**
 * Calculate monthly payment for financing
 * Formula: Cuota = ((Precio × 70%) / 1000) × 25.82
 */
function calculateMonthlyPayment(price, year) {
    const currentYear = 2026;
    const carAge = currentYear - year;

    // Only calculate for cars 6 years or newer
    if (carAge > MAX_CAR_AGE_FOR_FINANCING) {
        return null;
    }

    const financedAmount = price * FINANCING_PERCENT;
    const unitsOfThousand = financedAmount / 1000;
    const monthlyPayment = Math.round(unitsOfThousand * PAYMENT_FACTOR);

    return monthlyPayment;
}

/**
 * Parse the ficha_tecnica.txt file
 */
function parseFichaTecnica(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const data = {
        brand: '',
        model: '',
        year: null,
        price: null,
        km: null,
        specs: '',
        transmission: 'manual',
        fuel: 'gasolina',
        type: 'sedan',
        color: 'blanco',
        city: 'Buenos Aires',
        status: 'disponible',
        featured: false
    };

    // Extract main fields
    for (const line of lines) {
        const trimmed = line.trim();

        // Extract year
        if (trimmed.startsWith('📅 Año:') || trimmed.includes('• Año:')) {
            const match = trimmed.match(/(\d{4})/);
            if (match) data.year = parseInt(match[1]);
        }

        // Extract price
        if (trimmed.startsWith('💰 Precio:')) {
            const match = trimmed.match(/\$?([\d.]+)/);
            if (match) {
                data.price = parseFloat(match[1].replace(/\./g, ''));
            }
        }

        // Extract kilometraje
        if (trimmed.startsWith('🛣️  Kilometraje:') || trimmed.includes('• Kilómetros:')) {
            const match = trimmed.match(/([\d.]+)\s*km/);
            if (match) {
                data.km = parseInt(match[1].replace(/\./g, ''));
            }
        }

        // Extract marca
        if (trimmed.includes('• Marca:')) {
            const match = trimmed.match(/• Marca:\s*(.+)/);
            if (match) data.brand = match[1].trim();
        }

        // Extract modelo
        if (trimmed.includes('• Modelo:')) {
            const match = trimmed.match(/• Modelo:\s*(.+)/);
            if (match) data.model = match[1].trim();
        }

        // Extract version
        if (trimmed.includes('• Versión:')) {
            const match = trimmed.match(/• Versión:\s*(.+)/);
            if (match) data.specs = match[1].trim();
        }

        // Extract color
        if (trimmed.includes('• Color:')) {
            const match = trimmed.match(/• Color:\s*(.+)/);
            if (match) data.color = match[1].trim().toLowerCase();
        }

        // Extract transmission
        if (trimmed.includes('• Transmisión:')) {
            const match = trimmed.match(/• Transmisión:\s*(.+)/);
            if (match) {
                const trans = match[1].trim().toLowerCase();
                data.transmission = trans.includes('manual') ? 'manual' : 'automatico';
            }
        }

        // Extract fuel type
        if (trimmed.includes('• Tipo de combustible:')) {
            const match = trimmed.match(/• Tipo de combustible:\s*(.+)/);
            if (match) {
                const fuelType = match[1].trim().toLowerCase();
                if (fuelType.includes('diesel')) data.fuel = 'diesel';
                else if (fuelType.includes('nafta') || fuelType.includes('gasolina')) data.fuel = 'gasolina';
                else if (fuelType.includes('hibrido') || fuelType.includes('híbrido')) data.fuel = 'hibrido';
                else if (fuelType.includes('eléctrico') || fuelType.includes('electrico')) data.fuel = 'electrico';
            }
        }

        // Extract body type
        if (trimmed.includes('• Tipo de carrocería:')) {
            const match = trimmed.match(/• Tipo de carrocería:\s*(.+)/);
            if (match) {
                const bodyType = match[1].trim().toLowerCase();
                if (bodyType.includes('sedan') || bodyType.includes('sedán')) data.type = 'sedan';
                else if (bodyType.includes('suv')) data.type = 'suv';
                else if (bodyType.includes('hatchback')) data.type = 'hatchback';
                else if (bodyType.includes('pickup')) data.type = 'pickup';
                else if (bodyType.includes('coupe') || bodyType.includes('cupé')) data.type = 'coupe';
                else if (bodyType.includes('van')) data.type = 'van';
            }
        }
    }

    // If model is empty, try to extract from vehicle name
    if (!data.model && lines.length > 1) {
        const vehicleLine = lines.find(l => l.includes('VEHÍCULO:'));
        if (vehicleLine) {
            const parts = vehicleLine.split(':')[1].trim().split(' ');
            if (parts.length >= 2) {
                data.brand = parts[0];
                data.model = parts[1];
                // Join the rest as specs
                if (parts.length > 2) {
                    data.specs = parts.slice(2).join(' ');
                }
            }
        }
    }

    // Mark as featured randomly (about 30% of cars)
    data.featured = Math.random() < 0.3;

    return data;
}

/**
 * Copy image files to uploads directory
 */
function copyImages(sourceDir, carId) {
    const files = fs.readdirSync(sourceDir);
    const imageFiles = files.filter(f => f.startsWith('foto_') && f.endsWith('.webp'));

    // Create car directory
    const carDir = path.join(UPLOAD_DIR, carId.toString());
    if (!fs.existsSync(carDir)) {
        fs.mkdirSync(carDir, { recursive: true });
    }

    const imagePaths = [];

    // Copy images
    imageFiles.forEach((file, index) => {
        const sourcePath = path.join(sourceDir, file);
        const destFileName = `${Date.now()}_${index + 1}.webp`;
        const destPath = path.join(carDir, destFileName);

        fs.copyFileSync(sourcePath, destPath);
        imagePaths.push(`uploads/cars/${carId}/${destFileName}`);
    });

    return imagePaths;
}

/**
 * Create a car via API
 */
async function createCar(carData) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(carData);

        const options = {
            hostname: 'localhost',
            port: 80,
            path: '/takeoffauto-api/api/cars.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result);
                } catch (e) {
                    reject(new Error('Failed to parse response: ' + data));
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

/**
 * Add images to car via direct database insert
 */
function addImagesToDatabase(carId, imagePaths, connection) {
    const mysql = require('mysql2/promise');

    imagePaths.forEach((imagePath, index) => {
        const query = `INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES (?, ?, ?, ?)`;
        const isPrimary = index === 0 ? 1 : 0;
        connection.query(query, [carId, imagePath, isPrimary, index]);
    });
}

/**
 * Main import function
 */
async function importAllCars() {
    console.log('🚗 Starting car import process...\n');

    // Get MySQL connection
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'takeoffauto_db'
    });

    const folders = fs.readdirSync(PUBLICIDAD_FOLDER);
    let successCount = 0;
    let errorCount = 0;

    for (const folder of folders) {
        const folderPath = path.join(PUBLICIDAD_FOLDER, folder);
        const stat = fs.statSync(folderPath);

        if (!stat.isDirectory()) continue;

        try {
            console.log(`\n📁 Processing: ${folder}`);

            // Parse ficha tecnica
            const fichaTecnicaPath = path.join(folderPath, 'ficha_tecnica.txt');
            if (!fs.existsSync(fichaTecnicaPath)) {
                console.log(`   ⚠️  No ficha_tecnica.txt found, skipping...`);
                errorCount++;
                continue;
            }

            const carData = parseFichaTecnica(fichaTecnicaPath);

            console.log(`   ✓ Brand: ${carData.brand}`);
            console.log(`   ✓ Model: ${carData.model}`);
            console.log(`   ✓ Year: ${carData.year}`);
            console.log(`   ✓ Price: $${carData.price?.toLocaleString()}`);
            console.log(`   ✓ KM: ${carData.km?.toLocaleString()} km`);

            // Calculate monthly payment
            const monthlyPayment = calculateMonthlyPayment(carData.price, carData.year);
            if (monthlyPayment) {
                console.log(`   💳 Monthly Payment: $${monthlyPayment.toLocaleString()} (60 months)`);
                carData.monthly_payment = monthlyPayment;
            } else {
                console.log(`   ⚠️  Car too old for financing (${2026 - carData.year} years)`);
            }

            // Create car in database
            const result = await createCar(carData);

            if (!result.success) {
                console.log(`   ❌ Failed to create car: ${result.message}`);
                errorCount++;
                continue;
            }

            const carId = result.id;
            console.log(`   ✓ Car created with ID: ${carId}`);

            // Copy images
            const imagePaths = copyImages(folderPath, carId);
            console.log(`   ✓ Copied ${imagePaths.length} images`);

            // Add images to database
            for (let i = 0; i < imagePaths.length; i++) {
                const isPrimary = i === 0 ? 1 : 0;
                await connection.query(
                    'INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES (?, ?, ?, ?)',
                    [carId, imagePaths[i], isPrimary, i]
                );
            }

            console.log(`   ✅ SUCCESS!`);
            successCount++;

        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            errorCount++;
        }
    }

    await connection.end();

    console.log('\n' + '='.repeat(60));
    console.log('📊 IMPORT SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📦 Total processed: ${successCount + errorCount}`);
    console.log('='.repeat(60));
}

// Run the import
importAllCars().catch(console.error);
