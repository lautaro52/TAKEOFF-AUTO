<?php
$host = 'localhost';
$user = 'root';
$pass = '';

try {
    $conn = new PDO("mysql:host=$host", $user, $pass);
    $stmt = $conn->query('SHOW DATABASES');
    $databases = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Databases: " . implode(', ', $databases) . "\n";

    if (in_array('takeoffauto_db', $databases)) {
        $conn->exec('USE takeoffauto_db');
        $stmt = $conn->query('SHOW TABLES');
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo "Tables: " . implode(', ', $tables) . "\n";

        if (in_array('cars', $tables)) {
            $stmt = $conn->query('SELECT COUNT(*) FROM cars');
            echo 'Car Count: ' . $stmt->fetchColumn() . "\n";
        } else {
            echo "Table 'cars' not found!\n";
        }
    } else {
        echo "Database 'takeoffauto_db' not found!\n";
    }
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
