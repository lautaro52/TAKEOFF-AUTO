<?php
/**
 * WhatsApp Webhook Receiver
 * Receives events from Chatwoot and routes them to the bot engine.
 * 
 * Configure in Chatwoot: Settings → Integrations → Webhooks
 * URL: https://takeoffauto.online/takeoffauto-api/api/whatsapp_webhook.php
 * Events: message_created
 */

// No CORS needed — this is server-to-server
header('Content-Type: application/json; charset=UTF-8');

// Log everything for debugging
$logFile = __DIR__ . '/../logs/webhook_' . date('Y-m-d') . '.log';
$logDir = dirname($logFile);
if (!is_dir($logDir)) mkdir($logDir, 0755, true);

function wlog($msg) {
    global $logFile;
    $ts = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$ts] $msg\n", FILE_APPEND);
}

// ─── 1. Receive & Validate ───────────────────────────
$rawPayload = file_get_contents('php://input');
$payload = json_decode($rawPayload, true);

if (!$payload) {
    wlog("ERROR: Invalid JSON payload");
    http_response_code(400);
    echo json_encode(['error' => 'Invalid payload']);
    exit();
}

$event = $payload['event'] ?? '';
wlog("Event received: $event");

// Only process incoming messages
if ($event !== 'message_created') {
    echo json_encode(['status' => 'ignored', 'reason' => 'not message_created']);
    exit();
}

$message = $payload['content'] ?? '';
$messageType = $payload['message_type'] ?? '';
$contentType = $payload['content_type'] ?? 'text';
$conversationId = $payload['conversation']['id'] ?? null;
$contactId = $payload['conversation']['contact_id'] ?? ($payload['sender']['id'] ?? null);
$contactPhone = '';
$contactName = '';
$attachments = $payload['attachments'] ?? [];

// Extract contact info
if (!empty($payload['sender'])) {
    $contactPhone = $payload['sender']['phone_number'] ?? '';
    $contactName = $payload['sender']['name'] ?? 'Cliente';
} elseif (!empty($payload['conversation']['meta']['sender'])) {
    $meta = $payload['conversation']['meta']['sender'];
    $contactPhone = $meta['phone_number'] ?? '';
    $contactName = $meta['name'] ?? 'Cliente';
}

// Only process INCOMING messages (from clients, not from our bot)
if ($messageType !== 'incoming') {
    wlog("Skipping non-incoming message (type: $messageType)");
    echo json_encode(['status' => 'ignored', 'reason' => 'outgoing message']);
    exit();
}

// Clean phone number
$contactPhone = preg_replace('/\D/', '', $contactPhone);

wlog("Processing message from $contactName ($contactPhone): " . substr($message, 0, 100));

// ─── 2. Load Dependencies ────────────────────────────
include_once __DIR__ . '/../config/database.php';
include_once __DIR__ . '/chatwoot_api.php';

$config = include __DIR__ . '/../config/whatsapp_config.php';
$database = new Database();
$db = $database->getConnection();
$chatwoot = new ChatwootAPI($config['chatwoot']);

// ─── 3. Identify Client in CRM ───────────────────────

// Try to find client by phone
$clientId = null;
$client = null;

if ($contactPhone) {
    // Try exact match and variations (with/without country code)
    $phoneVariants = [$contactPhone];
    if (strlen($contactPhone) > 10) {
        $phoneVariants[] = substr($contactPhone, -10); // Last 10 digits
    }
    if (strlen($contactPhone) === 10) {
        $phoneVariants[] = '54' . $contactPhone;
        $phoneVariants[] = '549' . $contactPhone;
    }

    $placeholders = implode(',', array_fill(0, count($phoneVariants), '?'));
    $stmt = $db->prepare("SELECT * FROM crm_clients WHERE phone IN ($placeholders) OR phone LIKE ? LIMIT 1");
    $params = $phoneVariants;
    $params[] = '%' . substr($contactPhone, -8) . '%'; // Fuzzy match on last 8 digits
    $stmt->execute($params);
    $client = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($client) {
        $clientId = $client['id'];
        wlog("Found existing CRM client: ID=$clientId, Name={$client['full_name']}");
    }
}

// Check if message contains a Consultation ID (TK-XXXXXX)
$consultationId = null;
if (preg_match('/TK-([A-Z0-9]{6})/i', $message, $matches)) {
    $consultationId = 'TK-' . strtoupper($matches[1]);
    wlog("Consultation ID detected: $consultationId");
    
    // Look up the consultation
    $stmt = $db->prepare("SELECT * FROM crm_consultations WHERE id = ?");
    $stmt->execute([$consultationId]);
    $consultation = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($consultation && !$clientId) {
        $clientId = $consultation['client_id'];
        $stmt = $db->prepare("SELECT * FROM crm_clients WHERE id = ?");
        $stmt->execute([$clientId]);
        $client = $stmt->fetch(PDO::FETCH_ASSOC);
        wlog("Client found via consultation ID: $clientId");
    }
}

