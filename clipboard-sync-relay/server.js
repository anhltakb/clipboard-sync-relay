const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Clipboard Sync Relay is running\n');
});

const wss = new WebSocket.Server({ server });

// rooms: roomKey -> Set of WebSocket clients
const rooms = new Map();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const room = url.searchParams.get('room') || 'default';
  const key = url.searchParams.get('key') || '';

  // Simple shared secret (change this or make it env)
  const EXPECTED_KEY = process.env.SYNC_KEY || 'clipboard-secret-key-change-me';

  if (key !== EXPECTED_KEY) {
    ws.close(4001, 'Invalid key');
    return;
  }

  if (!rooms.has(room)) {
    rooms.set(room, new Set());
  }
  rooms.get(room).add(ws);

  console.log(`Client joined room: ${room} (total: ${rooms.get(room).size})`);

  ws.on('message', (data, isBinary) => {
    // Broadcast to other clients in the same room
    const clients = rooms.get(room);
    if (!clients) return;

    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    }
  });

  ws.on('close', () => {
    const clients = rooms.get(room);
    if (clients) {
      clients.delete(ws);
      if (clients.size === 0) {
        rooms.delete(room);
      }
    }
    console.log(`Client left room: ${room}`);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

server.listen(PORT, () => {
  console.log(`Clipboard Sync Relay listening on port ${PORT}`);
});
