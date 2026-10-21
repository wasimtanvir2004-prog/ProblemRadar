# 🚀 Deployment & GitHub Publishing Guide

This guide walks you through publishing **ProblemRadar** to GitHub and deploying it to the web with zero friction.

---

## 1. Push to GitHub in 3 Easy Steps

### Step 1: Initialize Git and Stage Files
Open your terminal in the project directory:
```bash
git init
git add .
git commit -m "feat: initial commit for ProblemRadar with 1-year problem discovery & business MRRs"
```

### Step 2: Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `problem-radar`).
3. Choose **Public** or **Private**.
4. **Do NOT** initialize with README or .gitignore (we already provide clean ones).
5. Click **Create repository**.

### Step 3: Link and Push
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/problem-radar.git
git push -u origin main
```

---

## 2. Recommended Hosting Platforms

Because **ProblemRadar** is a full-stack application (React 19 + Express API proxy for Gemini), hosting it on a Node.js / container host takes less than 2 minutes.

---

### Option A: Render (Recommended — Free & Easiest)
1. Sign up / Log in to [render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure service settings:
   - **Name**: `problem-radar`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: *(Optional: paste your Google Gemini API key here for live AI autonomous agent runs)*
6. Click **Deploy Web Service**.
7. Your app will be live at `https://problem-radar.onrender.com`!

---

### Option B: Railway (1-Click Docker or Node)
1. Sign up / Log in to [railway.app](https://railway.app).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select `problem-radar`.
4. Railway will automatically detect the `Dockerfile` or `package.json` and build your app.
5. In **Variables**, add:
   - `GEMINI_API_KEY`: *(Your Gemini API key)*
6. Generate a public domain under **Settings -> Networking**.

---

### Option C: Google Cloud Run / Docker
You can deploy directly using the included multi-stage `Dockerfile`:

```bash
# Build local docker image
docker build -t problem-radar .

# Run locally on port 3000
docker run -p 3000:3000 -e GEMINI_API_KEY="your_api_key" problem-radar
```

Or deploy to Google Cloud Run:
```bash
gcloud run deploy problem-radar --source . --platform managed --allow-unauthenticated
```

---

### Option D: Vercel (Frontend SPA)
If you wish to deploy the frontend client to Vercel:
1. Connect your repository to [vercel.com](https://vercel.com).
2. **Framework Preset**: Vite
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. Deploy!

*(Note: The AI Agent Studio and Problem Radar work out of the box with the client-side preloaded dataset and simulated local runs. Live custom Gemini API generation is proxied through the Express server or can be linked to your own API endpoint).*

---

## 3. Pre-Flight Checklist: Verify All Checks Pass

Before pushing, verify there are zero errors:

```bash
# 1. Check TypeScript & types
npm run lint

# 2. Run unit tests
npm test

# 3. Test production bundle build
npm run build
```

All 3 commands should exit with code `0`.
When pushed, the included **GitHub Actions CI** (`.github/workflows/ci.yml`) will automatically verify your code on Node 20.x and 22.x.

---

## 4. Media & Asset Display on GitHub
All screenshots and diagrams referenced in `README.md` are located in `./docs/images/`:
- `docs/images/desktop-overview.png`
- `docs/images/business-modal.png`
- `docs/images/agent-studio.png`
- `docs/images/opportunity-matrix.png`
- `docs/images/mobile-overview.png`

Because relative Markdown paths are used (`./docs/images/...`), all preview images will render immediately and cleanly on your GitHub repository homepage without broken image icons.
