<?php
/**
 * Stock Sync API
 * Sincroniza el stock desde Google Sheets y Google Drive
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Google Sheets CSV URL
define('SHEETS_CSV_URL', 'https://docs.google.com/spreadsheets/d/1l1y3bmvbsFsM66OttAOK0yrY06K1fDFRH3h5UTMIjjE/export?format=csv');
define('DRIVE_API_KEY', 'AIzaSyAfpihCOvFvCRy2_ALHukOsy96eEJFEo6Y');
define('DRIVE_FOLDER_ID', '1KvtUvHXLbJofbZKKSwZxSsy0PayoLOTY');
define('OPENAI_PROXY_URL', 'http://localhost/api/openai-proxy.php');

/**
 * Generate AI specs for a car
 */
function generateAISpecs($brand, $model, $year, $km, $color) {
    $systemPrompt = "Eres un experto en automóviles. Genera una ficha técnica breve y atractiva en español argentino para un vehículo usado. 
    Incluye:
    - Título atractivo con marca y modelo
    - Breve descripción (2-3 oraciones) destacando puntos fuertes
    - Características principales en formato bullets
    - Estado general del vehículo
    
    Sé conciso y persuasivo. Usa emojis relevantes.";
    
    $userPrompt = "Vehículo: $year $brand $model\nKilómetros: $km\nColor: $color\n\nGenera la ficha técnica.";
    
    $payload = json_encode([
        'messages' => [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $userPrompt]
        ]
    ]);
    
    $ch = curl_init(OPENAI_PROXY_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        if (isset($data['choices'][0]['message']['content'])) {
            return $data['choices'][0]['message']['content'];
        }
    }
    
    return null;
}

/**
 * Generate basic specs without AI (fallback)
 */
function generateBasicSpecs($brand, $model, $year, $km, $color) {
    $kmInt = intval($km);
    $yearInt = intval($year);
    $vehicleAge = date('Y') - $yearInt;
    
    // Determine condition based on km and age
    $condition = 'Bueno';
    if ($kmInt > 150000 || $vehicleAge > 10) {
        $condition = 'Regular';
    } elseif ($kmInt < 50000 && $vehicleAge < 3) {
        $condition = 'Excelente';
    }
    
    // Fuel type guessing (simplified)
    $fuelType = 'Nafta';
    $modelUpper = strtoupper($model);
    if (strpos($modelUpper, 'DIESEL') !== false || strpos($modelUpper, 'TDI') !== false || strpos($modelUpper, 'CRDI') !== false) {
        $fuelType = 'Diésel';
    } elseif (strpos($modelUpper, 'HYBRID') !== false || strpos($modelUpper, 'HEV') !== false || strpos($modelUpper, 'ELEC') !== false) {
        $fuelType = 'Híbrido';
    } elseif (strpos($modelUpper, 'GNC') !== false || strpos($modelUpper, 'GNV') !== false) {
        $fuelType = 'GNC';
    }
    
    // Transmission guessing
    $transmission = 'Manual';
    if (strpos($modelUpper, 'AUTOMATIC') !== false || strpos($modelUpper, 'AT') !== false || strpos($modelUpper, 'CVT') !== false || strpos($modelUpper, 'TIPTRONIC') !== false || strpos($modelUpper, 'AT9') !== false || strpos($modelUpper, 'AT6') !== false || strpos($modelUpper, 'AT8') !== false) {
        $transmission = 'Automática';
    }
    
    $specs = "🚗 **{$year} {$brand} {$model}**\n\n";
    $specs .= "⭐ *Excelente oportunidad de compra!*\n\n";
    $specs .= "📋 *Características:*\n";
    $specs .= "• Año: {$year}\n";
    $specs .= "• Kilómetros: " . number_format($kmInt, 0, ',', '.') . " km\n";
    $specs .= "• Color: {$color}\n";
    $specs .= "• Combustible: {$fuelType}\n";
    $specs .= "• Transmisión: {$transmission}\n";
    $specs .= "• Estado general: {$condition}\n\n";
    
    if ($condition === 'Excelente') {
        $specs .= "✨ *Vehículo muy bien cuidado, pocos kilómetros para su año. Ideal para quien busca calidad y confiabilidad.*\n\n";
    } elseif ($condition === 'Bueno') {
        $specs .= "✨ *Vehículo en buen estado, listo para usar. Oportunidad para quienes buscan un auto confiable.*\n\n";
    } else {
        $specs .= "✨ *Vehículo para uso diario. Buena relación precio-producto.*\n\n";
    }
    
    $specs .= "📞 *Contáctanos para más información y para coordinar una visita!*";
    
    return $specs;
}

