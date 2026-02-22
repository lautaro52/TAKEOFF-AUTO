<?php
/**
 * TAKEOFF AUTO - Data Export Script
 * This script connects to the local database and generates a SQL file
 * with INSERT statements for 'cars' and 'car_images' tables.
 */

// Path to local database config
$db_config_path = 'C:/xampp/htdocs/takeoffauto-api/config/database.php';

if (!file_exists($db_config_path)) {
    // Try relative path if absolute fails
    $db_config_path = '../../xampp/htdocs/takeoffauto-api/config/database.php';
}

if (!file_exists($db_config_path)) {
    die("Error: No se encontró el archivo de configuración de la base de datos local en: " . $db_config_path . "\n");
}

require_once $db_config_path;

class DataExporter
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function generateSql($tables)
    {
        $sql = "-- TAKEOFF AUTO - Data Export\n";
        $sql .= "-- Generated on: " . date('Y-m-d H:i:s') . "\n";
        $sql .= "SET FOREIGN_KEY_CHECKS = 0;\n\n";

        foreach ($tables as $table) {
            $sql .= "-- Data for table: $table\n";
            $sql .= "TRUNCATE TABLE $table;\n"; // Clear existing to avoid duplicates if re-importing

            $stmt = $this->conn->query("SELECT * FROM $table");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($rows)) {
                $sql .= "-- Table $table is empty.\n\n";
                continue;
            }

            foreach ($rows as $row) {
                $columns = array_keys($row);
                $values = array_map(function ($val) {
                    if ($val === null)
                        return 'NULL';
                    return $this->conn->quote($val);
                }, array_values($row));

                $sql .= "INSERT INTO $table (" . implode(', ', $columns) . ") VALUES (" . implode(', ', $values) . ");\n";
            }
            $sql .= "\n";
        }

        $sql .= "SET FOREIGN_KEY_CHECKS = 1;\n";
        return $sql;
    }
}

try {
    $db = new Database();
    $conn = $db->getConnection();

    $exporter = new DataExporter($conn);
    $tables = ['cars', 'car_images'];
    $sqlOutput = $exporter->generateSql($tables);

    $outputFile = 'database/local_data_export.sql';
    file_put_contents($outputFile, $sqlOutput);

    echo "✅ Éxito: Se han exportado los datos correctamente a: $outputFile\n";
    echo "Contenido: " . count($tables) . " tablas procesadas.\n";

} catch (Exception $e) {
    die("❌ Error durante la exportación: " . $e->getMessage() . "\n");
}
