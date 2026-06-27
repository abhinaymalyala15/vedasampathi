# Vedasampatti

Premium heritage portal for preserving Vedic wisdom — connecting scholars, pathasalas, and devotees across India.

## Tech stack

- **Frontend:** React 18 + Vite 6, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Node.js Express API (`/api`) with JSON file storage

## Quick start

### 1. Install dependencies

```bash
npm install
cd api && npm install && cd ..
```

### 2. Seed the database (first time only)

```bash
cd api && npm run seed && cd ..
```

### 3. Configure environment

```env
# .env.local or .env
VITE_API_BASE_URL=http://localhost:8001/api
```

> Port **8001** is used because 8000 may be occupied by other local apps.

### 4. Run both servers

**Terminal 1 — API:**
```bash
cd api && npm run dev
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Demo accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vedasampatti.org | Admin@123 |
| Scholar | scholar@vedasampatti.org | Scholar@123 |
| Pathasala | pathasala@vedasampatti.org | Pathasala@123 |

## What's implemented

### Phase 1 — Backend API
- Auth (login, register, OTP, logout, forgot/reset password)
- Public scholars, pathasalas, events
- Donations & contact forms
- File uploads
- Admin dashboard, approvals, events, CMS, users, donations
- Pathasala portal API

### Phase 2 — Frontend logic
- Scholar portal (profile, qualifications, experience, documents, events, settings)
- Role-based route guards (admin / scholar / pathasala)
- Navbar auth menu with portal link & logout

## Deploy

**Frontend (Vercel):** set `VITE_API_BASE_URL=https://your-api-domain.com/api`

**API:** deploy the `api/` folder to Railway, Render, or VPS. Set `PORT`, `JWT_SECRET`, `CORS_ORIGIN`, and `API_PUBLIC_URL`.

## Project structure

```
api/                 Express REST API
src/api/apiClient.js Frontend API client
src/pages/scholar/   Scholar portal (wired to API)
src/pages/admin/     Admin panel
src/pages/pathasala/ Pathasala portal
public/              Static images
```
