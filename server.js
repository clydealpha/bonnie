const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

const samplePlantationData = {
  timestamp: new Date().toISOString(),
  soilMoisture: 0.35,
  droneImage: 'placeholder.jpg',
  waterStress: false
};

let decisionLog = [];

function sendFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/plantations') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(samplePlantationData));
    return;
  }

  if (url.pathname === '/api/decision' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const record = JSON.parse(body);
        record.timestamp = new Date().toISOString();
        decisionLog.push(record);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } catch (err) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
    return;
  }

  if (url.pathname === '/api/decisions') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(decisionLog));
    return;
  }

  // static files
  let filePath = path.join(__dirname, 'sei-dashboard', url.pathname);
  if (url.pathname === '/' || url.pathname === '/index.html') {
    filePath = path.join(__dirname, 'sei-dashboard', 'index.html');
  }
  const ext = path.extname(filePath).toLowerCase();
  const typeMap = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };
  const contentType = typeMap[ext] || 'application/octet-stream';
  sendFile(res, filePath, contentType);
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
