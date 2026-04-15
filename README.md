# Portfolio with Admin Panel

A professional portfolio website with a full admin panel. Built with React, TypeScript, TailwindCSS, Three.js (3D animations), and Express.

## Features
- **3D animated hero section** — Three.js starfield, wireframe geometries, glowing particles
- **Floating profile photo** — Glassmorphism effect with rotating gradient border and orbital rings
- **Typing animation** for job title
- **Sections**: About, Skills (animated progress bars), Experience timeline, Education, Projects, Contact
- **Admin panel** at `/admin` with full CRUD for all sections
- **Media upload** — Profile photo (JPEG/PNG/WEBP up to 5 MB) and CV (PDF up to 10 MB)
- **No database required** — data stored as JSON file

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, Framer Motion, Three.js |
| Backend | Node.js, Express, TypeScript |
| Storage | JSON file (no database) |
| Auth | JWT (24h expiry) |

## Local Development

```bash
# 1. Install all dependencies
npm run install:all

# 2. Copy environment file
copy .env.example backend/.env

# 3. Start both servers (hot-reload)
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Admin panel**: http://localhost:5173/admin
- **Default password**: `Admin@123`

## Deploy on Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Render auto-detects `render.yaml`. Review and click **Deploy**
5. Set environment variables in the Render dashboard:
   - `ADMIN_PASSWORD` — your admin password
   - `JWT_SECRET` — a strong random secret (Render can generate this)
   - `FRONTEND_URL` — your Render app URL (e.g. `https://portfolio.onrender.com`)

### Manual setup (if not using render.yaml)
| Setting | Value |
|---------|-------|
| Environment | Node |
| Build Command | `npm run install:all && npm run build` |
| Start Command | `npm start` |

## Admin Panel

Navigate to `/admin/login` to access the admin panel.

| Section | What you can edit |
|---------|-------------------|
| Profile | Name, title, bio, email, phone, location, social links |
| Skills | Add / edit / delete skills with level (%), category, icon |
| Experience | Work history with company, position, dates, tech tags |
| Education | Academic background |
| Projects | Portfolio projects with links |
| Media | Profile photo upload + CV (PDF) upload |

## Project Structure

```
portfolio/
├── backend/             # Express API
│   ├── data/
│   │   └── portfolio.json   # All portfolio data stored here
│   └── src/
│       ├── index.ts         # Server entry point
│       ├── middleware/auth.ts
│       └── routes/
│           ├── auth.ts
│           ├── portfolio.ts
│           └── upload.ts
├── frontend/            # React SPA
│   └── src/
│       ├── components/  # All UI components
│       ├── pages/       # Portfolio, Login, Admin
│       ├── context/     # Auth context
│       ├── hooks/       # usePortfolio
│       └── types/       # TypeScript types
├── render.yaml          # Render deployment config
└── package.json         # Root scripts
```

## Notes
- On Render's free tier, the filesystem is **ephemeral**. Portfolio changes made via the admin panel persist until the service restarts. For permanent edits, modify `backend/data/portfolio.json` and redeploy.
- For truly persistent storage, upgrade to Render's paid tier with a persistent disk, or attach a MongoDB database.
