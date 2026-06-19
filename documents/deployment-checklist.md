# IntelliMeet Deployment Checklist

**Platform:** MongoDB Atlas + Railway + Vercel  
**Date:** June 2026  
**Goal:** Step-by-step copy-paste deployment with exact env var values

---

## Phase 1: MongoDB Atlas Setup

### Step 1a: Create a MongoDB Atlas Account
- Go to https://www.mongodb.com/cloud/atlas
- Sign up or log in
- Create a free cluster

### Step 1b: Create a Database User
1. In Atlas, go to **Database Access**
2. Click **Add New Database User**
3. Set **Username** = `intellimeet`
4. Set **Password** = generate a strong password and save it
5. Grant **readWriteAnyDatabase** role
6. Click **Add User**

### Step 1c: Get Your Connection String
1. Go to **Databases** → your cluster
2. Click **Connect**
3. Choose **Node.js** driver
4. Copy the connection string, it looks like:
   ```
   mongodb+srv://intellimeet:<password>@cluster.mongodb.net/intellimeet?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your database user password
6. **Save this** as your `MONGODB_URI`

### Step 1d: Allow Connections
1. Go to **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (for development)
4. Later, restrict this to Railway's IP range for production
5. Click **Confirm**

---

## Phase 2: Railway Backend Deployment

### Step 2a: Create a Railway Account
- Go to https://railway.app
- Sign up with GitHub
- Grant Railway access to your GitHub account

### Step 2b: Create a New Railway Project
1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Connect your GitHub account if not done
4. Search for and select `jaimingarala/intellimeet`
5. Click **Deploy Now**

### Step 2c: Wait for Initial Build
- Railway will pull the repo and start building
- This takes 2-5 minutes
- Once done, you'll have a service named `intellimeet`

### Step 2d: Configure Environment Variables
In the Railway dashboard, go to your service and click **Variables**.

Add these exact variables with your values:

| Key | Value | Example |
|-----|-------|---------|
| `MONGODB_URI` | Your connection string from Phase 1c | `mongodb+srv://intellimeet:password@cluster.mongodb.net/intellimeet?retryWrites=true&w=majority` |
| `JWT_SECRET` | A long random string (32+ chars) | `your-super-secret-jwt-key-12345678` |
| `JWT_REFRESH_SECRET` | A different long random string | `your-refresh-secret-key-87654321` |
| `NODE_ENV` | `production` | `production` |
| `FRONTEND_URL` | Your future Vercel domain | `https://intellimeet-app.vercel.app` |

**Note:** Generate secrets at https://randomkeygen.com/ (use the "CodeIgniter Encryption Keys" section).

### Step 2e: Save and Redeploy
1. Click **Deploy** or restart the service
2. Watch the logs in **Deployments**
3. Once the service shows as **Running**, get your Railway URL:
   - Click your service
   - Look for the **Public URL** at the top
   - It looks like `https://intellimeet-production.up.railway.app`
   - **Save this** as your `RAILWAY_URL`

### Step 2f: Test the Backend
1. Open your Railway URL in a browser
2. Navigate to `{RAILWAY_URL}/health`
3. You should see: `{ "status": "ok", "service": "api" }`
4. If you get an error, check the logs in Railway and verify env vars are set

---

## Phase 3: Vercel Frontend Deployment

### Step 3a: Create a Vercel Account
- Go to https://vercel.com
- Sign up with GitHub
- Grant Vercel access to your GitHub account

### Step 3b: Import the GitHub Repository
1. Click **Add New** → **Project**
2. Select **Import Git Repository**
3. Search for and select `jaimingarala/intellimeet`
4. Click **Import**

### Step 3c: Configure Build Settings
Vercel should auto-detect the settings from [vercel.json](../vercel.json), but confirm:
- **Framework Preset:** Vite
- **Build Command:** `npm run build -w @intellimeet/web`
- **Output Directory:** `apps/web/dist`
- **Install Command:** `npm install`
- **Root Directory:** ./

### Step 3d: Set Environment Variables
Before deploying, add these environment variables:

| Key | Value |
|-----|-------|
| `VITE_API_BASE` | Your Railway URL (from Step 2e) |
| `VITE_SOCKET_BASE` | Your Railway URL (from Step 2e) |

