<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Helper: verify admin token
function verifyToken($tokenStr) {
    if (!$tokenStr) return null;
    $decoded = json_decode(base64_decode($tokenStr), true);
    if ($decoded && isset($decoded['exp']) && $decoded['exp'] > time()) {
        return $decoded;
    }
    return null;
}

$method = $_SERVER['REQUEST_METHOD'];
$token = $_GET['token'] ?? '';
if (!$token && $method !== 'GET') {
    $input = json_decode(file_get_contents("php://input"), true);
    $token = $input['token'] ?? '';
} else if ($method === 'GET') {
    // token from query
} else {
    $input = json_decode(file_get_contents("php://input"), true);
    $token = $input['token'] ?? $token;
}

// Re-read input for non-GET
if ($method !== 'GET') {
    // input already read above
} else {
    $input = [];
}

$admin = verifyToken($token);
if (!$admin) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "No autorizado"]);
    exit();
}

switch ($method) {
    // ─── LIST CLIENTS ───
    case 'GET':
        $stage = $_GET['stage'] ?? null;
        $search = $_GET['search'] ?? null;

        $sql = "SELECT c.*, 
                CONCAT(car.brand, ' ', car.model, ' ', car.year) as car_name,
                (SELECT content FROM crm_notes WHERE client_id = c.id ORDER BY created_at DESC LIMIT 1) as last_note,
                (SELECT COUNT(*) FROM crm_notes WHERE client_id = c.id) as notes_count,
                (SELECT COUNT(*) FROM crm_tasks WHERE client_id = c.id AND completed = 0) as pending_tasks
                FROM crm_clients c
                LEFT JOIN cars car ON c.car_id = car.id
                WHERE 1=1";
        $params = [];

        if ($stage) {
            $sql .= " AND c.stage = ?";
            $params[] = $stage;
        }
        if ($search) {
            $sql .= " AND (c.full_name LIKE ? OR c.phone LIKE ? OR c.email LIKE ?)";
            $searchParam = "%$search%";
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
        }
        $sql .= " ORDER BY c.updated_at DESC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "data" => $clients]);
        break;

    // ─── CREATE CLIENT ───
    case 'POST':
        if (empty($input['full_name'])) {
            echo json_encode(["success" => false, "message" => "Nombre requerido"]);
            exit();
        }
        try {
            $stmt = $db->prepare("INSERT INTO crm_clients (full_name, phone, email, dni, stage, source, car_id, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['full_name'],
                $input['phone'] ?? null,
                $input['email'] ?? null,
                $input['dni'] ?? null,
                $input['stage'] ?? 'sin_gestionar',
                $input['source'] ?? 'manual',
                $input['car_id'] ?? null,
                $admin['id']
            ]);
            $clientId = $db->lastInsertId();

            // Log activity
            $db->prepare("INSERT INTO crm_activity_log (client_id, admin_id, action, to_stage) VALUES (?, ?, 'created', ?)")
               ->execute([$clientId, $admin['id'], $input['stage'] ?? 'sin_gestionar']);

            echo json_encode(["success" => true, "id" => $clientId]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    // ─── UPDATE CLIENT ───
    case 'PUT':
        if (empty($input['id'])) {
            echo json_encode(["success" => false, "message" => "ID requerido"]);
            exit();
        }
        try {
            // Get current stage for logging
            $current = $db->prepare("SELECT stage FROM crm_clients WHERE id = ?");
            $current->execute([$input['id']]);
            $oldStage = $current->fetchColumn();

            $fields = [];
            $params = [];
            foreach (['full_name', 'phone', 'email', 'dni', 'stage', 'car_id', 'source'] as $field) {
                if (isset($input[$field])) {
                    $fields[] = "$field = ?";
                    $params[] = $input[$field];
                }
            }
            if (empty($fields)) {
                echo json_encode(["success" => false, "message" => "Nada que actualizar"]);
                exit();
            }

            $params[] = $input['id'];
            $db->prepare("UPDATE crm_clients SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);

            // Log stage change
            if (isset($input['stage']) && $input['stage'] !== $oldStage) {
                $db->prepare("INSERT INTO crm_activity_log (client_id, admin_id, action, from_stage, to_stage, detail) VALUES (?, ?, 'stage_change', ?, ?, ?)")
                   ->execute([$input['id'], $admin['id'], $oldStage, $input['stage'], $input['detail'] ?? null]);

                // If venta_realizada, create sale record
                if ($input['stage'] === 'venta_realizada') {
                    $carData = $db->prepare("SELECT car_id FROM crm_clients WHERE id = ?");
                    $carData->execute([$input['id']]);
                    $carId = $carData->fetchColumn();
                    $db->prepare("INSERT INTO crm_sales (client_id, car_id, amount, sale_date) VALUES (?, ?, ?, CURDATE())")
                       ->execute([$input['id'], $carId, $input['amount'] ?? 0]);
                }
            }

            echo json_encode(["success" => true]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    // ─── DELETE (soft) ───
    case 'DELETE':
        if (empty($input['id'])) {
            echo json_encode(["success" => false, "message" => "ID requerido"]);
            exit();
        }
        try {
            $db->prepare("UPDATE crm_clients SET stage = 'dado_de_baja' WHERE id = ?")->execute([$input['id']]);
            $db->prepare("INSERT INTO crm_activity_log (client_id, admin_id, action, to_stage, detail) VALUES (?, ?, 'dado_de_baja', 'dado_de_baja', ?)")
               ->execute([$input['id'], $admin['id'], $input['reason'] ?? null]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;
}
?>
