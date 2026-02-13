<?php
if (!isset($_SERVER['HTTP_HOST']))
    $_SERVER['HTTP_HOST'] = 'localhost';
if (!isset($_SERVER['REQUEST_METHOD']))
    $_SERVER['REQUEST_METHOD'] = 'GET';
require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "--- Searching for Toyota Innova ---\n";
$stmt = $db->query("SELECT id, brand, model, year FROM cars WHERE brand LIKE '%Toyota%' AND model LIKE '%Innova%'");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "ID: {$row['id']} | {$row['brand']} {$row['model']} ({$row['year']})\n";
    $basePath = __DIR__ . '/uploads/cars/' . $row['id'];
    echo "Folder: $basePath | Exists: " . (is_dir($basePath) ? 'YES' : 'NO') . "\n";
    if (is_dir($basePath)) {
        $imgs = glob($basePath . '/*.{jpg,jpeg,png,webp,gif}', GLOB_BRACE);
        echo "Images found: " . count($imgs) . "\n";
    }
}

echo "\n--- DB Check (Images for Toyota Innova) ---\n";
$stmt = $db->query("SELECT COUNT(*) FROM car_images WHERE car_id IN (SELECT id FROM cars WHERE brand LIKE '%Toyota%' AND model LIKE '%Innova%')");
echo "Images in DB for Innova: " . $stmt->fetchColumn() . "\n";
?>