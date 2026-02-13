<?php
if (!isset($_SERVER['HTTP_HOST']))
    $_SERVER['HTTP_HOST'] = 'localhost';
require_once __DIR__ . '/../config/database.php';
$database = new Database();
$db = $database->getConnection();
$stmt = $db->prepare('SELECT * FROM cars WHERE id = ?');
$stmt->execute([159]);
$car = $stmt->fetch(PDO::FETCH_ASSOC);
if ($car) {
    echo "Car 159 found: " . $car['brand'] . " " . $car['model'] . "\n";
    $stmt = $db->prepare('SELECT COUNT(*) FROM car_images WHERE car_id = ?');
    $stmt->execute([159]);
    echo "Images count: " . $stmt->fetchColumn() . "\n";
} else {
    echo "Car 159 NOT FOUND in database.\n";
}
?>