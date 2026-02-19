<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$tests = [
  'database_connection' => false,
  'customers_table' => false,
  'opportunities_table' => false,
  'activities_table' => false,
  'tasks_table' => false,
];

try {
  require_once '../config/database.php';
  
  // Instantiate Database class and get connection
  $database = new Database();
  $db = $database->getConnection();
  
  $tests['database_connection'] = true;
  
  // Test each table
  $tables = ['customers', 'opportunities', 'activities', 'tasks'];
  $messages = [];
  
  foreach ($tables as $table) {
    try {
        $stmt = $db->query("SELECT COUNT(*) as count FROM $table");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $tests["{$table}_table"] = true;
        $messages[$table] = "Exists with " . $result['count'] . " records";
    } catch (PDOException $e) {
        $tests["{$table}_table"] = false;
        $messages[$table] = "Error: " . $e->getMessage();
    }
  }
  
  echo json_encode([
    'success' => true,
    'tests' => $tests,
    'details' => $messages,
    'message' => 'All tests execution completed'
  ]);
} catch (Exception $e) {
  echo json_encode([
    'success' => false,
    'tests' => $tests,
    'error' => $e->getMessage()
  ]);
}
?>
