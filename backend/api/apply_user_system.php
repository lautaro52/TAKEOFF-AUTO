<?php
include_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

$sql = file_get_contents(__DIR__ . '/../../database/user_system.sql');

try {
    $db->exec($sql);
    echo json_encode(["success" => true, "message" => "User system tables created successfully"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error creating tables: " . $e->getMessage()]);
}
?>