# 🚀 Deploy to Vercel (PostgreSQL + Serverless)

Complete guide to deploy your full-stack gym app to Vercel with PostgreSQL database.

## Architecture

```
Your Domain (vercel.app)
  ├── Frontend (React/Vite)
  ├── API Routes (/api/...) → Serverless Functions
  └── Database → Supabase PostgreSQL
```

**Cost**: Free ($0 for free tiers)

---

## Pre-Requisites

1. ✅ Code pushed to GitHub
2. ✅ Vercel account (sign up with GitHub)
3. ✅ Supabase account (for PostgreSQL)
4. ✅ Cloudinary account (for file storage)

---

## Phase 1: Database Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Sign up with GitHub
3. Click **New Project**
4. Fill in:
   - Organization: (default)
   - Database Name: `gym-app`
   - Password: (auto-generated, copy it)
   - Region: Choose one close to you
5. Click **Create New Project** (wait 2-3 minutes)

### 1.2 Get Database Credentials

1. Open your project → **Settings** → **Database**
2. Find **Connection String** section
3. Copy the URI that looks like:
   ```
   postgresql://postgres:password@host:5432/postgres?schema=public
   ```
4. **Save this string** - you'll need it for Vercel

### 1.3 Set Network Access

1. Go to **Settings** → **Database** → **SSL Certificate**
2. Download the certificate (optional but recommended)
3. Supabase auto-allows all IPs (unlike MongoDB)

---

## Phase 2: Cloudinary Setup (if not already done)

1. Go to https://cloudinary.com
2. Sign up
3. Dashboard → Copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
4. **Save all three**

---

## Phase 3: Deploy Backend to Vercel

### Step 1: Connect Backend Repo

1. Go to https://vercel.com/dashboard
2. Click **Add New...** → **Project**
3. Select your GitHub repository
4. Click **Import**

### Step 2: Configure Project

- **Project Name**: `gym-api` (or `gym-app-api`)
- **Framework Preset**: Other
- **Root Directory**: `backend`

### Step 3: Add Environment Variables

Click **Environment Variables** and add all of these:

```
DATABASE_URL=postgresql://postgres:password@host:5432/postgres?schema=public
JWT_SECRET=your_super_secret_key_here_at_least_32_chars
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://your-domain.vercel.app
PORT=3000
NODE_ENV=production
```

**Important**: Replace with actual values from your accounts.

### Step 4: Build & Deploy

1. Click **Deploy**
2. Vercel will:
   - Install dependencies
   - Run `npx prisma generate`
   - Run migrations automatically
   - Start serverless functions
3. Wait for **✓ Deployment Complete**
4. Copy your backend URL (e.g., `https://gym-api.vercel.app`)

### Step 5: Test Backend

```bash
curl https://gym-api.vercel.app/api/health
```

Should return: `{"status":"ok"}`

---

## Phase 4: Deploy Frontend to Vercel

### Step 1: Create New Project

1. https://vercel.com/dashboard
2. Click **Add New...** → **Project**
3. Select your GitHub repo again (or create new if split)
4. Click **Import**

### Step 2: Configure Frontend

- **Project Name**: `gym-app`
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Add Environment Variables

```
VITE_API_URL=https://gym-api.vercel.app
```

(Replace with your actual backend URL from Phase 3, Step 4)

### Step 4: Deploy

1. Click **Deploy**
2. Wait for **✓ Deployment Complete**
3. Copy your frontend URL (e.g., `https://gym-app.vercel.app`)

---

## Phase 5: Update Backend CORS

1. Go back to backend project on Vercel
2. Settings → **Environment Variables**
3. Find `FRONTEND_URL` and update it to your frontend URL from Phase 4
4. Click **Save**
5. Click **Redeploy** to apply changes

---

## Testing the Deployment

### Test 1: Public Pages
```bash
# Home page
curl https://gym-app.vercel.app/

# API health check
curl https://gym-app.vercel.app/api/health
```

### Test 2: Registration
```bash
curl -X POST https://gym-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test 3: Login
```bash
curl -X POST https://gym-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "john123"
  }'
```

### Test 4: Gallery Upload
1. Open https://gym-app.vercel.app
2. Login as admin: `admin@afitnessgyam.com` / `admin123`
3. Go to Admin → Gallery
4. Upload an image
5. Verify it appears with Cloudinary URL

---

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL in Vercel env vars
- Verify Supabase project is running
- Try connecting locally: `psql <CONNECTION_STRING>`

### "Prisma migration failed"
- Run locally: `npx prisma migrate deploy`
- Fix any migration errors
- Check Vercel logs: Project → Deployments → View logs

### "Cloudinary upload fails"
- Verify keys in Vercel env vars
- Test on Cloudinary dashboard
- Check file size < 100MB

### "CORS errors"
- Verify FRONTEND_URL is set in backend env vars
- Check frontend is actually on that URL
- Wait 1 minute for Vercel to redeploy

### "Seeds not running"
- Database must be empty first
- Delete and recreate Supabase project if needed
- Or manually run: `npx prisma db seed`

---

## Demo Credentials

```
Member:
  Email: john@example.com
  Password: john123

Admin:
  Email: admin@afitnessgyam.com
  Password: admin123
```

Or create new accounts via /join page.

---

## Custom Domain (Optional)

### Add to Vercel

1. Project Settings → **Domains**
2. Add your domain (e.g., `myapp.com`)
3. Follow DNS setup instructions
4. Wait for **✓ Verified**

### Update Both Apps

If using custom domain for both:
- Update `FRONTEND_URL` in backend env vars to `https://myapp.com`
- Update `VITE_API_URL` in frontend env vars to `https://myapp.com`
- Redeploy both

---

## Scaling (Next Steps)

### If Hitting Supabase Free Tier Limits

Supabase Free: 500MB storage, 2GB bandwidth/month

Upgrade to PostgreSQL paid tier (~$50/month)

### If Hitting Vercel Free Tier Limits

Vercel Free: 100GB bandwidth/month

Upgrade to Pro (~$20/month) or Scale-to-Zero (~$5/month + usage)

### If Hitting Cloudinary Free Tier Limits

Cloudinary Free: 25GB bandwidth/month, 25GB storage

Upgrade to Cloudinary paid plan

---

## Monitoring

### Vercel Logs
- Project → **Deployments** → click latest → **View Function Logs**
- See real-time errors and requests

### Supabase Logs
- Project → **Logs** → **Functions** or **Database**
- Monitor query performance and errors

### Error Tracking
Consider adding Sentry (free tier available):
1. Sign up at https://sentry.io
2. Create project for Node.js
3. Add `npm install @sentry/node`
4. Wrap Express app with Sentry middleware

---

## Success Checklist

- ✅ Vercel shows both projects deployed
- ✅ Frontend loads at your URL
- ✅ API health check returns 200
- ✅ Can register/login with test account
- ✅ Data persists after page reload
- ✅ Gallery uploads work (Cloudinary URL visible)
- ✅ Admin can see members in database
- ✅ Restart Vercel function → data still there

**Done! Your app is live.** 🎉
