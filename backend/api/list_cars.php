<?php
if (!isset($_SERVER['HTTP_HOST']))
    $_SERVER['HTTP_HOST'] = 'localhost';
if (!isset($_SERVER['REQUEST_METHOD']))
    $_SERVER['REQUEST_METHOD'] = 'GET';
require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "--- CARS IN DATABASE ---\n";
$stmt = $db->query("SELECT id, brand, model, year FROM cars ORDER BY id ASC");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "ID: {$row['id']} | {$row['brand']} {$row['model']} ({$row['year']})\n";
}

echo "\n--- FOLDERS IN FILESYSTEM ---\n";
$basePath = __DIR__ . '/uploads/cars';
$items = glob($basePath . '/*', GLOB_ONLYDIR);
foreach ($items as $item) {
    echo basename($item) . ", ";
}
echo "\n";
?>