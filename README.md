# A Fitness Gym

Full-stack gym management platform with member registration, membership plans, and admin dashboard.

**Tech Stack:** Node.js + Express (backend), React + Vite (frontend), PostgreSQL (database), Razorpay (payments)

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Quick Start

### 1. Clone and Install

```bash
git clone <repo-url>
cd gym-web-app

# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. Setup Database

```bash
# Create PostgreSQL database
createdb gym_db

# Run migrations
cd backend
npx prisma migrate deploy
```

### 3. Configure Environment

Create `backend/.env`:

```
DATABASE_URL=postgresql://localhost/gym_db
JWT_SECRET=your_secret_key_here
RAZORPAY_KEY_ID=rzp_test_XXXXX
RAZORPAY_KEY_SECRET=XXXXX
FRONTEND_URL=http://localhost:5173
```

Frontend uses http://localhost:5001 (hard-coded) for API requests.

### 4. Run Locally

**Backend** (from `backend/` directory):
```bash
npm start
```
Runs at http://localhost:5001

**Frontend** (from `frontend/` directory):
```bash
npm run dev
```
Runs at http://localhost:5173

## Demo Credentials

- **Admin:** `admin@afitnessgyam.com` / `admin123`
- **Member:** `john@example.com` / `john123`

## Testing

Run Playwright tests:

```bash
cd frontend
npm run test
```

Tests located in `frontend/tests/`:
- `app.spec.ts` — Main app flow tests
- `login.spec.ts` — Authentication tests

## Project Structure

```
backend/
  ├── server.js          Express API server
  ├── prisma/            Database schema & migrations
  └── lib/               Utilities (transcoding, database)

frontend/
  ├── src/
  │   ├── App.jsx        Main component
  │   └── components/    UI components
  ├── tests/             Playwright tests
  └── public/            Static assets
```
