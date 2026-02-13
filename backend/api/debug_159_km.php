<?php
if (!isset($_SERVER['HTTP_HOST']))
    $_SERVER['HTTP_HOST'] = 'localhost';
require_once __DIR__ . '/../config/database.php';
$database = new Database();
$db = $database->getConnection();
$stmt = $db->prepare('SELECT km FROM cars WHERE id = ?');
$stmt->execute([159]);
echo "KM: [" . $stmt->fetchColumn() . "]\n";
?>