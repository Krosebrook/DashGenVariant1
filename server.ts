import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

// Connection Manager for efficient resource usage
class ConnectionManager {
  private static pgPools: Map<string, pg.Pool> = new Map();
  private static mongoClients: Map<string, MongoClient> = new Map();

  static async getPgPool(connectionString: string): Promise<pg.Pool> {
    if (!this.pgPools.has(connectionString)) {
      const pool = new pg.Pool({ connectionString });
      this.pgPools.set(connectionString, pool);
    }
    return this.pgPools.get(connectionString)!;
  }

  static async getMongoClient(connectionString: string): Promise<MongoClient> {
    if (!this.mongoClients.has(connectionString)) {
      const client = new MongoClient(connectionString);
      await client.connect();
      this.mongoClients.set(connectionString, client);
    }
    return this.mongoClients.get(connectionString)!;
  }
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize DB
async function initDB() {
  if (!process.env.DATABASE_URL) {
    console.log('No DATABASE_URL provided. Skipping DB initialization.');
    return;
  }
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dashboards (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        spec JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized.');
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
}

initDB();

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  if (!process.env.DATABASE_URL) return res.status(500).json({ error: 'Database not configured' });
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  if (!process.env.DATABASE_URL) return res.status(500).json({ error: 'Database not configured' });
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/auth/me', authenticateToken, (req: any, res: any) => {
  res.json({ user: req.user });
});

// Dashboard Routes
app.get('/api/dashboards', authenticateToken, async (req: any, res: any) => {
  if (!process.env.DATABASE_URL) return res.status(500).json({ error: 'Database not configured' });
  try {
    const result = await pool.query('SELECT id, spec, created_at, updated_at FROM dashboards WHERE user_id = $1 ORDER BY updated_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/dashboards', authenticateToken, async (req: any, res: any) => {
  if (!process.env.DATABASE_URL) return res.status(500).json({ error: 'Database not configured' });
  const { spec } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO dashboards (user_id, spec) VALUES ($1, $2) RETURNING id',
      [req.user.id, spec]
    );
    res.json({ id: result.rows[0].id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/dashboards/:id', authenticateToken, async (req: any, res: any) => {
  if (!process.env.DATABASE_URL) return res.status(500).json({ error: 'Database not configured' });
  const { id } = req.params;
  const { spec } = req.body;
  try {
    await pool.query(
      'UPDATE dashboards SET spec = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3',
      [spec, id, req.user.id]
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/dashboards/:id', authenticateToken, async (req: any, res: any) => {
  if (!process.env.DATABASE_URL) return res.status(500).json({ error: 'Database not configured' });
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM dashboards WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Postgres Query Route
app.post('/api/data/postgres', async (req: any, res: any) => {
  const { connectionString, query } = req.body;
  if (!connectionString || !query) {
    return res.status(400).json({ error: 'Missing connectionString or query' });
  }
  
  try {
    const pool = await ConnectionManager.getPgPool(connectionString);
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// MongoDB Query Route
app.post('/api/data/mongodb', async (req: any, res: any) => {
  const { connectionString, collection, query } = req.body;
  if (!connectionString || !collection) {
    return res.status(400).json({ error: 'Missing connectionString or collection' });
  }
  
  try {
    const client = await ConnectionManager.getMongoClient(connectionString);
    const db = client.db();
    const parsedQuery = query ? JSON.parse(query) : {};
    const result = await db.collection(collection).find(parsedQuery).toArray();
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
