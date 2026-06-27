import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb, db, uploadsDir } from './db.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import scholarRoutes from './routes/scholar.js';
import pathasalaRoutes from './routes/pathasala.js';
import adminRoutes from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8001;

initDb();

if (db.count('users', () => true) === 0) {
  console.log('Empty database — run: npm run seed');
}

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'vedasampatti-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/scholar', scholarRoutes);
app.use('/api/pathasala', pathasalaRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Vedasampatti API running at http://localhost:${PORT}/api`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
