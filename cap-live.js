const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const PORT = 5502;
const configPath = path.join(__dirname, 'capacitor.config.json');
const backupPath = path.join(__dirname, 'capacitor.config.json.bak');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function restore() {
  if (fs.existsSync(backupPath)) {
    console.log('\nRestoring original capacitor.config.json...');
    fs.copyFileSync(backupPath, configPath);
    fs.unlinkSync(backupPath);
    console.log('Restored successfully.');
  }
}

// Handle exit signals to restore original config
process.on('SIGINT', () => {
  restore();
  process.exit(0);
});
process.on('SIGTERM', () => {
  restore();
  process.exit(0);
});
process.on('exit', () => {
  restore();
});

try {
  const localIP = getLocalIP();
  if (localIP === 'localhost') {
    console.error('Error: Could not find local network IP address. Make sure you are connected to Wi-Fi/Ethernet.');
    process.exit(1);
  }

  console.log(`Local Network IP detected: ${localIP}`);

  if (!fs.existsSync(configPath)) {
    console.error('Error: capacitor.config.json not found in this folder.');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  // Backup original config
  fs.copyFileSync(configPath, backupPath);
  console.log('Created capacitor.config.json.bak backup.');

  // Set server url to local IP
  config.server = config.server || {};
  config.server.url = `http://${localIP}:${PORT}`;
  config.server.cleartext = true;

  // Write temporary config
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Updated capacitor.config.json server URL to http://${localIP}:${PORT}`);

  // Sync to android
  console.log('Syncing project with Capacitor...');
  execSync('npx cap sync android', { stdio: 'inherit' });

  // Open Android Studio
  console.log('Opening Android Studio...');
  execSync('npx cap open android', { stdio: 'inherit' });

  console.log('\n\x1b[32m%s\x1b[0m', '===================================================');
  console.log('\x1b[32m%s\x1b[0m', '  Capacitor Live Reload Configured!');
  console.log('\x1b[32m%s\x1b[0m', '===================================================');
  console.log(`  1. Ensure your mobile device/tablet is on the same Wi-Fi network.`);
  console.log(`  2. In another terminal, run: npm run serve (starts dev server on port ${PORT})`);
  console.log(`  3. Run the app on your device/emulator from Android Studio.`);
  console.log(`  4. Any changes you make will live reload instantly!`);
  console.log('\x1b[33m%s\x1b[0m', '  Keep this terminal open. Press Ctrl+C to stop live reload');
  console.log('\x1b[33m%s\x1b[0m', '  and restore original capacitor config.');
  console.log('\x1b[32m%s\x1b[0m', '===================================================');

  // Keep script running
  setInterval(() => {}, 1000);
} catch (error) {
  console.error('Error configuring live reload:', error.message);
  restore();
  process.exit(1);
}
