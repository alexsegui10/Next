# Next Asesores & Abogados — Web de citas

Web de contacto y reserva de citas para Next Asesores & Abogados (Ontinyent).

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + React Query + Tailwind CSS |
| Backend | Node.js + Express |
| Base de datos | Supabase (tabla `citas_asesoria`) |
| Llamadas y post-cita | OpenClaw (VPS — mismo que taller) |
| Deploy | VPS existente |

---

## Arrancar en local

### Backend

```bash
cd backend
npm install
cp .env.example .env   # rellenar variables
npm run dev            # puerto 3002
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # rellenar variables
npm run dev            # puerto 5174
```

---

## Variables de entorno pendientes de rellenar

### `backend/.env`

| Variable | Descripción |
|---|---|
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (no la anon key) |
| `OPENCLAW_ASESORIA_WEBHOOK_URL` | URL del webhook OpenClaw para asesoría |
| `WEBHOOK_ASESORIA_SECRET` | Secreto opcional para cabecera `x-webhook-secret` |
| `FRONTEND_URL` | URL del frontend en producción (para CORS) |

### `frontend/.env`

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL del backend (`http://localhost:3002` en local) |
| `VITE_GOOGLE_CALENDAR_EMBED_URL` | URL del embed de Google Calendar (ver abajo) |

---

## Cómo obtener la URL del embed de Google Calendar

1. Abre Google Calendar con `alexsegui10@gmail.com`
2. Configuración → nombre del calendario → **Integrar calendario**
3. Copia la URL del **iframe** (empieza por `https://calendar.google.com/calendar/embed?src=...`)
4. Pégala en `VITE_GOOGLE_CALENDAR_EMBED_URL`

---

## Supabase — crear tabla

Ejecuta el SQL en **Supabase → SQL Editor**:

```
supabase/migrations/001_citas_asesoria.sql
```

---

## Flujo de una cita confirmada

```
Frontend POST /webhook/asesoria
  └─► Guardar en Supabase (citas_asesoria)
  └─► Reenviar a OpenClaw (VPS)
        └─► Retell lanza llamada al cliente
        └─► Al colgar → crear evento Google Calendar
        └─► Enviar WhatsApp al asesor
```

---

## Estructura

```
next-asesores/
├── backend/
│   ├── src/
│   │   ├── controllers/webhook.controller.js  ← valida, guarda, llama a OpenClaw
│   │   ├── routes/webhook.routes.js           ← POST /webhook/asesoria
│   │   ├── services/
│   │   │   ├── supabase.service.js            ← guarda cita en Supabase
│   │   │   └── openclaw.service.js            ← reenvía a OpenClaw
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx   ← único, compartido
│   │   │   └── Footer.jsx   ← único, compartido
│   │   ├── hooks/useCita.js ← React Query mutation
│   │   ├── pages/
│   │   │   ├── Contacto.jsx   ← /contacto
│   │   │   └── Calendario.jsx ← /calendario
│   │   └── App.jsx
│   ├── .env.example
│   └── package.json
└── supabase/
    └── migrations/001_citas_asesoria.sql
```
