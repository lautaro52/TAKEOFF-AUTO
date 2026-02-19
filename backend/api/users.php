<?php
/**
 * Users API
 * Handles user authentication and management endpoints
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once '../classes/User.php';
require_once '../classes/Session.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);
$session = new Session($db);

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

/**
 * Helper function to get authorization token from headers
 */
function getBearerToken() {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $matches = [];
        if (preg_match('/Bearer\s+(.*)$/i', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return null;
}

/**
 * Helper function to validate session and get user
 */
function validateSession($session) {
    $token = getBearerToken();
    if (!$token) {
        return false;
    }
    return $session->validate($token);
}

try {
    switch ($method) {
        case 'POST':
            $data = json_decode(file_get_contents("php://input"));

            if ($action === 'login') {
                // LOGIN
                if (empty($data->email) || empty($data->password)) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false,
                        "message" => "Email and password are required"
                    ]);
                    break;
                }

                $authenticatedUser = $user->authenticate($data->email, $data->password);

                if ($authenticatedUser) {
                    // Create session
                    $ip_address = $_SERVER['REMOTE_ADDR'] ?? null;
                    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;
                    $session_token = $session->create($authenticatedUser['id'], $ip_address, $user_agent);

                    if ($session_token) {
                        http_response_code(200);
                        echo json_encode([
                            "success" => true,
                            "message" => "Login successful",
                            "data" => [
                                "user" => $authenticatedUser,
                                "session_token" => $session_token
                            ]
                        ]);
                    } else {
                        http_response_code(500);
                        echo json_encode([
                            "success" => false,
                            "message" => "Failed to create session"
                        ]);
                    }
                } else {
                    http_response_code(401);
                    echo json_encode([
                        "success" => false,
                        "message" => "Invalid credentials"
                    ]);
                }

            } elseif ($action === 'register') {
                // REGISTER
                if (empty($data->full_name) || empty($data->password) || empty($data->role)) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false,
                        "message" => "Full name, password, and role are required"
                    ]);
                    break;
                }

                $userData = [
                    'full_name' => $data->full_name,
                    'email' => $data->email ?? null,
                    'phone' => $data->phone ?? null,
                    'password' => $data->password,
                    'role' => $data->role,
                    'avatar_url' => $data->avatar_url ?? null,
                    'permissions' => $data->permissions ?? null
                ];

                $user_id = $user->create($userData);

                if ($user_id) {
                    $newUser = $user->getById($user_id);
                    http_response_code(201);
                    echo json_encode([
                        "success" => true,
                        "message" => "User created successfully",
                        "data" => [
                            "user" => $newUser
                        ]
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        "success" => false,
                        "message" => "Failed to create user"
                    ]);
                }

            } elseif ($action === 'logout') {
                // LOGOUT
                $token = getBearerToken();
                if ($token) {
                    $session->destroy($token);
                }

                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Logged out successfully"
                ]);

            } elseif ($action === 'change-password') {
                // CHANGE PASSWORD
                $user_id = validateSession($session);
                if (!$user_id) {
                    http_response_code(401);
                    echo json_encode([
                        "success" => false,
                        "message" => "Unauthorized"
                    ]);
                    break;
                }

                if (empty($data->new_password)) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false,
                        "message" => "New password is required"
                    ]);
                    break;
                }

                if ($user->updatePassword($user_id, $data->new_password)) {
                    http_response_code(200);
                    echo json_encode([
                        "success" => true,
                        "message" => "Password updated successfully"
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        "success" => false,
                        "message" => "Failed to update password"
                    ]);
                }

            } else {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Invalid action"
                ]);
            }
            break;

        case 'GET':
            if ($action === 'me') {
                // GET CURRENT USER
                $user_id = validateSession($session);
                if (!$user_id) {
                    http_response_code(401);
                    echo json_encode([
                        "success" => false,
                        "message" => "Unauthorized"
                    ]);
                    break;
                }

                $userData = $user->getById($user_id);
                if ($userData) {
                    http_response_code(200);
                    echo json_encode([
                        "success" => true,
                        "data" => [
                            "user" => $userData
                        ]
                    ]);
                } else {
                    http_response_code(404);
                    echo json_encode([
                        "success" => false,
                        "message" => "User not found"
                    ]);
                }

            } elseif (isset($_GET['id'])) {
                // GET USER BY ID
                $user_id = validateSession($session);
                if (!$user_id) {
                    http_response_code(401);
                    echo json_encode([
                        "success" => false,
                        "message" => "Unauthorized"
                    ]);
                    break;
                }

                $userData = $user->getById($_GET['id']);
                if ($userData) {
                    http_response_code(200);
                    echo json_encode([
                        "success" => true,
                        "data" => $userData
                    ]);
                } else {
                    http_response_code(404);
                    echo json_encode([
                        "success" => false,
                        "message" => "User not found"
                    ]);
                }

            } else {
                // GET ALL USERS (admin only)
                $user_id = validateSession($session);
                if (!$user_id) {
                    http_response_code(401);
                    echo json_encode([
                        "success" => false,
                        "message" => "Unauthorized"
                    ]);
                    break;
                }

                // Check if user is admin
                $currentUser = $user->getById($user_id);
                if ($currentUser['role'] !== 'admin') {
                    http_response_code(403);
                    echo json_encode([
                        "success" => false,
                        "message" => "Forbidden - Admin access required"
                    ]);
                    break;
                }

                $users = $user->getAll();
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $users
                ]);
            }
            break;

        case 'PUT':
            // UPDATE USER
            $user_id = validateSession($session);
            if (!$user_id) {
                http_response_code(401);
                echo json_encode([
                    "success" => false,
                    "message" => "Unauthorized"
                ]);
                break;
            }

            $data = json_decode(file_get_contents("php://input"));
            $target_user_id = isset($_GET['id']) ? $_GET['id'] : $user_id;

            // Users can only update themselves unless they're admin
            $currentUser = $user->getById($user_id);
            if ($target_user_id != $user_id && $currentUser['role'] !== 'admin') {
                http_response_code(403);
                echo json_encode([
                    "success" => false,
                    "message" => "Forbidden"
                ]);
                break;
            }

            $updateData = [
                'full_name' => $data->full_name,
                'email' => $data->email ?? null,
                'phone' => $data->phone ?? null,
                'avatar_url' => $data->avatar_url ?? null,
                'role' => $data->role,
                'permissions' => $data->permissions ?? null,
                'is_active' => $data->is_active ?? true
            ];

            if ($user->update($target_user_id, $updateData)) {
                $updatedUser = $user->getById($target_user_id);
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "User updated successfully",
                    "data" => $updatedUser
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to update user"
                ]);
            }
            break;

        case 'DELETE':
            // DELETE USER (admin only)
            $user_id = validateSession($session);
            if (!$user_id) {
                http_response_code(401);
                echo json_encode([
                    "success" => false,
                    "message" => "Unauthorized"
                ]);
                break;
            }

            $currentUser = $user->getById($user_id);
            if ($currentUser['role'] !== 'admin') {
                http_response_code(403);
                echo json_encode([
                    "success" => false,
                    "message" => "Forbidden - Admin access required"
                ]);
                break;
            }

            $target_user_id = $_GET['id'] ?? null;
            if (!$target_user_id) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "User ID is required"
                ]);
                break;
            }

            if ($user->delete($target_user_id)) {
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "User deleted successfully"
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to delete user"
                ]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode([
                "success" => false,
                "message" => "Method not allowed"
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}
?>
