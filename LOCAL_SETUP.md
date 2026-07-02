# 🔧 Local Development Setup

Guide to set up the PostgreSQL + Vercel version locally for development.

## Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (via Supabase local or local Postgres)
- GitHub account (for Vercel deployment)

## Quick Start (3 steps)

### 1. Install Dependencies

```bash
cd gym-web-app

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Setup Local Database (Option A: Supabase Local)

**Option A: Use Supabase local stack** (recommended)

```bash
cd backend

# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# This outputs connection string - copy it
# Copy the output that looks like:
# postgresql://postgres:password@localhost:54321/postgres

# Create .env file and set DATABASE_URL
echo "DATABASE_URL=postgresql://postgres:password@localhost:54321/postgres" > .env

# Then add other env vars (see .env.example)
```

**Option B: Use local Postgres**

```bash
# Install PostgreSQL locally (macOS)
brew install postgresql

# Start Postgres
brew services start postgresql

# Create database
createdb gym_app

# Get connection string
DATABASE_URL="postgresql://$(whoami)@localhost/gym_app"
echo "DATABASE_URL=$DATABASE_URL" > .env
```

### 3. Initialize Database & Start Servers

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# Start backend
npm run dev

# In another terminal, start frontend
cd frontend
npm run dev
```

Visit: http://localhost:5173

---

## Environment Variables

### Backend `.env`

```env
DATABASE_URL=postgresql://...your-connection-string...
JWT_SECRET=dev_secret_key_change_in_production
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

### Frontend `.env.development` (already exists)

```env
VITE_API_URL=http://localhost:5000
```

---

## Testing Locally

### 1. Test Backend

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login with demo user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "john123"
  }'
```

### 2. Test Frontend

1. Open http://localhost:5173
2. Home page should load
3. Click "Join" → Register new account
4. Click "Login" → Login with credentials
5. Access member dashboard

### 3. Test Admin Features

1. Go to http://localhost:5173/admin/login
2. Login with: `admin@afitnessgyam.com` / `admin123`
3. Go to Gallery
4. Upload an image/video
5. Should appear in gallery with Cloudinary URL

---

## Database Management

### View Database Directly

```bash
# Using Prisma Studio (interactive UI)
npx prisma studio

# Opens: http://localhost:5555

# Using psql (command line)
psql postgresql://...your-connection-string...

# Common commands:
\dt              # List tables
SELECT * FROM "User";
SELECT * FROM "Membership";
SELECT * FROM "GalleryItem";
\q              # Exit
```

### Run Migrations

```bash
# Create new migration
npx prisma migrate dev --name describe_your_change

# Deploy migrations (production)
npx prisma migrate deploy

# Reset database (caution: deletes all data)
npx prisma migrate reset
```

---

## Common Issues

### "database does not exist"
```bash
createdb gym_app
# Then re-run migrations
npx prisma migrate dev
```

### "connect ECONNREFUSED" (no database)
- Check Postgres is running: `brew services list`
- Or check Supabase local is running: `supabase status`

### "Cannot find module @prisma/client"
```bash
npx prisma generate
npm install
```

### Gallery uploads fail
- Verify Cloudinary keys in `.env`
- Test on Cloudinary dashboard first

### CORS errors
- Check `FRONTEND_URL` in backend `.env`
- Make sure frontend is at `http://localhost:5173`
- Restart backend if you changed `.env`

---

## Development Workflow

### Typical Development Session

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev

# Terminal 3: Database (if using Supabase local)
supabase status

# Terminal 4: Prisma Studio (optional)
npx prisma studio
```

### Schema Changes

When you need to change the database schema:

1. Edit `backend/prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name your_change_name`
3. Prisma will:
   - Create migration file
   - Run migration against database
   - Regenerate Prisma client
4. Restart backend if needed

Example:

```prisma
// Add a new field to User model
model User {
  // ... existing fields ...
  bio       String?    // New field
}
```

Then:

```bash
npx prisma migrate dev --name add_user_bio
```

---

## Debugging

### Enable Logging

Add to backend `.env`:

```env
DEBUG=*
```

Or specific modules:

```env
DEBUG=express:*,prisma:*
```

### Check Logs

```bash
# Backend logs (in terminal where you ran npm run dev)
# Frontend logs (in terminal where you ran npm run dev)
# Database logs (if using Supabase local)
supabase logs --tail
```

### Database Query Logging

Add to `backend/lib/prisma.js`:

```js
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

---

## Before Committing

```bash
# Check frontend
cd frontend
npm run lint
npm run build

# Check backend
cd backend
npm run build  # (just generates Prisma client)

# Type check (if available)
npx tsc --noEmit
```

---

## Deploying Your Changes

When ready to deploy to Vercel:

1. Commit your code: `git commit -am "..."`
2. Push to GitHub: `git push`
3. Vercel will auto-deploy both frontend and backend
4. Supabase migrations run automatically via Vercel build step

No manual database migration needed — Vercel handles it.

---

## Reset Everything (Nuclear Option)

If you want to start completely fresh:

```bash
# Stop all servers (Ctrl+C in terminals)

# Reset Supabase local
supabase stop
supabase db reset

# Or reset local Postgres
dropdb gym_app
createdb gym_app

# Reinit database
cd backend
npx prisma migrate dev --name init

# Restart servers
npm run dev  # Terminal 1 (backend)
cd ../frontend && npm run dev  # Terminal 2 (frontend)
```

---

Done! You're set up for local development. 🎉