Example:
- `VITE_API_BASE` = `https://intellimeet-production.up.railway.app`
- `VITE_SOCKET_BASE` = `https://intellimeet-production.up.railway.app`

### Step 3e: Deploy
1. Click **Deploy**
2. Vercel will build the web app (2-3 minutes)
3. Once done, you'll get a Vercel URL like `https://intellimeet-app.vercel.app`
4. **Save this** as your `VERCEL_URL`

### Step 3f: Test the Frontend
1. Open your Vercel URL
2. You should see the IntelliMeet login page
3. If you see a blank page or an error about `VITE_API_BASE`, the build failed; check Vercel logs

---

## Phase 4: Cross-Origin Configuration

### Step 4a: Update Railway FRONTEND_URL
1. Go back to your Railway service
2. Click **Variables**
3. Update `FRONTEND_URL` to your Vercel URL (from Step 3e)
4. Click **Deploy** to redeploy with the new value

Example:
```
FRONTEND_URL = https://intellimeet-app.vercel.app
```

---

## Phase 5: Full Integration Test

### Step 5a: Sign Up
1. Open your Vercel URL
2. Click **Sign Up**
3. Enter an email and password
4. Submit
5. If successful, you'll be logged in and redirected to the dashboard
6. If it fails, check the browser console for errors and Railway logs for API issues

### Step 5b: Create a Meeting
1. On the dashboard, click **New Meeting** (or similar button)
2. Enter a meeting title and time
3. Click **Create**
4. If successful, the meeting appears in your list

### Step 5c: Join a Meeting
1. Click the meeting you just created
2. You should see the meeting room UI with video, chat, and participant list
3. Try typing in chat
4. You should see your message appear instantly
5. If chat doesn't work, check that `VITE_SOCKET_BASE` is correct in Vercel

### Step 5d: Verify Logs
- If anything fails, check:
  - **Railway:** Deployment logs in the **Deployments** tab
  - **Vercel:** Build and runtime logs in **Deployments**
  - **Browser Console:** Press F12, check for JavaScript errors
  - **MongoDB Atlas:** Verify the connection string and IP allowlist

---

## Troubleshooting

### "Cannot reach Railway backend"
- Verify `FRONTEND_URL` is set on Railway and matches your Vercel domain
- Check Railway's **Public URL** and confirm it's correct in Vercel's `VITE_API_BASE`

### "Socket connection failed"
- Confirm `VITE_SOCKET_BASE` in Vercel matches the Railway URL exactly
- Check Railway logs for Socket.io errors

### "MongoDB connection failed"
- Verify the `MONGODB_URI` is correct and the password matches
- Check Atlas **Network Access** allows your IP (or "Anywhere")
- Confirm the database user exists in Atlas

### "Build failed on Vercel"
- Check Vercel build logs
- Ensure `npm install` runs without errors
- Verify `VITE_API_BASE` is set before building

### "Login fails"
- Check Railway API logs for auth errors
- Verify `JWT_SECRET` and `JWT_REFRESH_SECRET` are set and not empty
- Confirm MongoDB is connected

---

## Summary Table

| Service | Platform | URL | Key Env Vars |
|---------|----------|-----|--------------|
| **Backend** | Railway | `{RAILWAY_URL}` | `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL` |
| **Frontend** | Vercel | `{VERCEL_URL}` | `VITE_API_BASE`, `VITE_SOCKET_BASE` |
| **Database** | MongoDB Atlas | (connection string) | (included in `MONGODB_URI`) |

---

## Next Steps (Optional)

1. **Add Redis for scaling:**
   - In Railway, add a Redis service
   - Copy the `REDIS_URL`
   - Set `REDIS_URL` on the backend service
   - Restart

2. **Restrict MongoDB access:**
   - In Atlas, go to **Network Access**
   - Remove "Allow from Anywhere"
   - Add Railway's IP address (if available)

3. **Monitor your app:**
   - Set up Sentry or LogRocket for error tracking
   - Add health check alerts in Railway

4. **Custom domain:**
   - Vercel: Add a custom domain in project settings
   - Railway: Add a custom domain in service settings

---

**Questions?** Check the repo docs in [documents/](../) or review the Railway and Vercel documentation.
