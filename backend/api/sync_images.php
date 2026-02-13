<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (!isset($_SERVER['HTTP_HOST']))
    $_SERVER['HTTP_HOST'] = 'localhost';
if (!isset($_SERVER['REQUEST_METHOD']))
    $_SERVER['REQUEST_METHOD'] = 'GET';

include_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "Starting synchronization (Foreign Key Safe)...\n";

try {
    // 1. Get all valid car IDs from the database
    $validIds = $db->query("SELECT id FROM cars")->fetchAll(PDO::FETCH_COLUMN);
    echo "Found " . count($validIds) . " valid car IDs in database.\n";

    // 2. Clear existing images
    // Disable FK checks temporarily to be safe during truncate if needed, but truncate usually requires it.
    // However, we just want to clear images.
    $db->exec("DELETE FROM car_images");
    echo "Table car_images cleared.\n";

    // 3. Scan uploads directory
    $basePath = __DIR__ . '/uploads/cars';
    if (!is_dir($basePath)) {
        die("Uploads directory not found at $basePath\n");
    }

    $items = glob($basePath . '/*');
    $carDirs = array_filter($items, 'is_dir');
    echo "Scanning " . count($carDirs) . " folders in filesystem...\n";

    $insertQuery = "INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES (:car_id, :image_path, :is_primary, :display_order)";
    $stmt = $db->prepare($insertQuery);

    $totalImages = 0;
    $syncedCars = 0;

    foreach ($carDirs as $carDir) {
        $carIdStr = basename($carDir);
        $carId = intval($carIdStr);

        if (!in_array($carId, $validIds)) {
            // Skip folders that don't have a matching car in DB
            continue;
        }

        $images = glob($carDir . '/*.{jpg,jpeg,png,webp,gif}', GLOB_BRACE);
        if (empty($images))
            continue;

        $syncedCars++;
        $order = 0;
        foreach ($images as $imagePath) {
            $relativePath = "uploads/cars/$carIdStr/" . basename($imagePath);
            $isPrimary = ($order === 0) ? 1 : 0;

            $stmt->bindParam(':car_id', $carId);
            $stmt->bindParam(':image_path', $relativePath);
            $stmt->bindParam(':is_primary', $isPrimary);
            $stmt->bindParam(':display_order', $order);

            if ($stmt->execute()) {
                $order++;
                $totalImages++;
            }
        }
    }

    echo "Finished! Total images synced: $totalImages for $syncedCars cars.\n";

} catch (Exception $e) {
    echo "Fatal Error: " . $e->getMessage() . "\n";
}
?>