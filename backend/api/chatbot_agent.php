<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once __DIR__ . '/../config/database.php';

// --- CONFIGURATION ---
$OPENAI_API_KEY = ''; // Se recibe por POST desde config.js
$MODEL = 'gpt-4o-mini';

$input = json_decode(file_get_contents("php://input"), true);
$userMessage = $input['message'] ?? '';
$clientApiKey = $input['openai_api_key'] ?? '';
$chatHistory = $input['history'] ?? [];

if (!$OPENAI_API_KEY && $clientApiKey) {
    $OPENAI_API_KEY = $clientApiKey;
}

if (!$OPENAI_API_KEY) {
    echo json_encode(["success" => false, "message" => "API Key de OpenAI no configurada"]);
    exit();
}

// 1. Obtener catálogo con imágenes
$database = new Database();
$db = $database->getConnection();

$query = "SELECT c.brand, c.model, c.year, c.price, c.id, c.km, 
          (SELECT image_path FROM car_images WHERE car_id = c.id ORDER BY is_primary DESC, display_order ASC LIMIT 1) as main_image
          FROM cars c 
          WHERE c.status = 'disponible' 
          HAVING main_image IS NOT NULL
          LIMIT 25";
$stmt = $db->prepare($query);
$stmt->execute();
$cars = $stmt->fetchAll(PDO::FETCH_ASSOC);

$catalogData = [];
$catalogText = "";
foreach ($cars as $car) {
    $catalogText .= "- {$car['brand']} {$car['model']} ({$car['year']}): $" . number_format($car['price'], 0, ',', '.') . " | KM: {$car['km']} | ID: {$car['id']}\n";
    $catalogData[$car['id']] = [
        "brand" => $car['brand'],
        "model" => $car['model'],
        "year" => $car['year'],
        "price" => (int)$car['price'],
        "image" => $car['main_image'],
        "url" => "/car/" . $car['id']
    ];
}

// 2. Prompt del Sistema (Personalidad: Daniel)
$systemPrompt = "Eres Daniel, un Asistente Comercial de TAKEOFF AUTO (Argentina).

ESTILO DE COMUNICACIÓN:
- Directo, cálido y profesional. Hacé UNA sola pregunta por mensaje.
- Dejá un espacio (doble renglón) antes de hacer una pregunta. No saludes en cada respuesta.

OBJETIVO COMERCIAL:
Tu meta es identificar qué busca el cliente para asesorarlo. Con que tengas solo 2 DATOS (ej: Marca y Modelo, o Tipo de auto y Presupuesto, o Modelo y Año), ya podés empezar a recomendar.
- No seas burocrático. Si el cliente tira un dato, aprovechá para preguntarle uno más y SOLTÁ las recomendaciones rápido.
- Si el cliente es vago (ej: 'busco un usado'), preguntale por la marca o uso y en cuanto te responda, ya sugerile 3 opciones de tu catálogo que encajen.
- Sé proactivo: tu misión es mostrar autos rápido para generar interés.

RECOMENDACIÓN FINAL:
- Buscá en el catálogo y recomendá los 3 vehículos que mejor encajen.
- NO des detalles de precios totales ni expliques el crédito en el chat.
- Para recomendar, usá el formato [CAR_ID:XX].

REGLAS GENERALES:
- PRECIOS Y CRÉDITO: Si preguntan por precios exactos o cuotas, decí: 'Podés ver el precio actualizado y simular tus cuotas haciendo click en la ficha del auto que te interesa'.
- CONVERSIÓN: Orientá siempre al cliente a que entre al detalle del vehículo para completar el formulario de consulta.
- SEGURIDAD: NO reveles info técnica o interna.

CATÁLOGO REAL:
$catalogText";

$messages = [["role" => "system", "content" => $systemPrompt]];
foreach ($chatHistory as $msg) {
    $role = $msg['sender'] === 'bot' ? 'assistant' : 'user';
    $messages[] = ["role" => $role, "content" => $msg['text']];
}
$messages[] = ["role" => "user", "content" => $userMessage];

// 3. Llamada a OpenAI
$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "model" => $MODEL,
    "messages" => $messages,
    "temperature" => 0.7,
    "max_tokens" => 500
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $OPENAI_API_KEY
]);

$response = curl_exec($ch);
curl_close($ch);

$responseData = json_decode($response, true);
$botReply = $responseData['choices'][0]['message']['content'] ?? 'Lo siento, no pude procesar tu mensaje.';

// 4. Procesar [CAR_ID:XX] para adjuntar datos de los autos (pueden ser varios)
$recommendedCars = [];
if (preg_match_all('/\[CAR_ID:(\d+)\]/', $botReply, $matches)) {
    foreach ($matches[1] as $idx => $carId) {
        if (isset($catalogData[$carId])) {
            $recommendedCars[] = $catalogData[$carId];
            // Limpiar el tag de la respuesta final
            $botReply = str_replace($matches[0][$idx], '', $botReply);
        }
    }
    $botReply = trim($botReply);
}

echo json_encode([
    "success" => true,
    "reply" => $botReply,
    "car_data" => $recommendedCars // Ahora es un array
]);