// If still no client, create a new one
if (!$clientId) {
    wlog("No existing client found, creating new CRM client");
    $stmt = $db->prepare("INSERT INTO crm_clients (full_name, phone, source, stage) VALUES (?, ?, 'whatsapp_directo', 'sin_gestionar')");
    $stmt->execute([$contactName, $contactPhone]);
    $clientId = $db->lastInsertId();
    
    $stmt = $db->prepare("SELECT * FROM crm_clients WHERE id = ?");
    $stmt->execute([$clientId]);
    $client = $stmt->fetch(PDO::FETCH_ASSOC);
    wlog("Created new client: ID=$clientId");
}

// ─── 4. Find or Create WA Conversation State ─────────
$stmt = $db->prepare("SELECT * FROM wa_conversations WHERE client_id = ? AND status = 'active' ORDER BY updated_at DESC LIMIT 1");
$stmt->execute([$clientId]);
$waConvo = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$waConvo) {
    $stmt = $db->prepare("INSERT INTO wa_conversations (client_id, chatwoot_conversation_id, chatwoot_contact_id, active_consultation_id, last_client_message_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->execute([$clientId, $conversationId, $contactId, $consultationId]);
    $waConvoId = $db->lastInsertId();
    
    $stmt = $db->prepare("SELECT * FROM wa_conversations WHERE id = ?");
    $stmt->execute([$waConvoId]);
    $waConvo = $stmt->fetch(PDO::FETCH_ASSOC);
    wlog("Created new WA conversation state: ID=$waConvoId");
} else {
    $waConvoId = $waConvo['id'];
    // Update conversation tracking
    $updateFields = ['last_client_message_at = NOW()', 'retarget_1h_sent = 0', 'retarget_23h_sent = 0'];
    if ($conversationId && !$waConvo['chatwoot_conversation_id']) {
        $updateFields[] = "chatwoot_conversation_id = $conversationId";
    }
    if ($consultationId) {
        $updateFields[] = "active_consultation_id = " . $db->quote($consultationId);
    }
    $db->prepare("UPDATE wa_conversations SET " . implode(', ', $updateFields) . " WHERE id = ?")->execute([$waConvoId]);
    wlog("Updated existing WA conversation: ID=$waConvoId");
}

// ─── 5. Log the incoming message ─────────────────────
$mediaType = 'text';
$mediaUrl = null;

if (!empty($attachments)) {
    $att = $attachments[0];
    $fileType = $att['file_type'] ?? '';
    if (str_contains($fileType, 'audio') || str_contains($att['data_url'] ?? '', '.ogg')) {
        $mediaType = 'audio';
    } elseif (str_contains($fileType, 'image')) {
        $mediaType = 'image';
    }
    $mediaUrl = $chatwoot->getAttachmentUrl($att);
}

$db->prepare("INSERT INTO wa_messages (conversation_id, role, content, media_type, media_url) VALUES (?, 'client', ?, ?, ?)")
   ->execute([$waConvoId, $message, $mediaType, $mediaUrl]);

// ─── 6. Call the Bot Engine ──────────────────────────
wlog("Calling bot engine...");

include_once __DIR__ . '/whatsapp_bot_engine.php';

try {
    $botEngine = new WhatsAppBotEngine($db, $config, $chatwoot);
    $botReply = $botEngine->processMessage([
        'client_id'        => $clientId,
        'client'           => $client,
        'conversation_id'  => $waConvoId,
        'chatwoot_convo_id' => $conversationId,
        'message'          => $message,
        'media_type'       => $mediaType,
        'media_url'        => $mediaUrl,
        'consultation_id'  => $consultationId,
        'wa_conversation'  => $waConvo,
    ]);

    // 7. Send reply via Chatwoot
    if ($botReply && $conversationId) {
        $chatwoot->sendMessage($conversationId, $botReply);
        
        // Log bot message
        $db->prepare("INSERT INTO wa_messages (conversation_id, role, content) VALUES (?, 'bot', ?)")
           ->execute([$waConvoId, $botReply]);
        
        // Update last bot message time
        $db->prepare("UPDATE wa_conversations SET last_bot_message_at = NOW() WHERE id = ?")
           ->execute([$waConvoId]);

        wlog("Bot replied: " . substr($botReply, 0, 100) . "...");
    }
} catch (Exception $e) {
    wlog("ERROR in bot engine: " . $e->getMessage());
    // Send a fallback message
    if ($conversationId) {
        $chatwoot->sendMessage($conversationId, "¡Hola! Disculpá, tuve un inconveniente técnico. Un asesor humano te va a contactar en breve. 🙏");
    }
}

echo json_encode(['status' => 'processed']);
