<?php
/**
 * Retargeting Cron Job
 * Run this script every hour to handle automated follow-ups.
 * 
 * Setup on Hostinger:
 *   hPanel → Advanced → Cron Jobs → Add New
 *   Command: php /home/USERNAME/public_html/takeoffauto-api/cron/retargeting_cron.php
 *   Interval: Every hour (0 * * * *)
 * 
 * Alternative: Call via HTTP (set up a cron on any service to hit this URL every hour):
 *   https://takeoffauto.online/takeoffauto-api/cron/retargeting_cron.php?key=YOUR_SECRET_KEY
 */

// Allow CLI or HTTP with secret key
$isCliAllowed = php_sapi_name() === 'cli';
$isHttpAllowed = ($_GET['key'] ?? '') === 'tk_retarget_2024_secure';

if (!$isCliAllowed && !$isHttpAllowed) {
    http_response_code(403);
    echo "Forbidden";
    exit();
}

header('Content-Type: application/json; charset=UTF-8');

include_once __DIR__ . '/../config/database.php';
include_once __DIR__ . '/../api/chatwoot_api.php';

$config = include __DIR__ . '/../config/whatsapp_config.php';
$database = new Database();
$db = $database->getConnection();
$chatwoot = new ChatwootAPI($config['chatwoot']);

$timers = $config['retargeting'];
$now = time();
$processed = ['followup_1h' => 0, 'persuasive_23h' => 0, 'dropped_24h' => 0];

