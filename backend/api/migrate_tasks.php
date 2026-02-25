<?php
include_once __DIR__ . '/../config/database.php';
$database = new Database();
$db = $database->getConnection();

try {
    $db->exec("ALTER TABLE crm_tasks MODIFY COLUMN due_date DATETIME NULL");
    echo "crm_tasks.due_date modified to DATETIME successfully.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
