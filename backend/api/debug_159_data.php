<?php
if (!isset($_SERVER['HTTP_HOST']))
    $_SERVER['HTTP_HOST'] = 'localhost';
require_once __DIR__ . '/../config/database.php';
$database = new Database();
$db = $database->getConnection();
$stmt = $db->prepare('SELECT price, fuel FROM cars WHERE id = ?');
$stmt->execute([159]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
echo "Price: [" . $row['price'] . "]\n";
echo "Fuel: [" . $row['fuel'] . "]\n";
?>