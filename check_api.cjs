const http = require('http');

http.get('http://localhost/takeoffauto-api/api/cars.php', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('API Status:', res.statusCode);
            if (Array.isArray(json)) {
                console.log('Cars returned:', json.length);
            } else {
                console.log('JSON Keys:', Object.keys(json));
                if (json.cars && Array.isArray(json.cars)) {
                    console.log('Cars in "cars" field:', json.cars.length);
                } else if (json.data && Array.isArray(json.data)) {
                    console.log('Cars in "data" field:', json.data.length);
                } else {
                    console.log('No recognized array found. JSON summary:', JSON.stringify(json).substring(0, 200));
                }
            }
        } catch (e) {
            console.log('Error parsing JSON:', e.message);
            console.log('Raw data start:', data.substring(0, 100));
        }
    });
}).on('error', (err) => {
    console.log('Error:', err.message);
});
