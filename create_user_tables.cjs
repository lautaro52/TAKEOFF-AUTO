const mysql = require('mysql2/promise');

async function createTables() {
    const config = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'takeoffauto_db'
    };

    try {
        const connection = await mysql.createConnection(config);
        console.log('Connected to MySQL');

        // Users Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(150) NOT NULL UNIQUE,
                whatsapp VARCHAR(20) NOT NULL,
                dni VARCHAR(20) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_dni (dni)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('Table "users" ensured.');

        // Favorites Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS user_favorites (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                car_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
                UNIQUE KEY unique_favorite (user_id, car_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('Table "user_favorites" ensured.');

        // Recent Quotes Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS user_recent_quotes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                car_id INT NOT NULL,
                quoted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
                INDEX idx_user_quotes (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('Table "user_recent_quotes" ensured.');

        await connection.end();
        console.log('Done! All tables are ready.');
    } catch (error) {
        console.error('Error creating tables:', error.message);
        process.exit(1);
    }
}

createTables();
