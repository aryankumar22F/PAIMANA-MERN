# Mini PAIMANA — Project Monitoring Platform (SIH PS 26103)

MERN stack starter for the SIH problem statement: *"Use case on web-based
Integrated Project-Monitoring platform"* (MoSPI / PAIMANA).

## Structure
```
PAIMANA-MERN/
├── backend/     Express + MongoDB API
└── frontend/    React + Vite dashboard
```

## Backend Setup
```bash
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET if needed
npm run seed               # loads 10 realistic sample projects + 2 users
npm run dev                # starts server on http://localhost:5000
```

Demo login (created by seed script):
- **Admin:** admin@paimana.gov.in / admin123
- **Ministry:** morth@paimana.gov.in / morth123

## Frontend Setup
```bash
cd frontend
npm install
npm run dev                # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`,
so run the backend first.

## What's already built
**Backend**
- Project CRUD API with filters (ministry/sector/status/search)
- Auth (JWT) with role-based access (Admin / Ministry / Viewer)
- Auto risk-score + status calculation (On Track / Cost Overrun / Delayed / Critical / Completed)
- Analytics summary endpoint for dashboard charts
- Seed script with 10 realistic infrastructure projects across sectors

**Frontend**
- Dashboard: total cost, expenditure %, cost-overrun %, at-risk count, pie + bar charts
- Project list with search + status filter
- Project detail page: risk score, cost overrun %, timeline, progress bar
- Login page (JWT stored in localStorage)

## Suggested next steps for your team
1. Add a **map view** (Leaflet.js) using each project's lat/lng — PAIMANA itself
   uses geospatial mapping, so this is a strong differentiator for judges.
2. Add **CSV/Excel bulk import** for projects (reflects PAIMANA's "One Data
   One Entry" concept — reduces manual entry).
3. Have your ML teammate replace `backend/utils/riskCalculator.js` with a
   trained model (or call a Python microservice) for smarter risk prediction.
4. Add milestone tracking UI (the `Milestone` model is already scaffolded).
5. Deploy: backend → Render/Railway, frontend → Vercel/Netlify, DB → MongoDB Atlas.

## Real PAIMANA reference data (for your PPT / pitch)
- Monitors ~1,987 Central Sector projects worth ₹42.5 lakh crore (as of May 2026)
- Replaced OCMS-2006; integrated with DPIIT's IPMP via APIs ("One Data One Entry")
- Transport & Logistics is the largest sector by project count
- 41% of projects have crossed 80% physical progress; 14% crossed 80% financial completion
