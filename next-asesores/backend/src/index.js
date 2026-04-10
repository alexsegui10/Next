require('dotenv').config();
const express = require('express');
const cors = require('cors');
const webhookRoutes = require('./routes/webhook.routes');

const app = express();
const PORT = process.env.PORT || 3002;

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (origin.endsWith('.vercel.app')) return true;
  if (origin === 'http://localhost:5174') return true;
  if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return true;
  return false;
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-webhook-secret'],
  })
);

app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'next-asesores-api' }));

app.use('/webhook', webhookRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

app.use((err, _req, res, _next) => {
  console.error('[server] Error:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Next Asesores API running on port ${PORT}`);
});
