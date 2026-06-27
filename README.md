# Vedasampatti

Premium heritage portal for preserving Vedic wisdom — connecting scholars, pathasalas, and devotees across India.

## Tech stack

- React 18 + Vite 6
- React Router
- TanStack Query
- Tailwind CSS + shadcn/ui
- Framer Motion

## Local setup

```bash
git clone https://github.com/abhinaymalyala15/vedasampathi.git
cd vedasampathi
npm install
```

Create `.env.local`:

```env
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
npm run preview
```

## Project structure

- `src/components/home/` — Homepage sections (hero, directories, knowledge, donate)
- `src/pages/static/` — Vedic content pages (Vedas, Mantras, Gallery, etc.)
- `public/` — Heritage images and assets
- `src/lib/templeAssets.js` — Central image path config

## Base44 integration

This project syncs with [Base44](https://Base44.com). Push changes to GitHub to reflect them in the Base44 Builder.

Docs: [Using GitHub with Base44](https://docs.base44.com/Integrations/Using-GitHub)
