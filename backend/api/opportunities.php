<?php
/**
 * Opportunities API
 * Handles sales pipeline and opportunity management endpoints
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
require_once '../classes/Opportunity.php';
require_once '../classes/Session.php';

$database = new Database();
$db = $database->getConnection();

$opportunity = new Opportunity($db);
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
            if ($action === 'pipeline') {
                // GET PIPELINE DATA FOR KANBAN
                $pipeline = $opportunity->getPipeline();
                
                // Calculate metrics
                $metrics = [
                    'total_active' => 0,
                    'total_value' => 0
                ];
                
                foreach ($pipeline as $stage => $opps) {
                    $metrics['total_active'] += count($opps);
                    foreach ($opps as $opp) {
                        $metrics['total_value'] += $opp['estimated_value'] ?? 0;
                    }
                }
                
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => [
                        "stages" => $pipeline,
                        "metrics" => $metrics
                    ]
                ]);

            } elseif ($action === 'conversion_metrics') {
                // GET CONVERSION METRICS
                $date_from = isset($_GET['from']) ? $_GET['from'] : date('Y-m-01'); // First day of current month
                $date_to = isset($_GET['to']) ? $_GET['to'] : date('Y-m-d'); // Today
                
                $metrics = $opportunity->getConversionMetrics($date_from, $date_to);
                
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $metrics
                ]);

            } elseif (isset($_GET['id'])) {
                // GET SINGLE OPPORTUNITY
                $opportunityData = $opportunity->getById($_GET['id']);
                
                if ($opportunityData) {
                    http_response_code(200);
                    echo json_encode([
                        "success" => true,
                        "data" => $opportunityData
                    ]);
                } else {
                    http_response_code(404);
                    echo json_encode([
                        "success" => false,
                        "message" => "Opportunity not found"
                    ]);
                }

            } else {
                // GET ALL OPPORTUNITIES WITH FILTERS
                $filters = [];
                
                if (isset($_GET['stage'])) {
                    $filters['stage'] = $_GET['stage'];
                }
                if (isset($_GET['customer_id'])) {
                    $filters['customer_id'] = $_GET['customer_id'];
                }
                if (isset($_GET['assigned_to'])) {
                    $filters['assigned_to'] = $_GET['assigned_to'];
                }
                if (isset($_GET['opportunity_type'])) {
                    $filters['opportunity_type'] = $_GET['opportunity_type'];
                }

                $opportunities = $opportunity->getAll($filters);
                
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $opportunities
                ]);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"));

            if ($action === 'update_stage') {
                // UPDATE OPPORTUNITY STAGE
                if (empty($data->id) || empty($data->new_stage)) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false,
                        "message" => "Opportunity ID and new stage are required"
                    ]);
                    break;
                }

                $lost_reason = $data->lost_reason ?? null;
                
                if ($opportunity->updateStage($data->id, $data->new_stage, $lost_reason)) {
                    $updatedOpportunity = $opportunity->getById($data->id);
                    http_response_code(200);
                    echo json_encode([
                        "success" => true,
                        "message" => "Stage updated successfully",
                        "data" => $updatedOpportunity
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        "success" => false,
                        "message" => "Failed to update stage"
                    ]);
                }

            } elseif ($action === 'close') {
                // CLOSE OPPORTUNITY
                if (empty($data->id) || !isset($data->won)) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false,
                        "message" => "Opportunity ID and won status are required"
                    ]);
                    break;
                }

                $actual_value = $data->actual_value ?? null;
                $reason = $data->reason ?? null;
                
                if ($opportunity->close($data->id, $data->won, $actual_value, $reason)) {
                    $closedOpportunity = $opportunity->getById($data->id);
                    http_response_code(200);
                    echo json_encode([
                        "success" => true,
                        "message" => "Opportunity closed successfully",
                        "data" => $closedOpportunity
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        "success" => false,
                        "message" => "Failed to close opportunity"
                    ]);
                }

            } else {
                // CREATE OPPORTUNITY
                if (empty($data->customer_id) || empty($data->title)) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false,
                        "message" => "Customer ID and title are required"
                    ]);
                    break;
                }

                $opportunityData = [
                    'customer_id' => $data->customer_id,
                    'car_id' => $data->car_id ?? null,
                    'partner_id' => $data->partner_id ?? null,
                    'assigned_to' => $data->assigned_to ?? $user_id,
                    'title' => $data->title,
                    'description' => $data->description ?? null,
                    'opportunity_type' => $data->opportunity_type ?? 'purchase',
                    'stage' => $data->stage ?? 'new',
                    'estimated_value' => $data->estimated_value ?? null,
                    'probability' => $data->probability ?? 50,
                    'commission_amount' => $data->commission_amount ?? 0.00,
                    'expected_close_date' => $data->expected_close_date ?? null,
                    'notes' => $data->notes ?? null,
                    'tags' => $data->tags ?? null
                ];

                $opportunity_id = $opportunity->create($opportunityData);

                if ($opportunity_id) {
                    $newOpportunity = $opportunity->getById($opportunity_id);
                    http_response_code(201);
                    echo json_encode([
                        "success" => true,
                        "message" => "Opportunity created successfully",
                        "data" => $newOpportunity
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        "success" => false,
                        "message" => "Failed to create opportunity"
                    ]);
                }
            }
            break;

        case 'PUT':
            // UPDATE OPPORTUNITY
            $data = json_decode(file_get_contents("php://input"));

            if (empty($data->id)) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Opportunity ID is required"
                ]);
                break;
            }

            $updateData = [
                'title' => $data->title,
                'description' => $data->description ?? null,
                'car_id' => $data->car_id ?? null,
                'assigned_to' => $data->assigned_to ?? null,
                'opportunity_type' => $data->opportunity_type,
                'stage' => $data->stage,
                'estimated_value' => $data->estimated_value ?? null,
                'probability' => $data->probability,
                'commission_amount' => $data->commission_amount,
                'expected_close_date' => $data->expected_close_date ?? null,
                'notes' => $data->notes ?? null,
                'tags' => $data->tags ?? null
            ];

            if ($opportunity->update($data->id, $updateData)) {
                $updatedOpportunity = $opportunity->getById($data->id);
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Opportunity updated successfully",
                    "data" => $updatedOpportunity
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to update opportunity"
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
