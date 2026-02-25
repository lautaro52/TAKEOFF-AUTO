<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once __DIR__ . '/../config/database.php';
include_once __DIR__ . '/../classes/Lead.php';

$database = new Database();
$db = $database->getConnection();
$lead = new Lead($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->client_name) && !empty($data->client_whatsapp)) {
            // 1. Create legacy lead (for partners)
            $lead->partner_id = $data->partner_id ?? null;
            $lead->car_id = $data->car_id ?? null;
            $lead->client_name = $data->client_name;
            $lead->client_whatsapp = $data->client_whatsapp;
            $lead->note = $data->note ?? '';
            $id = $lead->create();

            // 2. Mirror to CRM (crm_clients) — find existing or create new
            $crmClientId = null;
            $consultationId = null;
            try {
                $phone = preg_replace('/\D/', '', $data->client_whatsapp);
                
                // Check for existing client by phone
                $existingStmt = $db->prepare("SELECT id FROM crm_clients WHERE phone LIKE ? LIMIT 1");
                $existingStmt->execute(['%' . substr($phone, -8) . '%']);
                $existingClient = $existingStmt->fetch(PDO::FETCH_ASSOC);

                if ($existingClient) {
                    $crmClientId = $existingClient['id'];
                    // Update name if we have a better one
                    $db->prepare("UPDATE crm_clients SET full_name = COALESCE(NULLIF(?, ''), full_name), updated_at = NOW() WHERE id = ?")
                       ->execute([$data->client_name, $crmClientId]);
                } else {
                    $source = isset($data->partner_id) ? 'partner' : 'web';
                    $stmtCrm = $db->prepare("INSERT INTO crm_clients (full_name, phone, car_id, source) VALUES (?, ?, ?, ?)");
                    $stmtCrm->execute([
                        $data->client_name,
                        $data->client_whatsapp,
                        $data->car_id ?? null,
                        $source
                    ]);
                    $crmClientId = $db->lastInsertId();
                }

                // If there's a note, add it to crm_notes
                if (!empty($data->note)) {
                    $stmtNote = $db->prepare("INSERT INTO crm_notes (client_id, content) VALUES (?, ?)");
                    $stmtNote->execute([$crmClientId, $data->note]);
                }

                // 3. Generate Consultation ID and track it
                $consultationId = 'TK-' . strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));
                $note = $data->note ?? '';
                
                // Detect form type from the note content
                $formType = 'manual';
                if (stripos($note, 'financiación') !== false || stripos($note, 'crédito') !== false) {
                    $formType = 'credito';
                } elseif (stripos($note, 'COTIZACIÓN USADO') !== false) {
                    $formType = 'cotizacion_usado';
                } elseif (stripos($note, 'CONTACTO ASESOR') !== false) {
                    $formType = 'asesor';
                } elseif (stripos($note, 'Consulta de precio') !== false) {
                    $formType = 'precio';
                }
                
                $formData = json_encode([
                    'note' => $note,
                    'car_id' => $data->car_id ?? null,
                    'partner_id' => $data->partner_id ?? null,
                ], JSON_UNESCAPED_UNICODE);

                $db->prepare("INSERT INTO crm_consultations (id, client_id, form_type, form_data, car_id) VALUES (?, ?, ?, ?, ?)")
                   ->execute([$consultationId, $crmClientId, $formType, $formData, $data->car_id ?? null]);

                // 4. Send proactive WhatsApp message via Chatwoot
                try {
                    include_once __DIR__ . '/chatwoot_api.php';
                    $waConfig = include __DIR__ . '/../config/whatsapp_config.php';
                    $chatwoot = new ChatwootAPI($waConfig['chatwoot']);

                    // Build the initial message based on form type
                    $clientFirstName = explode(' ', trim($data->client_name))[0];
                    $waMessage = "";
                    
                    switch ($formType) {
                        case 'credito':
                            $waMessage = "¡Hola {$clientFirstName}! 🚗 Soy Daniel de *TAKEOFF AUTO*.\n\nRecibí tu consulta de financiación (Ref: *{$consultationId}*).\n\n¿Sobre qué vehículo querés que te arme el plan de cuotas? Si ya tenés uno en mente, pasame el modelo y charlamos 💪";
                            break;
                        case 'cotizacion_usado':
                            $waMessage = "¡Hola {$clientFirstName}! 🚗 Soy Daniel de *TAKEOFF AUTO*.\n\nRecibí tu formulario de cotización (Ref: *{$consultationId}*). Vi los datos de tu vehículo.\n\n¿Querés que te cuente cómo funciona la entrega de tu usado? Estamos en Av. Fuerza Aérea 3850 📍";
                            break;
                        case 'asesor':
                            $waMessage = "¡Hola {$clientFirstName}! 👋 Soy Daniel de *TAKEOFF AUTO*.\n\nRecibí tu consulta (Ref: *{$consultationId}*). Estoy acá para ayudarte.\n\n¿En qué puedo asesorarte?";
                            break;
                        case 'precio':
                            $waMessage = "¡Hola {$clientFirstName}! 🚗 Soy Daniel de *TAKEOFF AUTO*.\n\nRecibí tu consulta de precio (Ref: *{$consultationId}*).\n\n¡Te paso todos los detalles del vehículo que te interesó! ¿Tenés alguna duda puntual?";
                            break;
                        default:
                            $waMessage = "¡Hola {$clientFirstName}! 👋 Soy Daniel de *TAKEOFF AUTO*.\n\nRecibí tu consulta (Ref: *{$consultationId}*). Estoy acá para ayudarte a encontrar el auto ideal.\n\n¿Qué tipo de vehículo estás buscando?";
                    }
                    
                    $chatwoot->sendProactiveMessage($data->client_whatsapp, $data->client_name, $waMessage);
                } catch (Exception $waError) {
                    error_log("WhatsApp proactive message failed: " . $waError->getMessage());
                    // Don't fail the lead creation
                }
            } catch (Exception $e) {
                error_log("CRM Mirroring failed: " . $e->getMessage());
            }

            if ($id) {
                echo json_encode([
                    "success" => true, 
                    "id" => $id, 
                    "crm_id" => $crmClientId ?? null,
                    "consultation_id" => $consultationId
                ]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to create lead"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Incomplete data"]);
        }
        break;

    case 'GET':
        if (isset($_GET['partner_id'])) {
            $stmt = $lead->readByPartner($_GET['partner_id']);
            $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["success" => true, "data" => $leads]);
        } else {
            $stmt = $lead->readAll();
            $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["success" => true, "data" => $leads]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->id) && !empty($data->status)) {
            if ($lead->updateStatus($data->id, $data->status, $data->caida_reason ?? null)) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false]);
            }
        }
        break;
}
?>