<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

function verifyToken($t) {
    if (!$t) return null;
    $d = json_decode(base64_decode($t), true);
    return ($d && isset($d['exp']) && $d['exp'] > time()) ? $d : null;
}

$token = $_GET['token'] ?? '';
$admin = verifyToken($token);
if (!$admin) { http_response_code(401); echo json_encode(["success" => false, "message" => "No autorizado"]); exit(); }

$from = $_GET['from'] ?? date('Y-m-01'); // default: current month start
$to = $_GET['to'] ?? date('Y-m-d');

try {
    // Total sales in period
    $salesStmt = $db->prepare("SELECT COUNT(*) as total_sales, COALESCE(SUM(amount), 0) as total_revenue FROM crm_sales WHERE sale_date BETWEEN ? AND ?");
    $salesStmt->execute([$from, $to]);
    $sales = $salesStmt->fetch(PDO::FETCH_ASSOC);

    // Clients by stage
    $stagesStmt = $db->query("SELECT stage, COUNT(*) as count FROM crm_clients GROUP BY stage");
    $stages = [];
    while ($row = $stagesStmt->fetch(PDO::FETCH_ASSOC)) {
        $stages[$row['stage']] = (int)$row['count'];
    }

    // New clients in period
    $newClientsStmt = $db->prepare("SELECT COUNT(*) FROM crm_clients WHERE created_at BETWEEN ? AND ?");
    $newClientsStmt->execute([$from, "$to 23:59:59"]);
    $newClients = (int)$newClientsStmt->fetchColumn();

    // Clients dado_de_baja in period
    $lostStmt = $db->prepare("SELECT COUNT(*) FROM crm_activity_log WHERE action = 'dado_de_baja' AND created_at BETWEEN ? AND ?");
    $lostStmt->execute([$from, "$to 23:59:59"]);
    $lostClients = (int)$lostStmt->fetchColumn();

    // Daily sales breakdown
    $dailyStmt = $db->prepare("SELECT sale_date, COUNT(*) as count, SUM(amount) as revenue FROM crm_sales WHERE sale_date BETWEEN ? AND ? GROUP BY sale_date ORDER BY sale_date");
    $dailyStmt->execute([$from, $to]);
    $dailySales = $dailyStmt->fetchAll(PDO::FETCH_ASSOC);

    // Pending tasks count
    $pendingStmt = $db->query("SELECT COUNT(*) FROM crm_tasks WHERE completed = 0");
    $pendingTasks = (int)$pendingStmt->fetchColumn();

    // Total stock counts
    $stockStmt = $db->query("SELECT COUNT(*) as total, SUM(CASE WHEN has_photos = 1 THEN 1 ELSE 0 END) as with_photos, SUM(CASE WHEN has_photos = 0 THEN 1 ELSE 0 END) as without_photos FROM cars WHERE status = 'disponible'");
    $stock = $stockStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => [
            "period" => ["from" => $from, "to" => $to],
            "total_sales" => (int)$sales['total_sales'],
            "total_revenue" => (float)$sales['total_revenue'],
            "stages" => $stages,
            "new_clients" => $newClients,
            "lost_clients" => $lostClients,
            "pending_tasks" => $pendingTasks,
            "daily_sales" => $dailySales,
            "stock" => [
                "total" => (int)($stock['total'] ?? 0),
                "with_photos" => (int)($stock['with_photos'] ?? 0),
                "without_photos" => (int)($stock['without_photos'] ?? 0)
            ]
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
