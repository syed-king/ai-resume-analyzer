# 🚀 ResumeAI — AI-Powered Resume Analyzer

> Analyze your resume against any job description and get an AI match score, missing skills, ATS tips, and actionable suggestions. **100% free, no paid APIs.**

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, Tailwind CSS, Framer Motion, PWA |
| Backend | Python FastAPI |
| AI / NLP | spaCy, HuggingFace Inference API (free) |
| Database | SQLite (local) → Supabase PostgreSQL (cloud) |
| Deployment | Frontend → Vercel · Backend → Railway |

---

## 📁 Project Structure

```
ai analysis reume project/
├── backend/
│   ├── requirements.txt
│   ├── railway.json
│   ├── .env.example
│   └── app/
│       ├── main.py
│       ├── database.py
│       ├── models.py, schemas.py, auth.py
│       ├── routers/ (auth, resume, analysis)
│       └── services/ (parser, nlp, analyzer)
└── frontend/
    ├── package.json
    ├── tailwind.config.ts, next.config.js
    ├── app/ (layout, page, login, register, dashboard, analyze, results/[id], history)
    ├── components/ (Navbar, ScoreRing, UploadZone)
    ├── context/ (AuthContext)
    ├── lib/ (api.ts)
    └── public/ (manifest.json, sw.js)
```

---

## ⚙️ Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ (install from https://nodejs.org)
- pip

---

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Download spaCy model (~12MB)
python -m spacy download en_core_web_sm

# Copy and fill in env vars
copy .env.example .env

# Start backend (runs on http://localhost:8000)
uvicorn app.main:app --reload
```

The SQLite database (`resume.db`) is created automatically. No setup needed.

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy and fill in env vars
copy .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000

# Start frontend (runs on http://localhost:3000)
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 🌐 Cloud Deployment (Free — Accessible from Anywhere)

### Step 1: Supabase (Database)
1. Go to https://supabase.com → Create project
2. Go to **Settings → Database** → copy the **Connection String**
3. Update `DATABASE_URL` in your Railway backend env vars

### Step 2: Railway (Backend)
1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select the `backend/` folder
3. Set environment variables:
   ```
   DATABASE_URL=<Supabase connection string>
   SECRET_KEY=<random long string>
   FRONTEND_URL=<your-app.vercel.app>
   ```
4. Railway auto-detects `railway.json` and installs spaCy model at build time
5. Copy your Railway URL

### Step 3: Vercel (Frontend)
1. Go to https://vercel.com → New Project → Deploy from GitHub
2. Select the `frontend/` folder
3. Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=<your-railway-url>
   ```
4. Deploy — Vercel auto-detects Next.js

### Done! 🎉
Your app is now live at `your-app.vercel.app` — accessible from any device, any browser, anywhere.

---

## 📱 PWA (Install on Mobile)

1. Open your app in Chrome on Android/iOS
2. Tap **"Add to Home Screen"** (Android) or Share → **"Add to Home Screen"** (iOS)
3. The app installs like a native app

---

## 🤖 AI Architecture

| Component | Technology | Runs On |
|---|---|---|
| Resume text extraction | pdfplumber + python-docx | Railway server |
| Entity extraction (name, email, skills) | spaCy `en_core_web_sm` | Railway server |
| Semantic similarity | HuggingFace Inference API (`all-MiniLM-L6-v2`) | HF cloud (free) |
| Keyword matching | Pure Python | Railway server |
| ATS scoring | Pure Python | Railway server |

**Score weights:**
- Semantic similarity: 40%
- Skill match: 35%
- Keyword density: 25%

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | SQLite or PostgreSQL connection string | ✅ |
| `SECRET_KEY` | JWT signing key (make it long and random) | ✅ |
| `FRONTEND_URL` | Your Vercel URL (for CORS) | ✅ |
| `HF_API_TOKEN` | HuggingFace token (increases rate limits) | Optional |
| `USE_LOCAL_MODEL` | `true` to use local sentence-transformers | Optional |

### Frontend (`frontend/.env.local`)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL |

---

## 🐛 Troubleshooting

**HF API returns 503?** — Model is loading, wait 20s and retry. Add `HF_API_TOKEN` for priority.

**spaCy not found?** — Run `python -m spacy download en_core_web_sm`

**CORS error in browser?** — Set `FRONTEND_URL` in backend `.env` to your exact frontend URL.

**PDF not parsing?** — Ensure the PDF has text (not a scanned image). Image PDFs require OCR (not included).

**Node not found?** — Install from https://nodejs.org/en/download
