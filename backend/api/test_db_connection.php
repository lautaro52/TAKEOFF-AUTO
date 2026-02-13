<?php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($db) {
    echo json_encode(array("success" => true, "message" => "Database connected successfully!"));
} else {
    echo json_encode(array("success" => false, "message" => "Database connection failed."));
}
?>