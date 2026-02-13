<?php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    file_put_contents('encoding_report.txt', 'DB connection failed');
    exit;
}

$query = "SELECT id, brand, model, city FROM cars LIMIT 100";
$stmt = $db->prepare($query);
$stmt->execute();

$report = "";
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $report .= "ID: " . $row['id'] . "\n";
    $report .= "Brand: " . $row['brand'] . " [Hex: " . bin2hex($row['brand']) . "]\n";
    $report .= "City: " . $row['city'] . " [Hex: " . bin2hex($row['city']) . "]\n";
    $report .= "-----------------------------------\n";
}

file_put_contents('encoding_report.txt', $report);
echo "Report generated in encoding_report.txt";
?>