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
include_once __DIR__ . '/../classes/Lead.php';

$database = new Database();
$db = $database->getConnection();
$lead = new Lead($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->client_name) && !empty($data->client_whatsapp)) {
            // 1. Create legacy lead (for partners)
            $lead->partner_id = $data->partner_id ?? null;
            $lead->car_id = $data->car_id ?? null;
            $lead->client_name = $data->client_name;
            $lead->client_whatsapp = $data->client_whatsapp;
            $lead->note = $data->note ?? '';
            $id = $lead->create();

            // 2. Mirror to CRM (crm_clients)
            $crmClientId = null;
            try {
                $stmtCrm = $db->prepare("INSERT INTO crm_clients (full_name, phone, car_id, source) VALUES (?, ?, ?, ?)");
                $source = isset($data->partner_id) ? 'partner' : 'web';
                $stmtCrm->execute([
                    $data->client_name,
                    $data->client_whatsapp,
                    $data->car_id ?? null,
                    $source
                ]);
                $crmClientId = $db->lastInsertId();

                // If there's a note, add it to crm_notes
                if (!empty($data->note)) {
                    $stmtNote = $db->prepare("INSERT INTO crm_notes (client_id, content) VALUES (?, ?)");
                    $stmtNote->execute([$crmClientId, $data->note]);
                }
            } catch (Exception $e) {
                // Log mirroring error but don't fail the primary lead creation
                error_log("CRM Mirroring failed: " . $e->getMessage());
            }

            if ($id) {
                echo json_encode(["success" => true, "id" => $id, "crm_id" => $crmClientId ?? null]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to create lead"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Incomplete data"]);
        }
        break;

    case 'GET':
        if (isset($_GET['partner_id'])) {
            $stmt = $lead->readByPartner($_GET['partner_id']);
            $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["success" => true, "data" => $leads]);
        } else {
            $stmt = $lead->readAll();
            $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["success" => true, "data" => $leads]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->id) && !empty($data->status)) {
            if ($lead->updateStatus($data->id, $data->status, $data->caida_reason ?? null)) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false]);
            }
        }
        break;
}
?>