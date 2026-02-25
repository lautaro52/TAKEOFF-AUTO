<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(["success" => false]); exit(); }

set_time_limit(300); // Allow up to 5 minutes for sync

include_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

function verifyToken($t) {
    if (!$t) return null;
    $d = json_decode(base64_decode($t), true);
    return ($d && isset($d['exp']) && $d['exp'] > time()) ? $d : null;
}

$input = json_decode(file_get_contents("php://input"), true);
$admin = verifyToken($input['token'] ?? '');
if (!$admin) { http_response_code(401); echo json_encode(["success" => false, "message" => "No autorizado"]); exit(); }

// Config (same as frontend config.js)
$GOOGLE_API_KEY = $input['google_api_key'] ?? '';
$SHEET_ID = $input['sheet_id'] ?? '';
$DRIVE_FOLDER_ID = $input['drive_folder_id'] ?? '';
$OPENAI_API_KEY = $input['openai_api_key'] ?? '';
$SHEET_RANGES = $input['sheet_ranges'] ?? ['Hoja 1!A:Z', 'Stock!A:Z', 'Hoja1!A:Z', 'Sheet1!A:Z'];
$DOWNLOAD_IMAGES = $input['download_images'] ?? false;

if (!$GOOGLE_API_KEY || !$SHEET_ID) {
    echo json_encode(["success" => false, "message" => "Google API Key y Sheet ID requeridos"]);
    exit();
}

$log = [];
$stats = ['added' => 0, 'updated' => 0, 'removed' => 0, 'no_photos' => 0, 'ai_generated' => 0, 'errors' => 0];

// Helper: fetch URL with curl (more reliable than file_get_contents on XAMPP)
function curlGet($url) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_FOLLOWLOCATION => true,
    ]);
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    if ($error) return ['error' => $error, 'code' => 0];
    return ['body' => $result, 'code' => $httpCode];
}

// ─── STEP 1: Fetch Google Sheet ───
$log[] = "Leyendo Google Sheets...";
$sheetData = null;

foreach ($SHEET_RANGES as $range) {
    $url = "https://sheets.googleapis.com/v4/spreadsheets/$SHEET_ID/values/" . urlencode($range) . "?key=$GOOGLE_API_KEY";
    $resp = curlGet($url);
    if (isset($resp['body']) && $resp['code'] === 200) {
        $data = json_decode($resp['body'], true);
        if (!empty($data['values']) && count($data['values']) > 1) {
            $sheetData = $data['values'];
            $log[] = "Hoja encontrada: $range (" . (count($sheetData) - 1) . " filas)";
            break;
        }
    } else {
        $errMsg = $resp['error'] ?? "HTTP {$resp['code']}";
        $log[] = "⚠ Rango '$range' no disponible: $errMsg";
    }
}

if (!$sheetData) {
    echo json_encode(["success" => false, "message" => "No se pudo leer el Google Sheet", "log" => $log]);
    exit();
}