/**
 * Fetch CSV from Google Sheets
 */
function fetchSheetsData() {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, SHEETS_CSV_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $result = curl_exec($ch);
    curl_close($ch);
    
    return $result;
}

/**
 * Parse CSV data
 */
function parseCSV($csvData) {
    $lines = explode("\n", $csvData);
    $headers = str_getcsv(array_shift($lines));
    
    $data = [];
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line)) continue;
        
        $row = str_getcsv($line);
        if (count($row) < 6) continue;
        
        $data[] = [
            'vehicle' => trim($row[0]),
            'location' => trim($row[1]),
            'year' => trim($row[2]),
            'color' => trim($row[3]),
            'domain' => strtoupper(trim($row[4])),
            'km' => preg_replace('/[^\d]/', '', trim($row[5])),
            'price' => trim($row[6] ?? '')
        ];
    }
    
    return $data;
}

/**
 * Search image in Google Drive
 */
function searchDriveImage($domain) {
    $searchUrl = "https://www.googleapis.com/drive/v3/files?q='" . DRIVE_FOLDER_ID . "'+in+parents+and+name+contains+'" . urlencode($domain) . "'&key=" . DRIVE_API_KEY . "&fields=files(id,name,webContentLink)";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $searchUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $result = curl_exec($ch);
    curl_close($ch);
    
    $json = json_decode($result, true);
    
    if (!empty($json['files'])) {
        // Return the first matching file
        $file = $json['files'][0];
        return [
            'id' => $file['id'],
            'name' => $file['name'],
            'url' => $file['webContentLink'] ?? 'https://drive.google.com/uc?id=' . $file['id'] . '&export=download'
        ];
    }
    
    return null;
}

/**
 * Extract brand and model from vehicle name
 */
function extractBrandModel($vehicleName) {
    $brands = [
        'CHEVROLET', 'FIAT', 'FORD', 'TOYOTA', 'VOLKSWAGEN', 'VW', 
        'RENAULT', 'PEUGEOT', 'CITROEN', 'NISSAN', 'HYUNDAI', 'KIA',
        'JEEP', 'AUDI', 'HONDA', 'MERCEDES', 'BMW', 'MAZDA',
        'HUSQVARNA', 'DUCATI', 'YAMAHA', 'SUZUKI', 'KAWASAKI'
    ];
    
    $name = strtoupper(trim($vehicleName));
    
    $brand = 'OTRO';
    $model = $name;
    
    foreach ($brands as $b) {
        if (strpos($name, $b) !== false) {
            $brand = $b;
            $model = str_replace($brand, '', $name);
            $model = trim($model);
            break;
        }
    }
    
    return ['brand' => $brand, 'model' => $model];
}

/**
 * Parse price to numeric
 */
function parsePrice($priceStr) {
    // Remove currency symbols and spaces
    $priceStr = str_replace(['$', ' ', 'u$s', 'USD'], '', $priceStr);
    $priceStr = trim($priceStr);
    
    // Handle millions format (9,604,000 -> 9604000)
    $priceStr = str_replace(',', '', $priceStr);
    
    return is_numeric($priceStr) ? floatval($priceStr) : 0;
}

