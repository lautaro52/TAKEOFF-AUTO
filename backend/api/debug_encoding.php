<?php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

header('Content-Type: application/json; charset=UTF-8');

if (!$db) {
    die(json_encode(["success" => false, "message" => "DB connection failed"]));
}

$query = "SELECT id, brand, model, city FROM cars LIMIT 20";
$stmt = $db->prepare($query);
$stmt->execute();

$results = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $item = $row;
    // Add hex representation of the city and brand
    $item['city_hex'] = bin2hex($row['city']);
    $item['brand_hex'] = bin2hex($row['brand']);
    $results[] = $item;
}

echo json_encode([
    "success" => true,
    "data" => $results
], JSON_UNESCAPED_UNICODE);
?>