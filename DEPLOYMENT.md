# 🚀 StockApp — Full Deployment Guide
## MongoDB Atlas + GitHub + Render

---

## STEP 1 — Connect MongoDB Atlas
> Do this first before anything else

1. Go to **https://cloud.mongodb.com** and log in
2. Click your **cluster** → click **Connect**
3. Choose **"Drivers"** → select **Node.js**
4. Copy the connection string. It looks like:
   ```
   mongodb+srv://yourname:yourpassword@cluster0.abc12.mongodb.net/?retryWrites=true&w=majority
   ```
5. Open `backend/.env` and replace the MONGODB_URI line:
   ```
   MONGODB_URI=mongodb+srv://yourname:yourpassword@cluster0.abc12.mongodb.net/stockapp?retryWrites=true&w=majority
   ```
   ⚠️ Add `/stockapp` before the `?` — that's your database name

6. **Allow all IPs in Atlas** (required for Render):
   - Atlas Dashboard → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

7. **Test connection locally:**
   ```bash
   cd backend
   npm install
   npm run seed
   # Should print: ✅ MongoDB Connected Successfully
   # Should print: ✅ Inserted 12 stocks
   ```

---

## STEP 2 — Push to GitHub

Run these commands in your terminal from inside the `stockapp/` folder:

```bash
# Navigate to project root
cd stockapp

# Initialize git repo
git init

# Stage all files (.gitignore will automatically exclude node_modules and .env)
git add .

# First commit
git commit -m "Initial commit - MERN Stock App"

# Go to github.com → click "New Repository"
# Name it: stockapp
# Set to Public
# Do NOT initialize with README (we already have one)
# Copy the repo URL shown (e.g. https://github.com/yourusername/stockapp.git)

# Connect and push
git remote add origin https://github.com/yourusername/stockapp.git
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

## STEP 3 — Deploy Backend on Render

1. Go to **https://render.com** and log in
2. Click **"New +"** → **"Web Service"**
3. Choose **"Connect a repository"** → select your `stockapp` repo
4. Fill in the settings:

   | Field | Value |
   |-------|-------|
   | **Name** | `stockapp-backend` |
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Plan** | Free |

5. Scroll down to **"Environment Variables"** → click **Add**:

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | your full Atlas connection string |
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |

6. Click **"Create Web Service"**
7. Wait 2-3 minutes for it to build
8. Copy your backend URL — it looks like:
   ```
   https://stockapp-backend.onrender.com
   ```
9. **Test it:** Open `https://stockapp-backend.onrender.com/api/health` in browser
   - You should see: `{"status":"OK","message":"StockApp API is running"}`

10. **Seed your Atlas database** (one time only):
    - In Render dashboard → your backend service → **Shell** tab
    - Run: `node seed.js`

---

## STEP 4 — Deploy Frontend on Render

1. Click **"New +"** → **"Static Site"**
2. Connect the same `stockapp` repo
3. Fill in settings:

   | Field | Value |
   |-------|-------|
   | **Name** | `stockapp-frontend` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `build` |

4. **Environment Variables** → Add:

   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | `https://stockapp-backend.onrender.com/api` |

5. Click **"Create Static Site"**
6. Wait 3-4 minutes to build

7. ✅ Your app is live at something like:
   ```
   https://stockapp-frontend.onrender.com
   ```

---

## STEP 5 — Final Fix: Tell Backend about Frontend (CORS)

1. Go back to your **backend** service on Render
2. Environment Variables → Add one more:

   | Key | Value |
   |-----|-------|
   | `FRONTEND_URL` | `https://stockapp-frontend.onrender.com` |

3. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## ✅ Everything Working Checklist

- [ ] Atlas cluster running, IP whitelist set to 0.0.0.0/0
- [ ] `npm run seed` ran successfully (12 stocks in Atlas)
- [ ] Backend health check returns OK
- [ ] Frontend loads and shows stocks from Atlas
- [ ] Can Buy/Sell stocks (transactions saved to Atlas)
- [ ] Manage page: Add/Edit/Delete stocks work
- [ ] GitHub repo is public and up to date

---

## 🔁 Updating Code After Changes

```bash
git add .
git commit -m "your change description"
git push
```
Render auto-deploys on every push to `main`. ✨

---

## 🆘 Common Issues

| Problem | Fix |
|---------|-----|
| `MongoServerError: bad auth` | Wrong username/password in MONGODB_URI |
| `Connection refused` | Atlas IP whitelist — add 0.0.0.0/0 |
| Frontend shows "Network Error" | REACT_APP_API_URL env var not set in Render |
| CORS error in browser | Add FRONTEND_URL env var to backend on Render |
| Render says "Build failed" | Check you set Root Directory correctly (backend / frontend) |
