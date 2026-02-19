<?php
/**
 * Activities API
 * Handles customer interaction logging and activity tracking endpoints
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
require_once '../classes/Activity.php';
require_once '../classes/Session.php';

$database = new Database();
$db = $database->getConnection();

$activity = new Activity($db);
$session = new Session($db);

$method = $_SERVER['REQUEST_METHOD'];

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
            if (isset($_GET['customer_id'])) {
                // GET ACTIVITIES BY CUSTOMER (TIMELINE)
                $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
                $activities = $activity->getByCustomer($_GET['customer_id'], $limit);
                
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $activities
                ]);

            } elseif (isset($_GET['opportunity_id'])) {
                // GET ACTIVITIES BY OPPORTUNITY
                $activities = $activity->getByOpportunity($_GET['opportunity_id']);
                
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $activities
                ]);

            } elseif (isset($_GET['created_by'])) {
                // GET RECENT ACTIVITIES BY USER
                $filters = [
                    'created_by' => $_GET['created_by'],
                    'limit' => isset($_GET['limit']) ? (int)$_GET['limit'] : 20
                ];
                
                $activities = $activity->getAll($filters);
                
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $activities
                ]);

            } else {
                // GET ALL ACTIVITIES WITH FILTERS
                $filters = [];
                
                if (isset($_GET['activity_type'])) {
                    $filters['activity_type'] = $_GET['activity_type'];
                }
                if (isset($_GET['date_from'])) {
                    $filters['date_from'] = $_GET['date_from'];
                }
                if (isset($_GET['date_to'])) {
                    $filters['date_to'] = $_GET['date_to'];
                }
                if (isset($_GET['limit'])) {
                    $filters['limit'] = (int)$_GET['limit'];
                }

                $activities = $activity->getAll($filters);
                
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $activities
                ]);
            }
            break;

        case 'POST':
            // CREATE ACTIVITY
            $data = json_decode(file_get_contents("php://input"));

            if (empty($data->customer_id) || empty($data->activity_type) || empty($data->subject)) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Customer ID, activity type, and subject are required"
                ]);
                break;
            }

            $activityData = [
                'customer_id' => $data->customer_id,
                'opportunity_id' => $data->opportunity_id ?? null,
                'related_car_id' => $data->related_car_id ?? null,
                'activity_type' => $data->activity_type,
                'subject' => $data->subject,
                'description' => $data->description ?? null,
                'outcome' => $data->outcome ?? null,
                'activity_date' => $data->activity_date ?? date('Y-m-d H:i:s'),
                'duration_minutes' => $data->duration_minutes ?? null,
                'created_by' => $user_id,
                'attachments' => $data->attachments ?? null
            ];

            $activity_id = $activity->create($activityData);

            if ($activity_id) {
                http_response_code(201);
                echo json_encode([
                    "success" => true,
                    "message" => "Activity logged successfully",
                    "data" => [
                        "id" => $activity_id
                    ]
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to log activity"
                ]);
            }
            break;

        case 'PUT':
            // UPDATE ACTIVITY
            $data = json_decode(file_get_contents("php://input"));

            if (empty($data->id)) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Activity ID is required"
                ]);
                break;
            }

            $updateData = [
                'subject' => $data->subject,
                'description' => $data->description ?? null,
                'outcome' => $data->outcome ?? null,
                'activity_date' => $data->activity_date,
                'duration_minutes' => $data->duration_minutes ?? null,
                'attachments' => $data->attachments ?? null
            ];

            if ($activity->update($data->id, $updateData)) {
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Activity updated successfully"
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to update activity"
                ]);
            }
            break;

        case 'DELETE':
            // DELETE ACTIVITY
            if (empty($_GET['id'])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Activity ID is required"
                ]);
                break;
            }

            if ($activity->delete($_GET['id'])) {
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Activity deleted successfully"
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to delete activity"
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
