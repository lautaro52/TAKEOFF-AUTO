<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

include_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$email = trim($data['email'] ?? '');
$car_id = intval($data['car_id'] ?? 0);
$car_brand = trim($data['car_brand'] ?? '');
$car_model = trim($data['car_model'] ?? '');
$car_year = intval($data['car_year'] ?? 0);
$message = trim($data['message'] ?? '');
$is_zero_km = boolval($data['is_zero_km'] ?? false);

if (empty($name) || empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Nombre y teléfono son obligatorios']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // 1. Create or update CRM client
    $existingClient = $db->prepare("SELECT id FROM crm_clients WHERE phone = ? LIMIT 1");
    $existingClient->execute([$phone]);
    $clientRow = $existingClient->fetch(PDO::FETCH_ASSOC);

    if ($clientRow) {
        $clientId = $clientRow['id'];
        // Update name/email if provided
        $db->prepare("UPDATE crm_clients SET name = COALESCE(NULLIF(?, ''), name), email = COALESCE(NULLIF(?, ''), email), updated_at = NOW() WHERE id = ?")
           ->execute([$name, $email, $clientId]);
    } else {
        $db->prepare("INSERT INTO crm_clients (name, email, phone, source, stage, created_at) VALUES (?, ?, ?, ?, 'nuevo', NOW())")
           ->execute([$name, $email, $phone, $is_zero_km ? 'web_0km' : 'web_consulta']);
        $clientId = $db->lastInsertId();
    }

    // 2. Add a note about the inquiry
    $vehicleLabel = $car_brand . ' ' . $car_model . ($car_year > 0 ? " $car_year" : '');
    $noteContent = ($is_zero_km ? "🆕 Consulta 0km" : "📋 Consulta de precio") . ": $vehicleLabel";
    if ($message) $noteContent .= "\nMensaje: $message";

    $db->prepare("INSERT INTO crm_notes (client_id, content, created_by, created_at) VALUES (?, ?, 1, NOW())")
       ->execute([$clientId, $noteContent]);

    // 3. Generate Consultation ID
    $consultationId = 'TK-' . strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));
    $formData = json_encode([
        'car_id' => $car_id,
        'car_brand' => $car_brand,
        'car_model' => $car_model,
        'car_year' => $car_year,
        'is_zero_km' => $is_zero_km,
        'message' => $message,
        'email' => $email,
    ], JSON_UNESCAPED_UNICODE);

    $db->prepare("INSERT INTO crm_consultations (id, client_id, form_type, form_data, car_id) VALUES (?, ?, 'precio', ?, ?)")
       ->execute([$consultationId, $clientId, $formData, $car_id ?: null]);

    // 4. Send proactive message via Chatwoot (bot reaches out first)
    $waResult = null;
    try {
        include_once __DIR__ . '/chatwoot_api.php';
        $waConfig = include __DIR__ . '/../config/whatsapp_config.php';
        $chatwoot = new ChatwootAPI($waConfig['chatwoot']);
        
        $firstName = explode(' ', trim($name))[0];
        $waMsg = "¡Hola {$firstName}! 🚗 Soy Daniel de *TAKEOFF AUTO*.\n\nRecibí tu consulta sobre el *{$vehicleLabel}* (Ref: *{$consultationId}*).\n\n";
        
        if ($is_zero_km) {
            $waMsg .= "Excelente elección en 0km. Te paso la mejor cotización y las opciones de financiación disponibles.\n\n¿Cuándo podrías acercarte a verlo? 📍 Estamos en Av. Fuerza Aérea 3850";
        } else {
            $waMsg .= "¡Muy buen vehículo! Te cuento todo sobre precio, financiación y la posibilidad de entregar tu usado.\n\n¿Tenés alguna duda puntual?";
        }
        
        $waResult = $chatwoot->sendProactiveMessage($phone, $name, $waMsg, $email);
    } catch (Exception $waErr) {
        error_log("WhatsApp proactive message failed: " . $waErr->getMessage());
    }

    // Legacy WhatsApp link (fallback if Chatwoot is not configured)
    $legacyWaMessage = "🚗 *Consulta de precio - {$vehicleLabel}*\n\n👤 $name\n(Ref: $consultationId)";
    $waLink = "https://wa.me/5493516752879?text=" . urlencode($legacyWaMessage);

    echo json_encode([
        'success' => true,
        'message' => 'Consulta registrada exitosamente',
        'client_id' => $clientId,
        'consultation_id' => $consultationId,
        'whatsapp_link' => $waLink,
        'bot_sent' => !empty($waResult['success'])
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno: ' . $e->getMessage()]);
}
?>
