<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
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
        $pending = $_GET['pending'] ?? null;

        $sql = "SELECT t.*, a.full_name as admin_name FROM crm_tasks t LEFT JOIN admin_users a ON t.admin_id = a.id WHERE 1=1";
        $params = [];

        if ($clientId) { $sql .= " AND t.client_id = ?"; $params[] = $clientId; }
        if ($pending !== null) { $sql .= " AND t.completed = 0"; }

        $sql .= " ORDER BY t.due_date ASC, t.created_at DESC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        break;

    case 'POST':
        if (empty($input['client_id']) || empty($input['description'])) {
            echo json_encode(["success" => false, "message" => "client_id y description requeridos"]);
            exit();
        }
        try {
            $stmt = $db->prepare("INSERT INTO crm_tasks (client_id, admin_id, description, due_date) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $input['client_id'],
                $admin['id'],
                $input['description'],
                $input['due_date'] ?? null
            ]);

            $db->prepare("INSERT INTO crm_activity_log (client_id, admin_id, action, detail) VALUES (?, ?, 'task_created', ?)")
               ->execute([$input['client_id'], $admin['id'], substr($input['description'], 0, 100)]);

            echo json_encode(["success" => true, "id" => $db->lastInsertId()]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    case 'PUT':
        if (empty($input['id'])) {
            echo json_encode(["success" => false, "message" => "ID requerido"]);
            exit();
        }
        try {
            $db->prepare("UPDATE crm_tasks SET completed = 1, completed_at = NOW(), result_note = ? WHERE id = ?")
               ->execute([$input['result_note'] ?? null, $input['id']]);

            // Get client_id for logging
            $task = $db->prepare("SELECT client_id FROM crm_tasks WHERE id = ?");
            $task->execute([$input['id']]);
            $clientId = $task->fetchColumn();

            $db->prepare("INSERT INTO crm_activity_log (client_id, admin_id, action, detail) VALUES (?, ?, 'task_completed', ?)")
               ->execute([$clientId, $admin['id'], $input['result_note'] ?? 'Tarea completada']);

            echo json_encode(["success" => true]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;
}
?>
