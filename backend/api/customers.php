<?php
/**
 * Customers API
 * Handles customer management endpoints
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
require_once '../classes/Customer.php';
require_once '../classes/Session.php';

$database = new Database();
$db = $database->getConnection();

$customer = new Customer($db);
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
            if ($action === 'search') {
                // SEARCH CUSTOMERS
                $query = isset($_GET['query']) ? $_GET['query'] : '';
                
                if (empty($query)) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false,
                        "message" => "Search query is required"
                    ]);
                    break;
                }

                $filters = [
                    'search' => $query,
                    'limit' => isset($_GET['limit']) ? (int)$_GET['limit'] : 20
                ];

                $customers = $customer->getAll($filters);
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $customers
                ]);

            } elseif ($action === 'stats') {
                // GET STATISTICS
                $stats = $customer->getStats();
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $stats
                ]);

            } elseif (isset($_GET['id'])) {
                // GET SINGLE CUSTOMER
                $customerData = $customer->getById($_GET['id']);
                
                if ($customerData) {
                    http_response_code(200);
                    echo json_encode([
                        "success" => true,
                        "data" => $customerData
                    ]);
                } else {
                    http_response_code(404);
                    echo json_encode([
                        "success" => false,
                        "message" => "Customer not found"
                    ]);
                }

            } else {
                // GET ALL CUSTOMERS WITH FILTERS
                $filters = [];
                
                if (isset($_GET['source'])) {
                    $filters['source'] = $_GET['source'];
                }
                if (isset($_GET['customer_type'])) {
                    $filters['customer_type'] = $_GET['customer_type'];
                }
                if (isset($_GET['status'])) {
                    $filters['status'] = $_GET['status'];
                }
                if (isset($_GET['search'])) {
                    $filters['search'] = $_GET['search'];
                }
                if (isset($_GET['page'])) {
                    $filters['page'] = (int)$_GET['page'];
                }
                if (isset($_GET['limit'])) {
                    $filters['limit'] = (int)$_GET['limit'];
                }

                $customers = $customer->getAll($filters);
                
                // Calculate pagination info
                $page = $filters['page'] ?? 1;
                $limit = $filters['limit'] ?? 50;
                
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $customers,
                    "pagination" => [
                        "page" => $page,
                        "limit" => $limit,
                        "total" => count($customers)
                    ]
                ]);
            }
            break;

        case 'POST':
            // CREATE CUSTOMER
            $data = json_decode(file_get_contents("php://input"));

            if (empty($data->full_name)) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Full name is required"
                ]);
                break;
            }

            $customerData = [
                'full_name' => $data->full_name,
                'email' => $data->email ?? null,
                'phone' => $data->phone ?? null,
                'whatsapp' => $data->whatsapp ?? null,
                'city' => $data->city ?? null,
                'address' => $data->address ?? null,
                'dni' => $data->dni ?? null,
                'birth_date' => $data->birth_date ?? null,
                'customer_type' => $data->customer_type ?? 'buyer',
                'source' => $data->source ?? 'website',
                'source_partner_id' => $data->source_partner_id ?? null,
                'status' => $data->status ?? 'lead',
                'preferred_contact_method' => $data->preferred_contact_method ?? 'whatsapp',
                'marketing_consent' => $data->marketing_consent ?? false,
                'notes' => $data->notes ?? null,
                'tags' => $data->tags ?? null,
                'created_by' => $user_id
            ];

            $customer_id = $customer->create($customerData);

            if ($customer_id) {
                $newCustomer = $customer->getById($customer_id);
                http_response_code(201);
                echo json_encode([
                    "success" => true,
                    "message" => "Customer created successfully",
                    "data" => $newCustomer
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to create customer"
                ]);
            }
            break;

        case 'PUT':
            // UPDATE CUSTOMER
            $data = json_decode(file_get_contents("php://input"));

            if (empty($data->id)) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Customer ID is required"
                ]);
                break;
            }

            $updateData = [
                'full_name' => $data->full_name,
                'email' => $data->email ?? null,
                'phone' => $data->phone ?? null,
                'whatsapp' => $data->whatsapp ?? null,
                'city' => $data->city ?? null,
                'address' => $data->address ?? null,
                'dni' => $data->dni ?? null,
                'birth_date' => $data->birth_date ?? null,
                'customer_type' => $data->customer_type,
                'status' => $data->status,
                'preferred_contact_method' => $data->preferred_contact_method,
                'marketing_consent' => $data->marketing_consent ?? false,
                'notes' => $data->notes ?? null,
                'tags' => $data->tags ?? null
            ];

            if ($customer->update($data->id, $updateData)) {
                $updatedCustomer = $customer->getById($data->id);
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Customer updated successfully",
                    "data" => $updatedCustomer
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to update customer"
                ]);
            }
            break;

        case 'DELETE':
            // DELETE CUSTOMER
            if (empty($_GET['id'])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Customer ID is required"
                ]);
                break;
            }

            if ($customer->delete($_GET['id'])) {
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Customer deleted successfully"
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to delete customer"
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
