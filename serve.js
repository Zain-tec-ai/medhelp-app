const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 5502;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  // Remove query parameters or hash fragments
  filePath = filePath.split('?')[0].split('#')[0];

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile('./index.html', (err, indexContent) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexContent, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server error: ' + error.code + '\n');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('\x1b[36m%s\x1b[0m', '---------------------------------------------------');
  console.log('\x1b[32m%s\x1b[0m', '  MedHelp Dev Server is running!');
  console.log('\x1b[36m%s\x1b[0m', '---------------------------------------------------');
  console.log(`  Local URL:            http://localhost:${PORT}`);
  
  // Find local IP address
  const interfaces = os.networkInterfaces();
  let foundIP = false;
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log('\x1b[35m%s\x1b[0m', `  Mobile/Tablet URL:    http://${iface.address}:${PORT}`);
        foundIP = true;
      }
    }
  }
  if (!foundIP) {
    console.log('  Mobile/Tablet URL:    (Connect your PC and device to the same Wi-Fi network)');
  }
  console.log('\x1b[36m%s\x1b[0m', '---------------------------------------------------');
  console.log('  Press Ctrl+C to stop the server.');
});
