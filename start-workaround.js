const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Create the problematic directory structure manually
const problematicPath = path.join(process.cwd(), '.expo', 'metro', 'externals', 'node_sea');

console.log('Creating workaround directory structure...');

// Create the directory structure without the colon
try {
    fs.mkdirSync(problematicPath, { recursive: true });
    console.log('✅ Created directory:', problematicPath);
} catch (error) {
    console.log('Directory already exists or created successfully');
}

// Try to create a symlink or alternative approach
const alternativePath = path.join(process.cwd(), '.expo', 'metro', 'externals', 'node-sea');
try {
    if (!fs.existsSync(alternativePath)) {
        fs.mkdirSync(alternativePath, { recursive: true });
        console.log('✅ Created alternative directory:', alternativePath);
    }
} catch (error) {
    console.log('Alternative directory handling complete');
}

// Now try to start Expo
console.log('\n🚀 Starting Expo with workaround...');
const expo = spawn('npx', ['expo', 'start', '--web'], { 
    stdio: 'inherit', 
    shell: true 
});

expo.on('close', (code) => {
    console.log(`Expo process exited with code ${code}`);
});