// Parse headers
$headers = array_map(function($h) {
    return strtolower(preg_replace('/[^a-z0-9]/', '', iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', strtolower(trim($h)))));
}, $sheetData[0]);

$log[] = "Columnas detectadas: " . implode(', ', array_filter($sheetData[0]));

$DOMAIN_KEYS = ['dominio', 'domain', 'patente', 'placa', 'matricula'];
$PRICE_KEYS = ['precio', 'price', 'valor', 'lista'];
$BRAND_KEYS = ['marca', 'brand'];
$MODEL_KEYS = ['modelo', 'model'];
$VEHICLE_KEYS = ['unidadescrdoba', 'unidadescordoba', 'unidades', 'vehiculo', 'vehicle', 'unidad', 'descripcion'];
$YEAR_KEYS = ['ao', 'ano', 'year', 'anio'];
$KM_KEYS = ['km', 'kilometros', 'kilometraje'];
$TRANS_KEYS = ['transmision', 'transmission'];
$COLOR_KEYS = ['color', 'colour'];
$FUEL_KEYS = ['combustible', 'fuel'];
$TYPE_KEYS = ['tipo', 'type', 'carroceria'];
$ENGINE_KEYS = ['motor', 'engine', 'cilindrada', 'litros', 'desplazamiento', 'cilindros'];
$HP_KEYS = ['potencia', 'horsepower', 'hp', 'cv', 'watts', 'kw'];
$DOORS_KEYS = ['puertas', 'doors', 'cant. puertas', 'cantidad de puertas'];
$PASSENGERS_KEYS = ['pasajeros', 'passengers', 'asientos', 'capacidad', 'butacas', 'plazas'];

function findCol($headers, $keys) {
    foreach ($keys as $k) {
        foreach ($headers as $idx => $h) {
            if (strpos($h, $k) !== false) return $idx;
        }
    }
    return -1;
}

$domainCol = findCol($headers, $DOMAIN_KEYS);
$priceCol = findCol($headers, $PRICE_KEYS);
$brandCol = findCol($headers, $BRAND_KEYS);
$modelCol = findCol($headers, $MODEL_KEYS);
$vehicleCol = findCol($headers, $VEHICLE_KEYS); // Combined brand+model column
$yearCol = findCol($headers, $YEAR_KEYS);
$kmCol = findCol($headers, $KM_KEYS);
$transCol = findCol($headers, $TRANS_KEYS);
$colorCol = findCol($headers, $COLOR_KEYS);
$fuelCol = findCol($headers, $FUEL_KEYS);
$typeCol = findCol($headers, $TYPE_KEYS);
$engineCol = findCol($headers, $ENGINE_KEYS);
$hpCol = findCol($headers, $HP_KEYS);
$doorsCol = findCol($headers, $DOORS_KEYS);
$passengersCol = findCol($headers, $PASSENGERS_KEYS);

if ($domainCol === -1) {
    $domainCol = 0;
    $log[] = "⚠ Columna dominio no encontrada, usando columna 1";
}

// Parse sheet rows
$sheetCars = [];
for ($i = 1; $i < count($sheetData); $i++) {
    $row = $sheetData[$i];
    $rawDomain = $row[$domainCol] ?? '';
    $domain = strtolower(preg_replace('/[^a-z0-9]/', '', strtolower($rawDomain)));
    
    // If no domain (0km), generate a virtual domain based on brand/model/year
    if (!$domain) {
        $brand = $brandCol >= 0 ? trim($row[$brandCol] ?? '') : '';
        $model = $modelCol >= 0 ? trim($row[$modelCol] ?? '') : '';
        $year = $yearCol >= 0 ? trim($row[$yearCol] ?? '') : '0km';
        $domain = "virtual_" . strtolower(preg_replace('/[^a-z0-9]/', '', $brand . $model . $year));
    }
    
    if (!$domain || $domain === 'virtual_') continue;

    $price = 0;
    if ($priceCol >= 0 && isset($row[$priceCol])) {
        $price = (int) preg_replace('/[^0-9]/', '', str_replace('.', '', $row[$priceCol]));
    }

    // Parse brand and model
    $brand = '';
    $model = '';
    if ($brandCol >= 0 && isset($row[$brandCol])) {
        $brand = trim($row[$brandCol]);
    }
    if ($modelCol >= 0 && isset($row[$modelCol])) {
        $model = trim($row[$modelCol]);
    }
    // If no separate brand/model, try combined vehicle name column
    if (empty($brand) && empty($model) && $vehicleCol >= 0 && isset($row[$vehicleCol])) {
        $vehicleName = trim($row[$vehicleCol]);
        if ($vehicleName) {
            $parts = preg_split('/\s+/', $vehicleName, 2);
            $brand = $parts[0] ?? '';
            $model = $parts[1] ?? '';
        }
    }

    $sheetCars[$domain] = [
        'domain' => $domain,
        'raw_domain' => $rawDomain,
        'brand' => $brand,
        'model' => $model,
        'year' => ($yearCol >= 0 && isset($row[$yearCol])) ? (int)$row[$yearCol] : 0,
        'price' => $price,
        'km' => ($kmCol >= 0 && isset($row[$kmCol])) ? (int) preg_replace('/[^0-9]/', '', $row[$kmCol]) : 0,
        'transmission' => ($transCol >= 0 && isset($row[$transCol])) ? (stripos($row[$transCol], 'auto') !== false ? 'automatico' : 'manual') : 'manual',
        'color' => ($colorCol >= 0 && isset($row[$colorCol])) ? strtolower(trim($row[$colorCol])) : 'blanco',
        'fuel' => ($fuelCol >= 0 && isset($row[$fuelCol])) ? strtolower(trim($row[$fuelCol])) : 'gasolina',
        'type' => ($typeCol >= 0 && isset($row[$typeCol])) ? strtolower(trim($row[$typeCol])) : 'sedan',
        'engine_size' => ($engineCol >= 0 && isset($row[$engineCol])) ? trim($row[$engineCol]) : null,
        'horsepower' => ($hpCol >= 0 && isset($row[$hpCol])) ? trim($row[$hpCol]) : null,
        'doors' => ($doorsCol >= 0 && isset($row[$doorsCol])) ? (int) preg_replace('/[^0-9]/', '', $row[$doorsCol]) : null,
        'passengers' => ($passengersCol >= 0 && isset($row[$passengersCol])) ? (int) preg_replace('/[^0-9]/', '', $row[$passengersCol]) : null,
    ];
}

$log[] = count($sheetCars) . " autos encontrados en el Sheet";

// ─── STEP 2: Fetch Drive images per domain (only if download_images is true) ───
$driveImages = [];
if ($DRIVE_FOLDER_ID && $DOWNLOAD_IMAGES) {
    $log[] = "Buscando carpetas en Google Drive...";
    $foldersUrl = "https://www.googleapis.com/drive/v3/files?key=$GOOGLE_API_KEY&q='" . urlencode($DRIVE_FOLDER_ID) . "'+in+parents+and+mimeType='application/vnd.google-apps.folder'+and+trashed=false&fields=files(id,name)&pageSize=500&supportsAllDrives=true&includeItemsFromAllDrives=true";
    $foldersResp = curlGet($foldersUrl);
    $folders = (isset($foldersResp['body']) && $foldersResp['code'] === 200) ? (json_decode($foldersResp['body'], true)['files'] ?? []) : [];
    $log[] = count($folders) . " carpetas encontradas en Drive";

    foreach ($folders as $folder) {
        $folderName = strtolower(trim($folder['name']));
        $folderDomain = strtolower(preg_replace('/[^a-z0-9]/', '', $folderName));
        if (!$folderDomain) continue;

        // Fetch images for this folder
        $imagesUrl = "https://www.googleapis.com/drive/v3/files?key=$GOOGLE_API_KEY&q='" . urlencode($folder['id']) . "'+in+parents+and+mimeType+contains+'image/'+and+trashed=false&fields=files(id,name)&pageSize=50&orderBy=name&supportsAllDrives=true&includeItemsFromAllDrives=true";
        $imagesResp = curlGet($imagesUrl);
        $images = (isset($imagesResp['body']) && $imagesResp['code'] === 200) ? (json_decode($imagesResp['body'], true)['files'] ?? []) : [];

        if (count($images) > 0) {
            $imgUrls = array_map(function($img) {
                return "https://drive.google.com/uc?export=view&id=" . $img['id'];
            }, $images);

            // Exact domain match
            $driveImages[$folderDomain] = $imgUrls;
            
            // Also try to help 0km matching by name if it looks like a brand/model
            // We store these as global keys so cars with virtual domains can find them
            $driveImages["name_" . $folderDomain] = $imgUrls;
        }
    }
    $log[] = count($driveImages) . " carpetas con fotos procesadas en Drive";
} else if (!$DOWNLOAD_IMAGES) {
    $log[] = "ℹ Descarga de imágenes desactivada (sync rápido)";
}

// ─── STEP 3: Get existing cars from DB ───
$existingStmt = $db->query("SELECT id, domain FROM cars WHERE domain IS NOT NULL AND domain != ''");
$existingByDomain = [];
while ($row = $existingStmt->fetch(PDO::FETCH_ASSOC)) {
    $existingByDomain[strtolower($row['domain'])] = (int)$row['id'];
}

// ─── STEP 4: Process each sheet car ───
$uploadDir = __DIR__ . '/uploads/cars/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

$carNum = 0;
$totalCars = count($sheetCars);

foreach ($sheetCars as $domain => $carInfo) {
    $carNum++;
    
    // Photo matching: try domain direct, then try matching folder name to brand+model
    $hasPhotos = false;
    $photoSource = null;
    
    if (isset($driveImages[$domain])) {
        $hasPhotos = true;
        $photoSource = $domain;
    } else if (strpos($domain, 'virtual_') === 0) {
        $searchKey = "name_" . strtolower(preg_replace('/[^a-z0-9]/', '', $carInfo['brand'] . $carInfo['model']));
        if (isset($driveImages[$searchKey])) {
            $hasPhotos = true;
            $photoSource = $searchKey;
        }
    }

    $existsInDb = isset($existingByDomain[$domain]);
    $label = "{$carInfo['brand']} {$carInfo['model']}";
    $displayDomain = strpos($domain, 'virtual_') === 0 ? "0KM/SIN PATENTE" : $domain;
    $priceFormatted = '$' . number_format($carInfo['price'], 0, ',', '.');

    if ($existsInDb) {
        // ... update logic
    }
        // UPDATE existing
        try {
            $updateFields = ["price = ?", "has_photos = ?", "updated_at = NOW()"];
            $updateParams = [$carInfo['price'], $hasPhotos ? 1 : 0];

            // Update brand/model/year if available (fixes missing data)
            if (!empty($carInfo['brand'])) { $updateFields[] = "brand = ?"; $updateParams[] = $carInfo['brand']; }
            if (!empty($carInfo['model'])) { $updateFields[] = "model = ?"; $updateParams[] = $carInfo['model']; }
            if ($carInfo['year'] > 0) { $updateFields[] = "year = ?"; $updateParams[] = $carInfo['year']; }
            if ($carInfo['km'] > 0) { $updateFields[] = "km = ?"; $updateParams[] = $carInfo['km']; }
            if (!empty($carInfo['color'])) { $updateFields[] = "color = ?"; $updateParams[] = $carInfo['color']; }
            if ($carInfo['engine_size'] !== null) { $updateFields[] = "engine_size = ?"; $updateParams[] = $carInfo['engine_size']; }
            if ($carInfo['horsepower'] !== null) { $updateFields[] = "horsepower = ?"; $updateParams[] = $carInfo['horsepower']; }
            if ($carInfo['doors'] !== null) { $updateFields[] = "doors = ?"; $updateParams[] = $carInfo['doors']; }
            if ($carInfo['passengers'] !== null) { $updateFields[] = "passengers = ?"; $updateParams[] = $carInfo['passengers']; }

            $updateParams[] = $existingByDomain[$domain];
            $db->prepare("UPDATE cars SET " . implode(', ', $updateFields) . " WHERE id = ?")->execute($updateParams);

            // Update images if available
            if ($hasPhotos && $photoSource) {
                $carId = $existingByDomain[$domain];
                $savedImages = downloadDriveImages($driveImages[$photoSource], $carId, $uploadDir);
                if (!empty($savedImages)) {
                    $db->prepare("DELETE FROM car_images WHERE car_id = ?")->execute([$carId]);
                    foreach ($savedImages as $idx => $imgPath) {
                        $db->prepare("INSERT INTO car_images (car_id, image_path, display_order) VALUES (?, ?, ?)")
                           ->execute([$carId, $imgPath, $idx]);
                    }
                    // Reset sorted state as photos changed
                    $db->prepare("UPDATE cars SET photos_sorted = 0 WHERE id = ?")->execute([$carId]);
                }
            }

            $stats['updated']++;
            $log[] = "🔄 [$carNum/$totalCars] Actualizado: $label ($displayDomain) | {$carInfo['year']} | $priceFormatted | {$carInfo['km']}km";
        } catch (Exception $e) {
            $stats['errors']++;
            $log[] = "❌ [$carNum/$totalCars] Error actualizando $label ($domain): " . $e->getMessage();
        }
    } else {
        // INSERT new car
        try {
            if (empty($carInfo['brand']) || empty($carInfo['model'])) {
                $log[] = "⚠ [$carNum/$totalCars] Saltando $displayDomain: sin marca/modelo";
                continue;
            }

            // Generate specs with OpenAI if available
            $specs = $carInfo['brand'] . ' ' . $carInfo['model'];
            if ($OPENAI_API_KEY) {
                $aiSpecs = generateAISpecs($carInfo, $OPENAI_API_KEY);
                if ($aiSpecs) {
                    $specs = $aiSpecs;
                    $stats['ai_generated']++;
                }
            }

            $stmt = $db->prepare("INSERT INTO cars (brand, model, year, price, specs, km, transmission, fuel, type, color, engine_size, horsepower, doors, passengers, city, status, featured, has_photos, domain, home_section) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'disponible', 0, ?, ?, NULL)");
            $stmt->execute([
                $carInfo['brand'],
                $carInfo['model'],
                $carInfo['year'],
                $carInfo['price'],
                $specs,
                $carInfo['km'],
                $carInfo['transmission'],
                $carInfo['fuel'],
                $carInfo['type'],
                $carInfo['color'],
                $carInfo['engine_size'],
                $carInfo['horsepower'],
                $carInfo['doors'],
                $carInfo['passengers'],
                'Córdoba Capital',
                $hasPhotos ? 1 : 0,
                $domain
            ]);
            $newCarId = $db->lastInsertId();

            // Download and save images
            if ($hasPhotos && $photoSource) {
                $savedImages = downloadDriveImages($driveImages[$photoSource], $newCarId, $uploadDir);
                foreach ($savedImages as $idx => $imgPath) {
                    $db->prepare("INSERT INTO car_images (car_id, image_path, display_order) VALUES (?, ?, ?)")
                       ->execute([$newCarId, $imgPath, $idx]);
                }
                $photoLabel = "📷 " . count($savedImages) . " fotos";
            } else {
                $stats['no_photos']++;
                $photoLabel = "📷 SIN FOTOS";
            }

            $stats['added']++;
            $log[] = "✅ [$carNum/$totalCars] Nuevo: $label ($displayDomain) | {$carInfo['year']} | $priceFormatted | {$carInfo['km']}km | {$carInfo['color']} | $photoLabel";
        } catch (Exception $e) {
            $stats['errors']++;
            $log[] = "⚠ Error insertando $domain: " . $e->getMessage();
        }
    }

    // Remove from existing list (remaining will be deleted)
    unset($existingByDomain[$domain]);
}

// ─── STEP 5: Remove cars no longer in sheet ───
foreach ($existingByDomain as $domain => $carId) {
    try {
        // Only remove cars that were synced (have domain), not manually added
        $db->prepare("UPDATE cars SET status = 'vendido' WHERE id = ? AND domain IS NOT NULL")->execute([$carId]);
        $stats['removed']++;
        $log[] = "🗑 Removido del catálogo: $domain (ID: $carId)";
    } catch (Exception $e) {
        $log[] = "⚠ Error removiendo $domain: " . $e->getMessage();
    }
}

$log[] = "───────────────────────────";
$log[] = "Sync completado: +{$stats['added']} nuevos, ~{$stats['updated']} actualizados, -{$stats['removed']} removidos";
if ($stats['no_photos'] > 0) $log[] = "📷 {$stats['no_photos']} autos sin fotos (no aparecerán en Home)";
if ($stats['ai_generated'] > 0) $log[] = "🤖 {$stats['ai_generated']} fichas técnicas generadas con IA";

echo json_encode(["success" => true, "stats" => $stats, "log" => $log]);

// ─── HELPER: Download Drive images to local server ───
function downloadDriveImages($urls, $carId, $uploadDir) {
    $carDir = $uploadDir . "$carId/";
    
    // Cleanup existing images to avoid mixing old low-res/webp with new high-res jpg
    if (is_dir($carDir)) {
        $files = glob($carDir . '*');
        foreach($files as $file) {
            if(is_file($file)) unlink($file);
        }
    } else {
        mkdir($carDir, 0755, true);
    }

    $saved = [];
    foreach ($urls as $idx => $url) {
        $ext = 'jpg';
        $filename = "img_" . ($idx + 1) . ".$ext";
        $localPath = $carDir . $filename;

        // Convert Drive view links to direct download links for high res
        if (strpos($url, 'drive.google.com') !== false) {
            if (strpos($url, 'id=') !== false) {
                preg_match('/id=([a-zA-Z0-9_-]+)/', $url, $matches);
                if (isset($matches[1])) $url = "https://lh3.googleusercontent.com/u/0/d/" . $matches[1];
            } else if (strpos($url, '/d/') !== false) {
                preg_match('/\/d\/([a-zA-Z0-9_-]+)/', $url, $matches);
                if (isset($matches[1])) $url = "https://lh3.googleusercontent.com/u/0/d/" . $matches[1];
            }
        }

        $ctx = stream_context_create(['http' => ['timeout' => 15, 'follow_location' => true]]);
        $imageData = @file_get_contents($url, false, $ctx);
        if ($imageData && strlen($imageData) > 5000) { // Check size to filter out thumbnails/errors
            file_put_contents($localPath, $imageData);
            $saved[] = "uploads/cars/$carId/$filename";
        }
    }
    return $saved;
}

// ─── HELPER: Generate AI specs ───
function generateAISpecs($carInfo, $apiKey) {
    $prompt = "Genera una ficha técnica resumida (máximo 80 palabras) para este vehículo usado en Argentina:\n";
    $prompt .= "Marca: {$carInfo['brand']}\nModelo: {$carInfo['model']}\n";
    if ($carInfo['year']) $prompt .= "Año: {$carInfo['year']}\n";
    if ($carInfo['km']) $prompt .= "Km: {$carInfo['km']}\n";
    if ($carInfo['transmission']) $prompt .= "Transmisión: {$carInfo['transmission']}\n";
    $prompt .= "Incluye: motor, potencia estimada, seguridad, confort. Formato: breve y profesional.";

    $body = json_encode([
        'model' => 'gpt-4.1-mini',
        'messages' => [
            ['role' => 'system', 'content' => 'Eres un experto automotriz argentino. Genera fichas técnicas concisas y precisas.'],
            ['role' => 'user', 'content' => $prompt]
        ],
        'temperature' => 0.5,
        'max_tokens' => 200
    ]);

    $ch = curl_init('https://api.openai.com/v1/chat/completions');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            "Authorization: Bearer $apiKey"
        ],
        CURLOPT_TIMEOUT => 30
    ]);
    $response = curl_exec($ch);
    curl_close($ch);

    if ($response) {
        $data = json_decode($response, true);
        return $data['choices'][0]['message']['content'] ?? null;
    }
    return null;
}
?>
