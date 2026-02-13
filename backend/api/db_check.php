<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (!isset($_SERVER['HTTP_HOST']))
    $_SERVER['HTTP_HOST'] = 'localhost';
require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "--- DB Status ---\n";
try {
    $stmt = $db->query("SELECT COUNT(*) FROM car_images");
    echo "car_images count: " . $stmt->fetchColumn() . "\n";

    $stmt = $db->query("SELECT COUNT(*) FROM cars");
    echo "cars count: " . $stmt->fetchColumn() . "\n";

    echo "\n--- Sample Data (ID, Brand, Model, ImgCount) ---\n";
    $query = "SELECT c.id, c.brand, c.model, (SELECT COUNT(*) FROM car_images ci WHERE ci.car_id = c.id) as img_count 
              FROM cars c LIMIT 10";
    $stmt = $db->query($query);
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "ID: {$row['id']} | {$row['brand']} {$row['model']} | Imgs: {$row['img_count']}\n";
    }
} catch (Exception $e) {
    echo "Error checking DB: " . $e->getMessage() . "\n";
}

echo "\n--- Filesystem Status ---\n";
$basePath = __DIR__ . '/uploads/cars';
echo "Path: $basePath\n";
if (is_dir($basePath)) {
    $items = glob($basePath . '/*', GLOB_ONLYDIR);
    echo "Total car folders found by glob: " . count($items) . "\n";

    if (count($items) > 0) {
        $sample = $items[0];
        echo "Sample folder: " . basename($sample) . "\n";
        $imgs = glob($sample . '/*.{jpg,jpeg,png,webp,gif}', GLOB_BRACE);
        echo "Images in sample: " . count($imgs) . "\n";
        if (count($imgs) > 0) {
            echo "First image file: " . basename($imgs[0]) . "\n";
        }
    }
} else {
    echo "Uploads directory NOT FOUND.\n";
}
?>