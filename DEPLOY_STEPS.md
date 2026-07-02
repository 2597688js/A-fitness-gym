# 🚀 Vercel Deployment Guide - Step by Step

## Prerequisites
- ✅ Code is locally committed to git
- ✅ GitHub account (janarddan)
- ✅ Vercel account (sign in with GitHub)
- Need to create: Supabase account, Cloudinary account

---

## STEP 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `gym-web-app`
3. Description: "Full-stack gym management app with React, Express, PostgreSQL"
4. Make it **Public** (for free Vercel deployment)
5. Click **Create repository**

---

## STEP 2: Push Code to GitHub

Run these commands in your terminal:

```bash
cd "/Users/janarddan/1.jana files/3.MyMacProjects/gym-web-app"

# Add GitHub remote
git remote add origin https://github.com/janarddan/gym-web-app.git
git branch -M main
git push -u origin main
```

**Note:** You may be prompted for GitHub authentication. Use your GitHub password or a Personal Access Token.

---

## STEP 3: Create Supabase Project

1. Go to https://supabase.com and sign up with GitHub
2. Click **New Project**
3. Fill in:
   - Organization: (default)
   - Project name: `gym-app`
   - Password: (save this - you'll need it!)
   - Region: Select closest to you
4. Click **Create new project** (wait 2-3 minutes)
5. Go to **Settings** → **Database** → **Connection String**
6. Copy the PostgreSQL URI (looks like: `postgresql://postgres:PASSWORD@HOST:5432/postgres`)
7. **Save this** - you'll need it for Vercel

---

## STEP 4: Set Up Cloudinary

1. Go to https://cloudinary.com and sign up (free)
2. Go to Dashboard
3. Copy these 3 values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
4. **Save all three** - you'll need them for Vercel

---

## STEP 5: Deploy Backend to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **Add New** → **Project**
3. Find and import `gym-web-app` repository
4. Configure:
   - **Project Name:** `gym-api` (or `gym-web-app-api`)
   - **Framework:** Other
   - **Root Directory:** `backend` ← **IMPORTANT!**
5. Click **Deploy** (you'll see errors about missing env vars - that's OK)

### Add Environment Variables

Before deployment completes, click **Environment Variables** and add:

```
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/postgres?schema=public
JWT_SECRET=your_super_secret_key_here_minimum_32_characters
RAZORPAY_KEY_ID=rzp_test_dummy_key_for_testing
RAZORPAY_KEY_SECRET=dummy_secret_for_testing
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://gym-app.vercel.app
PORT=3000
NODE_ENV=production
```

**Replace with real values** from Supabase and Cloudinary

5. Click **Deploy**
6. Wait for deployment to complete
7. Note your backend URL: `https://gym-api.vercel.app` (or whatever Vercel shows)

---

## STEP 6: Run Database Migrations

Your Vercel build automatically runs migrations, but verify:

1. Go to backend deployment on Vercel
2. Click **Deployments** → view latest
3. Check logs for: `✓ Prisma migrations applied`

---

## STEP 7: Deploy Frontend to Vercel

1. Back on Vercel dashboard, click **Add New** → **Project**
2. Import `gym-web-app` repository again
3. Configure:
   - **Project Name:** `gym-app` (or `gym-web-app`)
   - **Framework:** Vite
   - **Root Directory:** `frontend` ← **IMPORTANT!**
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Add Environment Variables:
```
VITE_API_URL=https://gym-api.vercel.app
```

(Use your actual backend URL from Step 5)

5. Click **Deploy**
6. Wait for deployment to complete
7. Note your frontend URL: `https://gym-app.vercel.app`

---

## STEP 8: Update Backend CORS

1. Go back to your **backend project** on Vercel
2. Click **Settings** → **Environment Variables**
3. Find `FRONTEND_URL` and update it to your frontend URL
4. Click **Save**
5. Click **Deployments** → **Redeploy** on the latest deployment

---

## STEP 9: Test Live App

1. Open your frontend URL: `https://gym-app.vercel.app`
2. Test admin login:
   - Email: `admin@afitnessgyam.com`
   - Password: `admin123`
3. Test member login:
   - Email: `john@example.com`
   - Password: `john123`
4. Try uploading to gallery (with real Cloudinary credentials)

---

## 🎉 DONE!

Your app is now live on Vercel!

### Summary of URLs:
- **Frontend:** https://gym-app.vercel.app
- **Backend API:** https://gym-api.vercel.app
- **Database:** Supabase PostgreSQL
- **Files:** Cloudinary

---

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is correct in Vercel env vars
- Verify Supabase project is running
- Check network access is allowed

### "Build failed"
- Check Vercel logs for specific error
- Ensure root directory is set to `backend` or `frontend`
- Check Node version compatibility

### "CORS errors"
- Update FRONTEND_URL in backend env vars
- Wait 1 minute for Vercel to redeploy
- Clear browser cache

### "Gallery upload fails"
- Verify Cloudinary credentials are correct
- Check file size < 100MB
- Check Cloudinary API is working

---

Good luck! 🚀
