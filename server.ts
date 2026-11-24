import express from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import type { ClassroomRoomState, GroupSnapshot } from './src/types/simulation.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'classrooms.json');

const rooms = new Map<string, ClassroomRoomState>();

function normalizeRoomCode(raw: string): string {
  const cleaned = raw.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  return cleaned.slice(0, 24) || 'EARTH-101';
}

function loadRoomsFromDisk(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as Record<string, ClassroomRoomState>;
      for (const [code, room] of Object.entries(parsed)) {
        // Mark all loaded groups as offline until a WebSocket reconnects
        room.groups = (room.groups || []).map((g) => ({ ...g, isLive: false }));
        room.milestones = room.milestones || [];
        rooms.set(code, room);
      }
    }
  } catch (err) {
    console.error('Failed to load classrooms state:', err);
  }
}

let saveTimer: NodeJS.Timeout | null = null;
function schedulePersistRooms(): void {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const obj: Record<string, ClassroomRoomState> = {};
      for (const [k, v] of rooms.entries()) {
        obj[k] = v;
      }
      const tmpPath = `${DATA_FILE}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(obj, null, 2), 'utf-8');
      fs.renameSync(tmpPath, DATA_FILE);
    } catch (err) {
      console.error('Failed to persist classrooms state:', err);
    }
  }, 400);
}

function getOrCreateRoom(code: string): ClassroomRoomState {
  const normalized = normalizeRoomCode(code);
  let room = rooms.get(normalized);
  if (!room) {
    room = {
      roomCode: normalized,
      createdAt: Date.now(),
      groups: [],
      milestones: [],
    };
    rooms.set(normalized, room);
    schedulePersistRooms();
  }
  return room;
}

loadRoomsFromDisk();
// Ensure default classroom exists
getOrCreateRoom('EARTH-101');

interface ClientMeta {
  ws: WebSocket;
  roomCode: string;
  groupId: string;
}

const roomClients = new Map<string, Set<ClientMeta>>();

function broadcastRoomState(roomCode: string): void {
  const room = getOrCreateRoom(roomCode);
  const clients = roomClients.get(roomCode);
  if (!clients || clients.size === 0) return;

  const payload = JSON.stringify({
    type: 'room:state',
    room,
  });

  for (const client of clients) {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(payload);
    }
  }
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, rooms: rooms.size });
  });

  app.get('/api/rooms/:roomCode', (req, res) => {
    const room = getOrCreateRoom(req.params.roomCode);
    res.json(room);
  });

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const reqUrl = new URL(req.url || '/ws', `http://localhost:${PORT}`);
    let currentRoomCode = normalizeRoomCode(reqUrl.searchParams.get('room') || 'EARTH-101');
    let currentGroupId = (reqUrl.searchParams.get('groupId') || '').slice(0, 64);

    const meta: ClientMeta = {
      ws,
      roomCode: currentRoomCode,
      groupId: currentGroupId,
    };

    const joinRoom = (nextCode: string, nextGroupId: string) => {
      // Leave previous room set
      const prevSet = roomClients.get(currentRoomCode);
      if (prevSet) {
        prevSet.delete(meta);
        const prevRoom = rooms.get(currentRoomCode);
        if (prevRoom && currentGroupId) {
          const stillConnected = Array.from(prevSet).some((c) => c.groupId === currentGroupId);
          if (!stillConnected) {
            prevRoom.groups = prevRoom.groups.map((g) =>
              g.id === currentGroupId ? { ...g, isLive: false } : g
            );
            broadcastRoomState(currentRoomCode);
          }
        }
      }

      currentRoomCode = normalizeRoomCode(nextCode);
      currentGroupId = nextGroupId.slice(0, 64);
      meta.roomCode = currentRoomCode;
      meta.groupId = currentGroupId;

      let set = roomClients.get(currentRoomCode);
      if (!set) {
        set = new Set();
        roomClients.set(currentRoomCode, set);
      }
      set.add(meta);

      const room = getOrCreateRoom(currentRoomCode);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'room:state', room }));
      }
    };

    joinRoom(currentRoomCode, currentGroupId);

    ws.on('message', (rawData) => {
      try {
        const msg = JSON.parse(rawData.toString()) as {
          type: string;
          roomCode?: string;
          groupId?: string;
          snapshot?: GroupSnapshot;
          milestone?: GroupSnapshot;
        };

        if (msg.type === 'room:join' && msg.roomCode) {
          joinRoom(msg.roomCode, msg.groupId || currentGroupId);
          return;
        }

        if (msg.type === 'group:update' && msg.snapshot) {
          const snap = msg.snapshot;
          if (!snap.id || !snap.groupName) return;
          currentGroupId = snap.id;
          meta.groupId = snap.id;

          const room = getOrCreateRoom(currentRoomCode);
          const cleanSnap: GroupSnapshot = {
            ...snap,
            groupName: snap.groupName.trim().slice(0, 48),
            studentNames: (snap.studentNames || '').trim().slice(0, 96),
            updatedAt: Date.now(),
            isLive: true,
          };

          const idx = room.groups.findIndex((g) => g.id === cleanSnap.id);
          if (idx >= 0) {
            room.groups[idx] = cleanSnap;
          } else {
            room.groups.push(cleanSnap);
          }
          schedulePersistRooms();
          broadcastRoomState(currentRoomCode);
          return;
        }

        if (msg.type === 'milestone:save' && msg.milestone) {
          const m = msg.milestone;
          if (!m.id || !m.groupName) return;
          const room = getOrCreateRoom(currentRoomCode);
          const milestoneEntry: GroupSnapshot = {
            ...m,
            id: `${m.id}_${Date.now()}`,
            groupName: m.groupName.trim().slice(0, 48),
            studentNames: (m.studentNames || '').trim().slice(0, 96),
            updatedAt: Date.now(),
            isLive: true,
            lockedMilestone: true,
          };
          room.milestones = [milestoneEntry, ...room.milestones].slice(0, 60);
          schedulePersistRooms();
          broadcastRoomState(currentRoomCode);
          return;
        }

        if (msg.type === 'milestone:delete' && msg.groupId) {
          const room = getOrCreateRoom(currentRoomCode);
          room.milestones = room.milestones.filter((m) => m.id !== msg.groupId);
          schedulePersistRooms();
          broadcastRoomState(currentRoomCode);
        }
      } catch (err) {
        console.error('Invalid WS message:', err);
      }
    });

    ws.on('close', () => {
      const set = roomClients.get(currentRoomCode);
      if (set) {
        set.delete(meta);
        const room = rooms.get(currentRoomCode);
        if (room && currentGroupId) {
          const stillConnected = Array.from(set).some((c) => c.groupId === currentGroupId);
          if (!stillConnected) {
            room.groups = room.groups.map((g) =>
              g.id === currentGroupId ? { ...g, isLive: false } : g
            );
            schedulePersistRooms();
            broadcastRoomState(currentRoomCode);
          }
        }
      }
    });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`TerraFlux server listening on http://localhost:${PORT}`);
  });
}

startServer();
