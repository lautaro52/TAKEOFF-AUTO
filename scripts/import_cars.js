import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PUBLICIDAD_PATH = 'C:/Users/lauta/OneDrive/Desktop/lautaro/TAKE OFF/TAKE OFF AUTO FIAT TURING/publicidad';
const PROJECT_ROOT = 'c:/Users/lauta/OneDrive/Desktop/lautaro/TAKE OFF/TAKE OFF AUTO FIAT TURING/web clonada de kavak';
const UPLOADS_PATH = path.join(PROJECT_ROOT, 'backend/api/uploads/cars');
const XAMPP_UPLOADS_PATH = 'C:/xampp/htdocs/takeoffauto-api/uploads/cars';
const MYSQL_EXE = 'C:/xampp/mysql/bin/mysql.exe';
const DB_NAME = 'takeoffauto_db';

// Ensure uploads dirs exist
if (!fs.existsSync(UPLOADS_PATH)) fs.mkdirSync(UPLOADS_PATH, { recursive: true });
if (!fs.existsSync(XAMPP_UPLOADS_PATH)) fs.mkdirSync(XAMPP_UPLOADS_PATH, { recursive: true });

function extractTextFromDocx(filePath) {
    try {
        const tempDir = path.join(process.cwd(), 'temp_docx_extract_' + Math.random().toString(36).substr(2, 9));
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });

        const escapedPath = filePath.replace(/'/g, "''");
        const escapedTempDir = tempDir.replace(/'/g, "''");

        const psCommand = `Expand-Archive -LiteralPath '${escapedPath}' -DestinationPath '${escapedTempDir}' -Force; if (Test-Path '${escapedTempDir}/word/document.xml') { Get-Content '${escapedTempDir}/word/document.xml' -Raw }`;
        const xmlContent = execSync(`powershell -Command "${psCommand}"`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

        const text = xmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
        return text;
    } catch (e) {
        try {
            return fs.readFileSync(filePath, 'utf8').replace(/[^\x20-\x7E\n]/g, '');
        } catch (e2) {
            return '';
        }
    }
}

function parseCarData(folderName, folderPath) {
    let brand = 'Fiat';
    let model = folderName;
    let year = 2021;
    let km = 0;

    // Pattern: Marca_Modelo_Año_Kilometraje (e.g., Fiat_Cronos_2023_15000)
    if (folderName.includes('_')) {
        const parts = folderName.split('_');
        brand = parts[0] || 'Fiat';
        model = parts[1] || folderName;
        year = parseInt(parts[2]) || 2021;
        km = parseInt(parts[3]) || 0;
    }

    let price = 0;
    let specs = '';
    let transmission = 'manual';
    let fuel = 'gasolina';
    let type = 'sedan';
    let color = 'blanco';
    let city = 'Fiat Turing';

    const files = fs.readdirSync(folderPath);
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const lowerFile = file.toLowerCase();

        if (lowerFile.endsWith('.docx') || lowerFile.includes('descripcion') || lowerFile.includes('ficha')) {
            const content = extractTextFromDocx(filePath);

            // Extract price from file
            const priceMatch = content.match(/Precio[\s:]+\$?\s*([\d\.,]+)/i) || content.match(/\$\s*([\d\.,]+)/);
            if (priceMatch && !price) {
                const p = priceMatch[1].replace(/[\.,]/g, '');
                if (p.length > 3) price = parseInt(p);
            }

            // If KM wasn't in folder name, try to find it in file
            if (km === 0) {
                const kmMatch = content.match(/([\d\.,]+)\s*km/i) || content.match(/Kilometraje[\s:]+([\d\.,]+)/i);
                if (kmMatch) km = parseInt(kmMatch[1].replace(/[\.,]/g, ''));
            }

            if (content.toLowerCase().match(/(automático|tiptronic|at|automática)/)) transmission = 'automatico';
            if (content.toLowerCase().match(/(suv|ecosport|captur)/)) type = 'suv';
            if (content.toLowerCase().match(/(pick up|strada|toro|camioneta)/)) type = 'pickup';

            specs += content + ' ';
        }
    }

    // Heuristics fallback
    if (!price) {
        if (folderName.includes('Strada')) price = 12500000;
        if (folderName.includes('Palio')) price = 4500000;
        if (folderName.includes('Ecosport')) price = 9800000;
        if (folderName.includes('208')) price = 11200000;
        if (folderName.includes('Captur')) price = 10500000;
    }

    specs = specs.substring(0, 1000).replace(/'/g, "''").replace(/[\r\n]/g, ' ');

    return { brand, model, year, price, km, transmission, fuel, type, color, city, specs: specs.trim() };
}

function importCars() {
    console.log('--- Iniciando Importación de Autos (Con Unicidad por KM) ---');

    const folders = fs.readdirSync(PUBLICIDAD_PATH).filter(f => {
        const p = path.join(PUBLICIDAD_PATH, f);
        return fs.statSync(p).isDirectory() && f !== 'Nueva carpeta';
    });

    for (const folder of folders) {
        console.log(`\n📂 Procesando: ${folder}`);
        const folderPath = path.join(PUBLICIDAD_PATH, folder);
        const data = parseCarData(folder, folderPath);

        // Check if already exists to avoid exact duplicates (Brand + Model + Year + KM)
        const checkSql = `SELECT id FROM cars WHERE brand='${data.brand}' AND model='${data.model}' AND year=${data.year} AND km=${data.km} LIMIT 1;`;
        const existing = execSync(`"${MYSQL_EXE}" -u root ${DB_NAME} -e "${checkSql}"`, { encoding: 'utf8' });

        if (existing.includes('id')) {
            console.log(`   ⚠️  Saltando: Ya existe un auto con estos datos.`);
            continue;
        }

        const sqlInsert = `INSERT INTO cars (brand, model, year, price, specs, km, transmission, fuel, type, color, city, status, featured) VALUES ('${data.brand}', '${data.model}', ${data.year}, ${data.price}, '${data.specs}', ${data.km}, '${data.transmission}', '${data.fuel}', '${data.type}', '${data.color}', '${data.city}', 'disponible', 1);`;

        try {
            execSync(`"${MYSQL_EXE}" -u root ${DB_NAME} -e "${sqlInsert}"`);
            const getID = `SELECT id FROM cars ORDER BY id DESC LIMIT 1;`;
            const idResult = execSync(`"${MYSQL_EXE}" -u root ${DB_NAME} -e "${getID}"`, { encoding: 'utf8' });
            const carId = idResult.match(/\d+/)?.[0];

            if (carId) {
                console.log(`   ✅ Insertado ID: ${carId} ($${data.price.toLocaleString()} | ${data.km} km)`);

                const carUploadDir = path.join(UPLOADS_PATH, carId);
                const xamppCarUploadDir = path.join(XAMPP_UPLOADS_PATH, carId);

                if (!fs.existsSync(carUploadDir)) fs.mkdirSync(carUploadDir, { recursive: true });
                if (!fs.existsSync(xamppCarUploadDir)) fs.mkdirSync(xamppCarUploadDir, { recursive: true });

                const files = fs.readdirSync(folderPath);
                let imageCount = 0;
                for (const file of files) {
                    if (file.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/)) {
                        imageCount++;
                        const ext = path.extname(file);
                        const newFileName = `${Date.now()}_${imageCount}${ext}`;

                        // Copy to both locations
                        fs.copyFileSync(path.join(folderPath, file), path.join(carUploadDir, newFileName));
                        fs.copyFileSync(path.join(folderPath, file), path.join(xamppCarUploadDir, newFileName));

                        const relativePath = `uploads/cars/${carId}/${newFileName}`;
                        const isPrimary = imageCount === 1 ? 1 : 0;
                        const sqlImg = `INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES (${carId}, '${relativePath}', ${isPrimary}, ${imageCount});`;
                        execSync(`"${MYSQL_EXE}" -u root ${DB_NAME} -e "${sqlImg}"`);
                    }
                }
                console.log(`   🖼️  ${imageCount} imágenes copiadas.`);
            }
        } catch (e) {
            console.error(`   ❌ Error:`, e.message);
        }
    }

    console.log('\n--- Proceso Completado ---');
}

importCars();
