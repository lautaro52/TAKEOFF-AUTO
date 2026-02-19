<?php
/**
 * Tasks API
 * Handles task and reminder management endpoints
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
require_once '../classes/Task.php';
require_once '../classes/Session.php';

$database = new Database();
$db = $database->getConnection();

$task = new Task($db);
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
 * Helper function to validate session
 */
function validateSession($session) {
    $token = getBearerToken();
    if (!$token) {
        return false;
    }
    return $session->validate($token);
}

try {
    // Validate authentication for all requests
    $user_id = validateSession($session);
    if (!$user_id) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Unauthorized - Please login"
        ]);
        exit();
    }

    switch ($method) {
        case 'GET':
            if ($action === 'overdue') {
                // GET OVERDUE TASKS
                $assigned_to = isset($_GET['assigned_to']) ? $_GET['assigned_to'] : $user_id;
                $tasks = $task->getOverdue($assigned_to);
                
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $tasks
                ]);

            } elseif ($action === 'upcoming') {
                // GET UPCOMING TASKS
                $assigned_to = isset($_GET['assigned_to']) ? $_GET['assigned_to'] : $user_id;
                $days = isset($_GET['days']) ? (int)$_GET['days'] : 7;
                $tasks = $task->getUpcoming($assigned_to, $days);
                
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $tasks
                ]);

            } elseif (isset($_GET['assigned_to'])) {
                // GET TASKS BY ASSIGNED USER
                $status = isset($_GET['status']) ? $_GET['status'] : 'pending';
                $tasks = $task->getByAssignedUser($_GET['assigned_to'], $status);
                
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $tasks
                ]);

            } else {
                // GET ALL TASKS WITH FILTERS
                $filters = [];
                
                if (isset($_GET['status'])) {
                    $filters['status'] = $_GET['status'];
                }
                if (isset($_GET['priority'])) {
                    $filters['priority'] = $_GET['priority'];
                }
                if (isset($_GET['customer_id'])) {
                    $filters['customer_id'] = $_GET['customer_id'];
                }

                $tasks = $task->getAll($filters);
                
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $tasks
                ]);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"));

            if ($action === 'complete') {
                // COMPLETE TASK
                if (empty($_GET['id'])) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false,
                        "message" => "Task ID is required"
                    ]);
                    break;
                }

                if ($task->complete($_GET['id'])) {
                    http_response_code(200);
                    echo json_encode([
                        "success" => true,
                        "message" => "Task marked as complete"
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        "success" => false,
                        "message" => "Failed to complete task"
                    ]);
                }

            } else {
                // CREATE TASK
                if (empty($data->title) || empty($data->due_date)) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false,
                        "message" => "Title and due date are required"
                    ]);
                    break;
                }

                $taskData = [
                    'customer_id' => $data->customer_id ?? null,
                    'opportunity_id' => $data->opportunity_id ?? null,
                    'assigned_to' => $data->assigned_to ?? $user_id,
                    'title' => $data->title,
                    'description' => $data->description ?? null,
                    'task_type' => $data->task_type ?? 'follow_up',
                    'priority' => $data->priority ?? 'medium',
                    'status' => $data->status ?? 'pending',
                    'due_date' => $data->due_date,
                    'reminder_date' => $data->reminder_date ?? null,
                    'created_by' => $user_id
                ];

                $task_id = $task->create($taskData);

                if ($task_id) {
                    http_response_code(201);
                    echo json_encode([
                        "success" => true,
                        "message" => "Task created successfully",
                        "data" => [
                            "id" => $task_id
                        ]
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        "success" => false,
                        "message" => "Failed to create task"
                    ]);
                }
            }
            break;

        case 'PUT':
            // UPDATE TASK
            $data = json_decode(file_get_contents("php://input"));

            if (empty($data->id)) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Task ID is required"
                ]);
                break;
            }

            $updateData = [
                'title' => $data->title,
                'description' => $data->description ?? null,
                'task_type' => $data->task_type,
                'priority' => $data->priority,
                'status' => $data->status,
                'due_date' => $data->due_date,
                'reminder_date' => $data->reminder_date ?? null
            ];

            if ($task->update($data->id, $updateData)) {
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Task updated successfully"
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to update task"
                ]);
            }
            break;

        case 'DELETE':
            // DELETE TASK
            if (empty($_GET['id'])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Task ID is required"
                ]);
                break;
            }

            if ($task->delete($_GET['id'])) {
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Task deleted successfully"
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to delete task"
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
