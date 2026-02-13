const fs = require('fs');
const fullPath = 'src/pages/Credit.css';
try {
    const data = fs.readFileSync(fullPath);
    console.log('Current size:', data.length);
    let index = data.indexOf(0);
    if (index === -1) {
        console.log('No null bytes found, searching for corrupted comment pattern...');
        // Match the space-separated comment if null bytes aren't detected as 0 for some reason
        const str = data.toString('utf8');
        const pattern = '/ *   S C R O L L';
        index = str.indexOf(pattern);
    }

    if (index !== -1) {
        console.log('Truncating at index:', index);
        const cleanData = data.slice(0, index);
        fs.writeFileSync(fullPath, cleanData);
        console.log('Success. New size:', cleanData.length);
    } else {
        console.log('Could not find corruption point.');
    }
} catch (e) {
    console.error(e);
}
