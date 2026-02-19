<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class Database
{
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function getConnection()
    {
        $this->conn = null;

        // Detectar si estamos en local o Hostinger
        $host = $_SERVER['HTTP_HOST'] ?? '';
        $isLocal = strpos($host, 'localhost') !== false ||
            strpos($host, '127.0.0.1') !== false ||
            strpos($host, '192.168.') !== false ||
            (php_sapi_name() === 'cli'); // Support CLI execution (local dev)

        if ($isLocal) {
            // ========================================================
            // LOCALHOST - Base de datos local
            // Crear esta BD con el archivo schema.sql
            // ========================================================
            $this->host = "localhost";
            $this->db_name = "takeoffauto_db";
            $this->username = "root";
            $this->password = "";
        } else {
            // ========================================================
            // HOSTINGER - Base de datos en producción
            // ========================================================
            $this->host = "localhost";
            $this->db_name = "u236151574_takeoffauto";
            $this->username = "u236151574_takeoffauto";
            $this->password = "JRD@QCg#z0";
        }

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8mb4");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $exception) {
            echo json_encode(array(
                "success" => false,
                "message" => "Connection error: " . $exception->getMessage()
            ));
            exit();
        }

        return $this->conn;
    }
}
?>