try {
    switch ($action) {
        case 'fetch':
            // Fetch and parse Google Sheets
            $csvData = fetchSheetsData();
            
            if (empty($csvData)) {
                throw new Exception("No se pudo obtener datos de Google Sheets");
            }
            
            $cars = parseCSV($csvData);
            
            echo json_encode([
                'success' => true,
                'message' => 'Datos obtenidos correctamente',
                'count' => count($cars),
                'data' => $cars
            ]);
            break;
            
        case 'sync':
            // Sync stock to database
            $csvData = fetchSheetsData();
            $cars = parseCSV($csvData);
            
            $synced = 0;
            $errors = [];
            
            foreach ($cars as $carData) {
                if (empty($carData['domain'])) continue;
                
                // Extract brand and model
                $bm = extractBrandModel($carData['vehicle']);
                
                // Search for image in Drive
                $imageData = searchDriveImage($carData['domain']);
                
                // Check if car exists by domain
                $checkQuery = "SELECT id FROM cars WHERE domain = :domain OR license_plate = :domain";
                $checkStmt = $db->prepare($checkQuery);
                $checkStmt->bindValue(':domain', $carData['domain']);
                $checkStmt->execute();
                
                $price = parsePrice($carData['price']);
                
                if ($checkStmt->rowCount() > 0) {
                    // Update existing car
                    $row = $checkStmt->fetch(PDO::FETCH_ASSOC);
                    $updateQuery = "UPDATE cars SET 
                        brand = :brand,
                        model = :model,
                        year = :year,
                        color = :color,
                        km = :km,
                        price = :price,
                        status = 'disponible',
                        domain = :domain,
                        updated_at = NOW()
                        WHERE id = :id";
                    
                    $updateStmt = $db->prepare($updateQuery);
                    $updateStmt->bindValue(':brand', $bm['brand']);
                    $updateStmt->bindValue(':model', $bm['model']);
                    $updateStmt->bindValue(':year', $carData['year']);
                    $updateStmt->bindValue(':color', $carData['color']);
                    $updateStmt->bindValue(':km', $carData['km']);
                    $updateStmt->bindValue(':price', $price);
                    $updateStmt->bindValue(':domain', $carData['domain']);
                    $updateStmt->bindValue(':id', $row['id']);
                    
                    if ($updateStmt->execute()) {
                        $synced++;
                    }
                } else {
                    // Insert new car
                    $insertQuery = "INSERT INTO cars (
                        brand, model, year, color, km, price, status, domain, city,
                        created_at, updated_at
                    ) VALUES (
                        :brand, :model, :year, :color, :km, :price, 'disponible', :domain, :city,
                        NOW(), NOW()
                    )";
                    
                    $insertStmt = $db->prepare($insertQuery);
                    $insertStmt->bindValue(':brand', $bm['brand']);
                    $insertStmt->bindValue(':model', $bm['model']);
                    $insertStmt->bindValue(':year', $carData['year']);
                    $insertStmt->bindValue(':color', $carData['color']);
                    $insertStmt->bindValue(':km', $carData['km']);
                    $insertStmt->bindValue(':price', $price);
                    $insertStmt->bindValue(':domain', $carData['domain']);
                    $insertStmt->bindValue(':city', $carData['location'] ?: 'Córdoba');
                    
                    if ($insertStmt->execute()) {
                        $synced++;
                    }
                }
            }
            
            // Mark cars not in sheets as vendido
            $domains = array_column($cars, 'domain');
            if (!empty($domains)) {
                $placeholders = implode(',', array_fill(0, count($domains), '?'));
                $updateSoldQuery = "UPDATE cars SET status = 'vendido' WHERE domain NOT IN ($placeholders) AND status = 'disponible'";
                $updateSoldStmt = $db->prepare($updateSoldQuery);
                $updateSoldStmt->execute($domains);
            }
            
            echo json_encode([
                'success' => true,
                'message' => "Stock sincronizado: $synced vehículos actualizados",
                'synced' => $synced,
                'total_sheets' => count($cars)
            ]);
            break;
            
        case 'search_image':
            // Search for image by domain
            $domain = isset($_GET['domain']) ? strtoupper($_GET['domain']) : '';
            
            if (empty($domain)) {
                throw new Exception("Dominio no proporcionado");
            }
            
            $imageData = searchDriveImage($domain);
            
            if ($imageData) {
                echo json_encode([
                    'success' => true,
                    'data' => $imageData
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Imagen no encontrada'
                ]);
            }
            break;
            
        case 'generate_specs':
            // Generate AI specs for cars without specs_ai
            $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
            
            $query = "SELECT id, brand, model, year, km, color FROM cars 
                      WHERE status = 'disponible' AND (specs_ai IS NULL OR specs_ai = '')
                      ORDER BY id DESC LIMIT $limit";
            $stmt = $db->query($query);
            $carsWithoutSpecs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (empty($carsWithoutSpecs)) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Todos los vehículos ya tienen ficha técnica',
                    'generated' => 0
                ]);
                break;
            }
            
            $generated = 0;
            $results = [];
            
            foreach ($carsWithoutSpecs as $car) {
                // Try AI first, fallback to basic if fails
                $specs = generateAISpecs($car['brand'], $car['model'], $car['year'], $car['km'], $car['color']);
                
                // If AI fails, use basic specs
                if (!$specs) {
                    $specs = generateBasicSpecs($car['brand'], $car['model'], $car['year'], $car['km'], $car['color']);
                }
                
                if ($specs) {
                    $updateQuery = "UPDATE cars SET specs_ai = :specs WHERE id = :id";
                    $updateStmt = $db->prepare($updateQuery);
                    $updateStmt->bindValue(':specs', $specs);
                    $updateStmt->bindValue(':id', $car['id']);
                    $updateStmt->execute();
                    
                    $generated++;
                    $results[] = [
                        'id' => $car['id'],
                        'vehicle' => "{$car['year']} {$car['brand']} {$car['model']}",
                        'specs' => $specs
                    ];
                    
                    // Small delay to avoid rate limiting
                    usleep(500000); // 0.5 seconds
                }
            }
            
            echo json_encode([
                'success' => true,
                'message' => "Se generaron $generated fichas técnicas",
                'generated' => $generated,
                'remaining' => count($carsWithoutSpecs) - $generated,
                'results' => $results
            ]);
            break;
            
        case 'generate_specs_single':
            // Generate AI specs for a single car
            $carId = isset($_GET['car_id']) ? intval($_GET['car_id']) : 0;
            
            if (!$carId) {
                throw new Exception("ID de auto no proporcionado");
            }
            
            $query = "SELECT id, brand, model, year, km, color FROM cars WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindValue(':id', $carId);
            $stmt->execute();
            $car = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$car) {
                throw new Exception("Auto no encontrado");
            }
            
            // Generate specs with AI
            $specs = generateAISpecs($car['brand'], $car['model'], $car['year'], $car['km'], $car['color']);
            
            if ($specs) {
                $updateQuery = "UPDATE cars SET specs_ai = :specs WHERE id = :id";
                $updateStmt = $db->prepare($updateQuery);
                $updateStmt->bindValue(':specs', $specs);
                $updateStmt->bindValue(':id', $carId);
                $updateStmt->execute();
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Ficha técnica generada',
                    'data' => [
                        'vehicle' => "{$car['year']} {$car['brand']} {$car['model']}",
                        'specs' => $specs
                    ]
                ]);
            } else {
                throw new Exception("Error al generar ficha técnica");
            }
            break;
            
        default:
            // Return info about the sync system
            echo json_encode([
                'success' => true,
                'message' => 'Stock Sync API',
                'actions' => [
                    'fetch' => 'Obtiene datos de Google Sheets',
                    'sync' => 'Sincroniza el stock a la base de datos',
                    'search_image' => 'Busca imagen en Drive por dominio',
                    'generate_specs' => 'Genera fichas técnicas con IA (limit=10)',
                    'generate_specs_single' => 'Genera ficha para un auto específico (car_id=123)'
                ]
            ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
