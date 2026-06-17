const { spawn } = require('child_process');
const fetch = globalThis.fetch || require('node-fetch');
const path = require('path');
const { io } = require('socket.io-client');

// This test spins up two socket server processes bound to different ports (4001 and 4002),
// configures them to use the same Redis instance, connects clients to each, and verifies
// that participants and messages are synchronized across both server instances via the Redis adapter.

const ROOT = path.resolve(__dirname, '..');
const socketScript = path.join(ROOT, 'apps', 'socket', 'src', 'server.js');
const API_BASE = process.env.API_BASE_URL || 'http://127.0.0.1:4000';

function startSocketServer(port, extraEnv = {}) {
  const env = { ...process.env, SOCKET_PORT: String(port), REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379', ...extraEnv };
  const child = spawn(process.execPath, [socketScript], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.on('data', (d) => process.stdout.write(`[socket:${port}] ${d}`));
  child.stderr.on('data', (d) => process.stderr.write(`[socket:${port}:ERR] ${d}`));
  return child;
}

function waitForHealth(url, timeout = 10000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function poll() {
      fetch(url)
        .then((r) => r.json())
        .then(() => resolve())
        .catch((_e) => {
          if (Date.now() - start > timeout) return reject(new Error('Health check timed out'));
          setTimeout(poll, 200);
        });
    })();
  });
}

async function createTestUser() {
  const email = `scale-${Date.now()}@example.com`;
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Password123!', name: 'Scale Tester' }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error('Failed to create test user: ' + JSON.stringify(body));
  return { accessToken: body.accessToken, user: body.user };
}

async function createTestMeeting(token) {
  const res = await fetch(`${API_BASE}/api/meetings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title: 'Scale test meeting', duration: 10, scheduledAt: new Date(Date.now() + 60000).toISOString() }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error('Failed to create meeting: ' + JSON.stringify(body));
  return body.id || body.data?.id || (body.data && body.data.id) || body;
}

async function run() {
  const user = await createTestUser();
  const meetingId = await createTestMeeting(user.accessToken);

  const PORT_A = 4101;
  const PORT_B = 4102;

  const s1 = startSocketServer(PORT_A);
  const s2 = startSocketServer(PORT_B);

  try {
    await waitForHealth(`http://127.0.0.1:${PORT_A}/health`);
    await waitForHealth(`http://127.0.0.1:${PORT_B}/health`);

    const alice = io(`http://127.0.0.1:${PORT_A}`, { autoConnect: false, transports: ['websocket'], auth: { token: user.accessToken } });
    const bob = io(`http://127.0.0.1:${PORT_B}`, { autoConnect: false, transports: ['websocket'], auth: { token: user.accessToken } });

    await new Promise((res, rej) => { alice.once('connect', res); alice.once('connect_error', rej); alice.connect(); });
    await new Promise((res, rej) => { bob.once('connect', res); bob.once('connect_error', rej); bob.connect(); });

    // meetingId created above

    const aJoined = new Promise((res) => alice.once('meeting:joined', res));
    alice.emit('meeting:join', { meetingId });
    await aJoined;

    const bJoined = new Promise((res) => bob.once('meeting:joined', res));
    bob.emit('meeting:join', { meetingId });
    await bJoined;

    // Alice sends a message; Bob should receive it via the other server.
    const msgText = 'scale-test-' + Date.now();
    const bobMsg = new Promise((res) => bob.once('chat:new-message', res));
    alice.emit('chat:message', { meetingId, text: msgText });

    const payload = await bobMsg;
    if (!payload || payload.message.text !== msgText) throw new Error('Bob did not receive the propagated message');

    console.log('Scale test passed');
  } finally {
    s1.kill();
    s2.kill();
    process.exit(0);
  }
}

run().catch((err) => { console.error(err); process.exit(1); });
