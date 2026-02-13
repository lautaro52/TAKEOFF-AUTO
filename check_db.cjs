const mysql = require('mysql2/promise');
const fs = require('fs');

async function checkDb() {
    const config = {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'takeoffauto_db'
    };

    let log = '';
    const logger = (msg) => {
        console.log(msg);
        log += msg + '\n';
    };

    try {
        logger('Connecting to MySQL with config: ' + JSON.stringify(config, null, 2));
        const connection = await mysql.createConnection(config);
        logger('Successfully connected to MySQL');
        logger('--- DB Status ---');

        const [cars] = await connection.execute('SELECT COUNT(*) as count FROM cars');
        logger('cars count: ' + cars[0].count);

        const [images] = await connection.execute('SELECT COUNT(*) as count FROM car_images');
        logger('car_images count: ' + images[0].count);

        logger('\n--- Sample Data (ID, Brand, Model) ---');
        const [rows] = await connection.execute('SELECT id, brand, model FROM cars LIMIT 10');
        rows.forEach(row => {
            logger(`ID: ${row.id} | ${row.brand} ${row.model}`);
        });

        await connection.end();
    } catch (error) {
        logger('Error checking DB: ' + error.message);
        if (error.code) logger('Error Code: ' + error.code);
    } finally {
        fs.writeFileSync('db_results.txt', log);
    }
}

checkDb();
