<?php
// We'll use a simplified PDO connection to create the database
$host = "localhost";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database if not exists
    $conn->exec("CREATE DATABASE IF NOT EXISTS takeoffauto_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "Database created or already exists.\n";

    // Use the database
    $conn->exec("USE takeoffauto_db");

    // Read and execute schema
    $sql = file_get_contents(__DIR__ . '/../../database/quote_submissions_schema.sql');
    $conn->exec($sql);

    echo json_encode(["success" => true, "message" => "Database and tables created successfully"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>