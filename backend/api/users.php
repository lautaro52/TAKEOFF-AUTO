<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $mode = $data->mode ?? 'register';

    if ($mode === 'login') {
        if (!empty($data->email)) {
            try {
                // If DNI is provided, use both for verification. If not, just email.
                if (!empty($data->dni)) {
                    $query = "SELECT id, email, whatsapp, dni, full_name FROM users WHERE email = ? AND dni = ? LIMIT 1";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$data->email, $data->dni]);
                } else {
                    $query = "SELECT id, email, whatsapp, dni, full_name FROM users WHERE email = ? LIMIT 1";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$data->email]);
                }

                if ($stmt->rowCount() > 0) {
                    $user = $stmt->fetch(PDO::FETCH_ASSOC);
                    echo json_encode([
                        "success" => true,
                        "message" => "Login successful",
                        "user" => $user
                    ]);
                } else {
                    $message = !empty($data->dni) ? "Credenciales inválidas. Verifique su Email y DNI." : "Email no encontrado. Si eres nuevo, por favor regístrate.";
                    echo json_encode(["success" => false, "message" => $message]);
                }
            } catch (PDOException $e) {
                echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "El email es requerido para iniciar sesión."]);
        }
    } else {
        // Registration mode
        if (!empty($data->email) && !empty($data->whatsapp) && !empty($data->dni)) {
            try {
                // Check if user exists
                $query = "SELECT id, email, whatsapp, dni, full_name FROM users WHERE email = ? OR dni = ? LIMIT 1";
                $stmt = $db->prepare($query);
                $stmt->execute([$data->email, $data->dni]);

                if ($stmt->rowCount() > 0) {
                    $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($existingUser['email'] === $data->email) {
                        echo json_encode(["success" => false, "message" => "Este correo ya está registrado. Por favor, inicie sesión."]);
                    } else {
                        echo json_encode(["success" => false, "message" => "Este DNI ya está registrado."]);
                    }
                } else {
                    // Create user
                    $query = "INSERT INTO users (email, whatsapp, dni, full_name) VALUES (?, ?, ?, ?)";
                    $stmt = $db->prepare($query);

                    $fullName = $data->full_name ?? $data->displayName ?? null;

                    if ($stmt->execute([$data->email, $data->whatsapp, $data->dni, $fullName])) {
                        $user_id = $db->lastInsertId();
                        echo json_encode([
                            "success" => true,
                            "message" => "Registration successful",
                            "user" => [
                                "id" => $user_id,
                                "email" => $data->email,
                                "whatsapp" => $data->whatsapp,
                                "dni" => $data->dni,
                                "full_name" => $fullName
                            ]
                        ]);
                    } else {
                        echo json_encode(["success" => false, "message" => "Unable to register user"]);
                    }
                }
            } catch (PDOException $e) {
                echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Incomplete data for registration"]);
        }
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
?>