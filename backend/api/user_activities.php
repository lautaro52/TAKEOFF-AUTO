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

if ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    $type = $_GET['type'] ?? 'all'; // favorites, quotes, or all

    if (!$user_id) {
        echo json_encode(["success" => false, "message" => "User ID required"]);
        exit();
    }

    try {
        $response = ["success" => true, "data" => []];

        if ($type === 'favorites' || $type === 'all') {
            $query = "SELECT c.*, (SELECT GROUP_CONCAT(image_path SEPARATOR '||') FROM car_images WHERE car_id = c.id) as images 
                      FROM user_favorites f
                      JOIN cars c ON f.car_id = c.id
                      WHERE f.user_id = ?
                      ORDER BY f.created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute([$user_id]);
            $response['favorites'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        if ($type === 'quotes' || $type === 'all') {
            $query = "SELECT c.*, q.quoted_at, (SELECT GROUP_CONCAT(image_path SEPARATOR '||') FROM car_images WHERE car_id = c.id) as images 
                      FROM user_recent_quotes q
                      JOIN cars c ON q.car_id = c.id
                      WHERE q.user_id = ?
                      ORDER BY q.quoted_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute([$user_id]);
            $response['quotes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode($response);

    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->user_id) && !empty($data->car_id) && !empty($data->action)) {
        try {
            if ($data->action === 'favorite') {
                $query = "INSERT IGNORE INTO user_favorites (user_id, car_id) VALUES (?, ?)";
                $stmt = $db->prepare($query);
                $stmt->execute([$data->user_id, $data->car_id]);
                echo json_encode(["success" => true, "message" => "Favorite updated"]);
            } elseif ($data->action === 'unfavorite') {
                $query = "DELETE FROM user_favorites WHERE user_id = ? AND car_id = ?";
                $stmt = $db->prepare($query);
                $stmt->execute([$data->user_id, $data->car_id]);
                echo json_encode(["success" => true, "message" => "Favorite removed"]);
            } elseif ($data->action === 'quote') {
                $query = "INSERT INTO user_recent_quotes (user_id, car_id) VALUES (?, ?)";
                $stmt = $db->prepare($query);
                $stmt->execute([$data->user_id, $data->car_id]);
                echo json_encode(["success" => true, "message" => "Quote recorded"]);
            } else {
                echo json_encode(["success" => false, "message" => "Invalid action"]);
            }
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Incomplete data"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
?>