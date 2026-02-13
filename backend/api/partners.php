<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once __DIR__ . '/../config/database.php';
include_once __DIR__ . '/../classes/Partner.php';

$database = new Database();
$db = $database->getConnection();
$partner = new Partner($db);

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if ($action === 'register') {
            if (!empty($data->full_name) && !empty($data->whatsapp) && !empty($data->password)) {
                $partner->full_name = $data->full_name;
                $partner->whatsapp = $data->whatsapp;
                $partner->password = $data->password;
                $partner->cbu_alias = $data->cbu_alias ?? '';
                $partner->residence_zone = $data->residence_zone ?? '';

                $id = $partner->create();
                if ($id) {
                    echo json_encode(["success" => true, "message" => "Partner registered", "id" => $id]);
                } else {
                    echo json_encode(["success" => false, "message" => "Registration failed"]);
                }
            } else {
                echo json_encode(["success" => false, "message" => "Incomplete data"]);
            }
        } elseif ($action === 'login') {
            if (!empty($data->whatsapp) && !empty($data->password)) {
                $user = $partner->login($data->whatsapp, $data->password);
                if ($user) {
                    echo json_encode(["success" => true, "data" => $user]);
                } else {
                    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
                }
            } else {
                echo json_encode(["success" => false, "message" => "Incomplete data"]);
            }
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $partner->id = $_GET['id'];
            $data = $partner->readOne();
            if ($data) {
                echo json_encode(["success" => true, "data" => $data]);
            } else {
                echo json_encode(["success" => false, "message" => "Partner not found"]);
            }
        }
        break;
}
?>