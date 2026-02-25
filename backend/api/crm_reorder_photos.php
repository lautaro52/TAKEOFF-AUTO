<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(["success" => false]); exit(); }

include_once __DIR__ . '/../config/database.php';

function verifyToken($t) {
    if (!$t) return null;
    $d = json_decode(base64_decode($t), true);
    return ($d && isset($d['exp']) && $d['exp'] > time()) ? $d : null;
}

$input = json_decode(file_get_contents("php://input"), true);
$admin = verifyToken($input['token'] ?? '');
if (!$admin) { http_response_code(401); echo json_encode(["success" => false, "message" => "No autorizado"]); exit(); }

$carId = $input['car_id'] ?? null;
$openaiKey = $input['openai_api_key'] ?? '';

if (!$carId || !$openaiKey) {
    echo json_encode(["success" => false, "message" => "car_id y openai_api_key requeridos"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();

// Get images for this car
$stmt = $db->prepare("SELECT id, image_path FROM car_images WHERE car_id = ? ORDER BY display_order ASC");
$stmt->execute([$carId]);
$images = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (count($images) <= 1) {
    echo json_encode(["success" => true, "message" => "No hay suficientes fotos para reordenar"]);
    exit();
}

// Prepare images for OpenAI (limited to first 10 to save tokens/time)
$maxImagesToScan = 10;
$imagesToScan = array_slice($images, 0, $maxImagesToScan);
$messagesHistory = [
    [
        "role" => "system",
        "content" => "You are an expert car catalog editor. Your task is to identify which image from a set is the best 'cover' photo (ideally a front-facing or front-three-quarter view of the exterior). Respond ONLY with the index (number starting at 0) of the chosen image."
    ],
    [
        "role" => "user",
        "content" => []
    ]
];

$messagesHistory[1]["content"][] = ["type" => "text", "text" => "Look at these car images and tell me which one (by index) is the best front-facing exterior shot for the main thumbnail:"];

foreach ($imagesToScan as $index => $img) {
    $path = __DIR__ . '/../../' . $img['image_path'];
    if (file_exists($path)) {
        // We ideally want to resize here, but to keep it simple and fast, 
        // we'll send as is and hope the user hasn't uploaded 20MB files
        // OR we use 'detail: low' which processes images at 512x512 cost.
        $imageData = base64_encode(file_get_contents($path));
        $mimeType = mime_content_type($path);
        
        $messagesHistory[1]["content"][] = [
            "type" => "text",
            "text" => "Image index $index:"
        ];
        $messagesHistory[1]["content"][] = [
            "type" => "image_url",
            "image_url" => [
                "url" => "data:$mimeType;base64,$imageData",
                "detail" => "low"
            ]
        ];
    }
}

// Call OpenAI
$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode([
        "model" => "gpt-4o-mini",
        "messages" => $messagesHistory,
        "max_tokens" => 5
    ]),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        "Authorization: Bearer $openaiKey"
    ],
    CURLOPT_TIMEOUT => 30
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode(["success" => false, "message" => "Error de OpenAI ($httpCode)", "details" => json_decode($response)]);
    exit();
}

$data = json_decode($response, true);
$selectedIndex = trim($data['choices'][0]['message']['content'] ?? '0');

// Clean up non-numeric response
if (!is_numeric($selectedIndex)) {
    preg_match('/\d+/', $selectedIndex, $matches);
    $selectedIndex = $matches[0] ?? 0;
}

$selectedIndex = (int)$selectedIndex;
if ($selectedIndex >= count($imagesToScan)) $selectedIndex = 0;

// Update database: move selected to 0, others follow
$selectedId = $imagesToScan[$selectedIndex]['id'];

// Set all to a high number first to avoid unique constraints if any (usually there aren't but good practice)
// Then set the selected one to 0
$db->prepare("UPDATE car_images SET display_order = display_order + 100 WHERE car_id = ?")->execute([$carId]);
$db->prepare("UPDATE car_images SET display_order = 0 WHERE id = ?")->execute([$selectedId]);

// Renumber others starting from 1
$stmt = $db->prepare("SELECT id FROM car_images WHERE car_id = ? AND id != ? ORDER BY display_order ASC");
$stmt->execute([$carId, $selectedId]);
$others = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($others as $idx => $row) {
    $newOrder = $idx + 1;
    $db->prepare("UPDATE car_images SET display_order = ? WHERE id = ?")->execute([$newOrder, $row['id']]);
}

// Mark car as sorted
$db->prepare("UPDATE cars SET photos_sorted = 1 WHERE id = ?")->execute([$carId]);

echo json_encode([
    "success" => true, 
    "message" => "Fotos reordenadas. Portada seleccionada: " . $imagesToScan[$selectedIndex]['image_path'],
    "selectedIndex" => $selectedIndex
]);
