<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$action = $data->action ?? 'login';

// ─── LOGIN ───
if ($action === 'login') {
    if (empty($data->email) || empty($data->password)) {
        echo json_encode(["success" => false, "message" => "Email y contraseña requeridos"]);
        exit();
    }
    try {
        $stmt = $db->prepare("SELECT id, email, password_hash, full_name, role FROM admin_users WHERE email = ? AND active = 1 LIMIT 1");
        $stmt->execute([$data->email]);
        if ($stmt->rowCount() > 0) {
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($data->password, $admin['password_hash'])) {
                $token = base64_encode(json_encode([
                    'id' => $admin['id'],
                    'email' => $admin['email'],
                    'role' => $admin['role'],
                    'exp' => time() + 86400
                ]));
                echo json_encode([
                    "success" => true,
                    "token" => $token,
                    "admin" => [
                        "id" => $admin['id'],
                        "email" => $admin['email'],
                        "full_name" => $admin['full_name'],
                        "role" => $admin['role']
                    ]
                ]);
            } else {
                echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Admin no encontrado"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
    exit();
}

// ─── VERIFY TOKEN ───
if ($action === 'verify') {
    $token = $data->token ?? '';
    $decoded = json_decode(base64_decode($token), true);
    if ($decoded && isset($decoded['exp']) && $decoded['exp'] > time()) {
        echo json_encode(["success" => true, "admin" => $decoded]);
    } else {
        echo json_encode(["success" => false, "message" => "Token inválido o expirado"]);
    }
    exit();
}

echo json_encode(["success" => false, "message" => "Acción no válida"]);
?>
