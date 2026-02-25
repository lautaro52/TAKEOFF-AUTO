<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

function verifyToken($t) {
    if (!$t) return null;
    $d = json_decode(base64_decode($t), true);
    return ($d && isset($d['exp']) && $d['exp'] > time()) ? $d : null;
}

$method = $_SERVER['REQUEST_METHOD'];
$token = $_GET['token'] ?? '';
$input = ($method !== 'GET') ? json_decode(file_get_contents("php://input"), true) : [];
if (!$token && isset($input['token'])) $token = $input['token'];

$admin = verifyToken($token);
if (!$admin) { http_response_code(401); echo json_encode(["success" => false, "message" => "No autorizado"]); exit(); }

switch ($method) {
    case 'GET':
        $clientId = $_GET['client_id'] ?? null;
        if (!$clientId) { echo json_encode(["success" => false, "message" => "client_id requerido"]); exit(); }

        $stmt = $db->prepare("SELECT n.*, a.full_name as admin_name FROM crm_notes n LEFT JOIN admin_users a ON n.admin_id = a.id WHERE n.client_id = ? ORDER BY n.created_at DESC");
        $stmt->execute([$clientId]);
        echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        break;

    case 'POST':
        if (empty($input['client_id']) || empty($input['content'])) {
            echo json_encode(["success" => false, "message" => "client_id y content requeridos"]);
            exit();
        }
        try {
            $stmt = $db->prepare("INSERT INTO crm_notes (client_id, admin_id, content) VALUES (?, ?, ?)");
            $stmt->execute([$input['client_id'], $admin['id'], $input['content']]);

            // Log activity
            $db->prepare("INSERT INTO crm_activity_log (client_id, admin_id, action, detail) VALUES (?, ?, 'note_added', ?)")
               ->execute([$input['client_id'], $admin['id'], substr($input['content'], 0, 100)]);

            // Touch client updated_at
            $db->prepare("UPDATE crm_clients SET updated_at = NOW() WHERE id = ?")->execute([$input['client_id']]);

            echo json_encode(["success" => true, "id" => $db->lastInsertId()]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;
}
?>