// ─── Get all active conversations with timing info ───
$stmt = $db->query("
    SELECT wc.*, 
           c.full_name, c.phone, c.stage,
           TIMESTAMPDIFF(SECOND, wc.last_client_message_at, NOW()) as seconds_since_client,
           TIMESTAMPDIFF(SECOND, wc.last_bot_message_at, NOW()) as seconds_since_bot
    FROM wa_conversations wc
    JOIN crm_clients c ON c.id = wc.client_id
    WHERE wc.status = 'active'
      AND wc.last_client_message_at IS NOT NULL
      AND wc.chatwoot_conversation_id IS NOT NULL
    ORDER BY wc.last_client_message_at ASC
");

$conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($conversations as $convo) {
    $secsSinceClient = (int)$convo['seconds_since_client'];
    $convoId = $convo['id'];
    $cwConvoId = $convo['chatwoot_conversation_id'];
    $clientName = $convo['full_name'];
    $clientId = $convo['client_id'];

    // ─── 1. Follow-up at 1 hour ─────────────────────
    if ($secsSinceClient >= $timers['followup_1h'] 
        && $secsSinceClient < $timers['persuasive_23h'] 
        && !$convo['retarget_1h_sent']) {
        
        $msg = "¡Hola {$clientName}! 👋 Vi que estábamos conversando sobre opciones para vos. ¿Seguís interesado? Estoy acá para ayudarte con lo que necesites 🙌";
        
        $chatwoot->sendMessage($cwConvoId, $msg);
        
        $db->prepare("UPDATE wa_conversations SET retarget_1h_sent = 1, last_bot_message_at = NOW() WHERE id = ?")
           ->execute([$convoId]);
        
        $db->prepare("INSERT INTO wa_messages (conversation_id, role, content) VALUES (?, 'bot', ?)")
           ->execute([$convoId, $msg]);

        $processed['followup_1h']++;
        continue;
    }

    // ─── 2. Persuasive recap at 23 hours ────────────
    if ($secsSinceClient >= $timers['persuasive_23h']
        && $secsSinceClient < $timers['drop_24h']
        && !$convo['retarget_23h_sent']) {
        
        // Build a persuasive message based on the client's consultation
        $msg = buildPersuasiveMessage($db, $convo);
        
        $chatwoot->sendMessage($cwConvoId, $msg);
        
        $db->prepare("UPDATE wa_conversations SET retarget_23h_sent = 1, last_bot_message_at = NOW() WHERE id = ?")
           ->execute([$convoId]);

        $db->prepare("INSERT INTO wa_messages (conversation_id, role, content) VALUES (?, 'bot', ?)")
           ->execute([$convoId, $msg]);
        
        $processed['persuasive_23h']++;
        continue;
    }

    // ─── 3. Drop at 24 hours ────────────────────────
    if ($secsSinceClient >= $timers['drop_24h'] && $convo['retarget_23h_sent']) {
        // Check if last message was from the bot (retarget) — client didn't respond
        $lastMsg = $db->prepare("SELECT role FROM wa_messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1");
        $lastMsg->execute([$convoId]);
        $lastRole = $lastMsg->fetchColumn();
        
        if ($lastRole === 'bot') {
            // Drop the lead
            $db->prepare("UPDATE wa_conversations SET status = 'dropped' WHERE id = ?")
               ->execute([$convoId]);
            
            $db->prepare("UPDATE crm_clients SET stage = 'baja' WHERE id = ?")
               ->execute([$clientId]);
            
            $db->prepare("INSERT INTO crm_notes (client_id, content) VALUES (?, ?)")
               ->execute([$clientId, "🤖 Baja automática: sin respuesta del cliente en 24hs. Almacenado para futuras campañas de reactivación."]);

            $db->prepare("INSERT INTO wa_messages (conversation_id, role, content) VALUES (?, 'system', ?)")
               ->execute([$convoId, "Sistema: Lead dado de baja por inactividad (24h sin respuesta)."]);
            
            $processed['dropped_24h']++;
        }
    }
}

/**
 * Build a persuasive message with the specific car/credit the client was interested in.
 */
function buildPersuasiveMessage(PDO $db, array $convo): string {
    $clientName = $convo['full_name'];
    $consultationId = $convo['active_consultation_id'];
    
    // Try to find what they were interested in
    if ($consultationId) {
        $stmt = $db->prepare("SELECT c.*, car.brand, car.model, car.year, car.price 
                              FROM crm_consultations c 
                              LEFT JOIN cars car ON car.id = c.car_id
                              WHERE c.id = ?");
        $stmt->execute([$consultationId]);
        $consultation = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($consultation && !empty($consultation['brand'])) {
            $carName = "{$consultation['brand']} {$consultation['model']} {$consultation['year']}";
            $price = '$' . number_format($consultation['price'], 0, ',', '.');
            
            return "¡Hola {$clientName}! 🚗\n\nQuería avisarte que el *{$carName}* que consultaste sigue disponible a *{$price}*.\n\nEs una excelente oportunidad y no queremos que te la pierdas. ¿Te gustaría agendar una visita para verlo en persona? Estamos en Av. Fuerza Aérea 3850 📍\n\n¡Quedan pocas unidades!";
        }
    }
    
    // Fallback: check last consultation with car data
    $stmt = $db->prepare("SELECT c.*, car.brand, car.model, car.year, car.price 
                          FROM crm_consultations c 
                          LEFT JOIN cars car ON car.id = c.car_id
                          WHERE c.client_id = ? AND car.id IS NOT NULL
                          ORDER BY c.created_at DESC LIMIT 1");
    $stmt->execute([$convo['client_id']]);
    $lastWithCar = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($lastWithCar && !empty($lastWithCar['brand'])) {
        $carName = "{$lastWithCar['brand']} {$lastWithCar['model']} {$lastWithCar['year']}";
        return "¡Hola {$clientName}! 👋\n\nVi que estuviste interesado en el *{$carName}*. Todavía sigue disponible y tenemos excelentes opciones de financiación. ¿Querés que te arme un plan?\n\nEstamos en Av. Fuerza Aérea 3850, de lunes a sábado de 9 a 18hs 📍";
    }

    // Generic fallback
    return "¡Hola {$clientName}! 🚗\n\nVi que consultaste por nuestro stock de vehículos. ¿Querés que te ayude a encontrar el auto ideal? Tenemos excelentes opciones y planes de financiación.\n\n¡Estoy acá para lo que necesites! 💪";
}

$result = [
    'status' => 'completed',
    'timestamp' => date('Y-m-d H:i:s'),
    'processed' => $processed,
    'total_active_conversations' => count($conversations)
];

echo json_encode($result, JSON_PRETTY_PRINT);

// Log result
$logFile = __DIR__ . '/../logs/retargeting_' . date('Y-m-d') . '.log';
$logDir = dirname($logFile);
if (!is_dir($logDir)) mkdir($logDir, 0755, true);
file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] " . json_encode($result) . "\n", FILE_APPEND);
