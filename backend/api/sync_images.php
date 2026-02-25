<?php
/**
 * sync_images.php
 * 
 * Synchronizes car images from the filesystem to the database.
 * 
 * How it works:
 *   1. Clears ONLY subfolder-based image entries (uploads/cars/{id}/...)
 *      while preserving entries for 0km catalog images (images/0km/...).
 *   2. Scans each car ID subfolder in uploads/cars/.
 *   3. Verifies each image file actually EXISTS on disk before inserting.
 *   4. Sorts images alphabetically for consistent display order.
 *   5. Reports orphan flat files that aren't in any subfolder.
 * 
 * Usage:
 *   C:\xampp\php\php.exe "path\to\sync_images.php"
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

if (!isset($_SERVER['HTTP_HOST']))
    $_SERVER['HTTP_HOST'] = 'localhost';
if (!isset($_SERVER['REQUEST_METHOD']))
    $_SERVER['REQUEST_METHOD'] = 'GET';

include_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "=== Image Sync (Safe Mode) ===\n";
echo "Started at: " . date('Y-m-d H:i:s') . "\n\n";

try {
    // 1. Get all valid car IDs from the database
    $validIds = $db->query("SELECT id FROM cars")->fetchAll(PDO::FETCH_COLUMN);
    echo "Found " . count($validIds) . " valid car IDs in database.\n";

    // 2. Clear ONLY subfolder-based image entries (preserve 0km catalog images)
    $deleted = $db->exec("DELETE FROM car_images WHERE image_path LIKE 'uploads/cars/%'");
    echo "Cleared $deleted subfolder-based image entries.\n";

    // 3. Scan uploads directory
    $basePath = __DIR__ . '/uploads/cars';
    if (!is_dir($basePath)) {
        die("Uploads directory not found at $basePath\n");
    }

    $items = glob($basePath . '/*');
    $carDirs = array_filter($items, 'is_dir');
    echo "Scanning " . count($carDirs) . " folders in filesystem...\n\n";

    $insertQuery = "INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES (:car_id, :image_path, :is_primary, :display_order)";
    $stmt = $db->prepare($insertQuery);

    $totalImages = 0;
    $syncedCars = 0;
    $skippedFolders = 0;

    foreach ($carDirs as $carDir) {
        $carIdStr = basename($carDir);
        $carId = intval($carIdStr);

        if (!in_array($carId, $validIds)) {
            $skippedFolders++;
            continue;
        }

        $images = glob($carDir . '/*.{jpg,jpeg,png,webp,gif}', GLOB_BRACE);
        if (empty($images))
            continue;

        // Sort alphabetically for consistent ordering (foto_01, foto_02, etc.)
        sort($images);

        $syncedCars++;
        $order = 0;
        foreach ($images as $imagePath) {
            // Verify file actually exists (safety check)
            if (!file_exists($imagePath)) {
                echo "  WARNING: File listed but not found: $imagePath\n";
                continue;
            }

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

    echo "Synced: $totalImages images for $syncedCars cars.\n";
    if ($skippedFolders > 0) {
        echo "Skipped: $skippedFolders folders with no matching car in DB.\n";
    }

    // 4. Report orphan flat files (sitting directly in uploads/cars/ without a subfolder)
    $flatFiles = glob($basePath . '/*.{jpg,jpeg,png,webp,gif}', GLOB_BRACE);
    if (count($flatFiles) > 0) {
        echo "\nWARNING: Found " . count($flatFiles) . " flat image files in uploads/cars/ (not in subfolders).\n";
        echo "  These files are NOT linked to any car. Run fix_image_mapping.php to organize them.\n";
    }

    // 5. Summary of cars without images
    $stmt2 = $db->query("
        SELECT c.id, c.brand, c.model, c.status 
        FROM cars c 
        LEFT JOIN car_images ci ON c.id = ci.car_id 
        WHERE ci.id IS NULL AND c.status = 'disponible'
        ORDER BY c.id
    ");
    $noImageCars = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    if (count($noImageCars) > 0) {
        echo "\nCars with status 'disponible' but NO images: " . count($noImageCars) . "\n";
        foreach ($noImageCars as $car) {
            echo "  - ID {$car['id']}: {$car['brand']} {$car['model']}\n";
        }
    }

    echo "\nFinished at: " . date('Y-m-d H:i:s') . "\n";

} catch (Exception $e) {
    echo "Fatal Error: " . $e->getMessage() . "\n";
}
?>