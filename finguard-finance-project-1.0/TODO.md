# FinGuard Finance Project 1.0 - Todo List

## What This Project Is

This is a complete **financial safety and management web application** that helps users:
- Track income and expenses
- Detect suspicious transactions and potential scams
- Predict future spending
- Set budgets and financial goals
- Get AI-powered financial insights

---

## Project Structure

```
finguard-finance-project-1.0/
├── .gitignore                    # Files to ignore in GitHub
├── backend/                     # Python FastAPI server
│   ├── .env.example            # Configuration template
│   ├── requirements.txt        # Python dependencies
│   ├── app/                    # Main application code
│   │   ├── main.py            # Server entry point
│   │   ├── config.py          # Settings and environment
│   │   ├── api/               # API endpoints
│   │   │   ├── routes.py      # All route definitions
│   │   │   └── [feature]/     # Feature-specific routes
│   │   ├── models/            # Database models
│   │   │   └── entities.py    # User, Transaction, etc.
│   │   ├── database/          # Database connection
│   │   │   └── core.py        # SQLAlchemy setup
│   │   ├── schemas/           # Data validation
│   │   │   └── common.py      # Request/Response models
│   │   ├── security/          # Auth and input safety
│   │   │   ├── auth.py        # JWT authentication
│   │   │   └── input_safety.py # Secret value detection
│   │   ├── services/          # Business logic
│   │   │   ├── gemini.py      # AI integration
│   │   │   └── scam.py        # Scam detection logic
│   │   ├── ml/                # Machine learning
│   │   │   └── engine.py      # Anomaly detection & forecasting
│   │   └── utils/             # Utility functions
│   └── tests/                 # Backend tests
│       └── test_ml.py         # ML engine tests
└── frontend/                   # React web application
    ├── index.html             # HTML entry point
    ├── package.json           # Node dependencies
    ├── vite.config.ts         # Build configuration
    └── src/                   # Source code
        ├── main.tsx           # App entry point
        ├── App.tsx            # Main app component
        ├── styles.css         # Global styles
        ├── modern.css         # Modern UI styles
        ├── section-art.css    # Section artwork styles
        ├── vite-env.d.ts      # TypeScript declarations
        ├── components/        # Reusable components
        │   ├── UI.tsx         # Card, Progress, PageIntro
        │   ├── Layout.tsx     # Sidebar and header layout
        │   ├── Drawer.tsx     # Slide-out panel
        │   ├── FinGuardShield.tsx # Score visualization
        │   └── ScamAnalysisDrawer.tsx # Scam analysis panel
        ├── context/           # React context
        │   └── AuthContext.tsx # User authentication state
        ├── lib/               # Utility libraries
        │   ├── api.ts         # API client (Axios)
        │   ├── demo.ts        # Demo data functions
        │   ├── demoData.ts    # Sample transaction data
        │   ├── dashboardStory.ts # Dashboard helpers
        │   ├── inputSafety.ts # Client-side input checks
        │   └── riskDisplay.ts # Risk level formatting
        └── pages/             # Page components
            ├── Dashboard.tsx      # Main dashboard
            ├── Login.tsx          # Authentication
            ├── Transactions.tsx   # Transaction management
            ├── Analytics.tsx      # Financial analytics
            ├── Anomalies.tsx      # Anomaly detection
            ├── AIChat.tsx         # AI assistant chat
            ├── Settings.tsx       # User settings
            ├── Forecasts.tsx      # Expense predictions
            ├── Budgets.tsx        # Budget management
            ├── Goals.tsx          # Goal tracking
            ├── Reports.tsx        # Report generation
            ├── Safety.tsx         # Scam analysis pages
            ├── SafetyModern.tsx   # Modern scam UI
            ├── Experiences.tsx    # Premium experiences
            ├── PremiumDashboard.tsx # Enhanced dashboard
            ├── Landing.tsx        # Landing page
            └── LandingModern.tsx  # Modern landing page
```

---

## Backend (Server Side) - Python/FastAPI

### What Each File Does

| File | Purpose | Easy Explanation |
|------|---------|------------------|
| `backend/requirements.txt` | Lists Python packages needed | Like a shopping list for the server |
| `backend/.env.example` | Template for configuration | Shows what settings you need to fill in |
| `app/main.py` | Starts the server | The door that opens when someone visits |
| `app/config.py` | Reads environment settings | Knows where the database is, secret keys, etc. |
| `app/api/routes.py` | Defines all API endpoints | The addresses users can call (like /api/v1/transactions) |
| `app/models/entities.py` | Database table definitions | Describes what data looks like (Users, Transactions, Budgets) |
| `app/database/core.py` | Connects to the database | The bridge between code and data storage |
| `app/schemas/common.py` | Validates incoming data | Checks that data is correct before processing |
| `app/security/auth.py` | Handles login/logout | Creates and checks JWT tokens for logged-in users |
| `app/security/input_safety.py` | Blocks secret values | Prevents users from accidentally submitting passwords, PINs, etc. |
| `app/services/gemini.py` | Connects to AI (Google Gemini) | Sends financial questions to AI and gets answers |
| `app/services/scam.py` | Detects scam patterns | Analyzes text for scam indicators like urgency, threats |
| `app/ml/engine.py` | ML models for anomalies and forecasts | Finds unusual transactions and predicts future spending |
| `app/database/seed.py` | Creates demo data | Populates the database with sample data for testing |

### API Endpoints (What the frontend can ask for)

**Authentication:**
- `POST /api/v1/auth/register` - Create a new account
- `POST /api/v1/auth/login` - Sign in and get a token
- `POST /api/v1/auth/change-password` - Update password

**Transactions:**
- `GET /api/v1/transactions` - List all transactions
- `POST /api/v1/transactions` - Add a new transaction
- `DELETE /api/v1/transactions/{id}` - Delete a transaction
- `POST /api/v1/transactions/upload` - Upload CSV file

**Analytics:**
- `GET /api/v1/analytics/summary` - Get income, expenses, balance
- `GET /api/v1/analytics/recurring` - Find recurring payments

**Security:**
- `GET /api/v1/anomaly/scan` - Scan all transactions for anomalies
- `POST /api/v1/anomaly/evaluate` - Check a specific transaction
- `POST /api/v1/scam/analyze` - Analyze text for scams
- `POST /api/v1/url/analyze` - Check if a URL is suspicious

**Planning:**
- `GET/POST /api/v1/budgets` - Manage budgets
- `GET/POST /api/v1/goals` - Manage financial goals

**AI:**
- `POST /api/v1/ai/ask` - Ask FinGuard AI a question

**Other:**
- `GET /api/v1/notifications` - Get alerts
- `GET /api/v1/prediction/expenses` - Get spending forecasts
- `GET /api/v1/reports/monthly` - Generate monthly report
- `GET /api/v1/users/me` - Get current user info
- `GET /health` - Check if server is running

---

## Frontend (Client Side) - React/TypeScript

### What Each File Does

| File | Purpose | Easy Explanation |
|------|---------|------------------|
| `frontend/package.json` | Lists Node.js packages | Tells npm what libraries to install |
| `frontend/vite.config.ts` | Build settings | Configures how the app gets built |
| `frontend/index.html` | HTML page | The webpage that loads the React app |
| `src/main.tsx` | Starts React | Bootstraps the entire application |
| `src/App.tsx` | Main app component | Sets up routing (which page shows when) |
| `src/styles.css` | All CSS styles | Makes everything look good |
| `src/modern.css` | Additional modern styles | Extra styling for modern components |
| `src/section-art.css` | Decorative artwork CSS | Background visual effects |
| `src/vite-env.d.ts` | TypeScript types for Vite | Helps TypeScript understand Vite |

### Components (Building Blocks)

| Component | What It Does |
|-----------|--------------|
| `UI.tsx` | Provides Card, Progress bar, PageIntro, money formatting |
| `Layout.tsx` | The main shell with sidebar, header, navigation |
| `Drawer.tsx` | Slide-out panel for details and forms |
| `FinGuardShield.tsx` | Animated shield showing the security score |
| `ScamAnalysisDrawer.tsx` | Panel for analyzing suspicious content |

### Context (Shared State)

| Context | What It Does |
|---------|--------------|
| `AuthContext.tsx` | Manages logged-in user, login, register, logout |

### Library Files (Helpers)

| File | What It Does |
|------|--------------|
| `lib/api.ts` | Makes HTTP requests to the backend |
| `lib/demo.ts` | Demo functions for testing |
| `lib/demoData.ts` | Sample transactions and data for demos |
| `lib/dashboardStory.ts` | Helpers for building dashboard views |
| `lib/inputSafety.ts` | Checks for secrets on the client side |
| `lib/riskDisplay.ts` | Formats risk levels for display |

### Pages (What Users See)

| Page | What It Shows |
|------|---------------|
| `Landing.tsx` | Public landing page with features |
| `LandingModern.tsx` | Modern cinematic landing page |
| `Login.tsx` | Sign in / Sign up / Password reset |
| `Dashboard.tsx` | Main dashboard with overview |
| `PremiumDashboard.tsx` | Enhanced dashboard with more features |
| `Transactions.tsx` | List, add, delete transactions |
| `Analytics.tsx` | Charts and financial insights |
| `Anomalies.tsx` | View and evaluate unusual transactions |
| `Forecasts.tsx` | Expense predictions for future months |
| `Budgets.tsx` | Create and track budgets |
| `Goals.tsx` | Set and track savings goals |
| `Reports.tsx` | Generate and download reports |
| `Safety.tsx` | Scam analyzer and incident management |
| `SafetyModern.tsx` | Modern scam analysis interface |
| `AIChat.tsx` | Chat with FinGuard AI assistant |
| `Settings.tsx` | Account settings and password change |
| `Experiences.tsx` | Money replay, what-if playground, statement drop |
| `index.tsx` | Export file that connects pages to routing |

---

## How It All Works Together

### User Flow

1. **User visits the site** → `index.html` loads → `main.tsx` starts React
2. **User sees landing page** → `Landing.tsx` or `LandingModern.tsx` shows features
3. **User clicks "Sign In"** → `Login.tsx` shows login form
4. **User enters credentials** → `AuthContext.tsx` sends request via `api.ts`
5. **Backend verifies** → `auth.py` checks password, creates JWT token
6. **User is logged in** → Dashboard loads with real data from API
7. **User views transactions** → `Transactions.tsx` fetches from `/api/v1/transactions`
8. **User analyzes a scam** → `Safety.tsx` sends text to `/api/v1/scam/analyze`
9. **Backend detects scams** → `scam.py` analyzes text, returns risk score
10. **User asks AI** → `AIChat.tsx` sends question to `/api/v1/ai/ask`
11. **Backend queries AI** → `gemini.py` sends to Google Gemini, returns answer

### Data Flow

```
User Browser (Frontend)
    │
    │ HTTP Request (with JWT token)
    ▼
FastAPI Server (Backend)
    │
    ├── auth.py → Verifies token, gets user
    ├── schemas/common.py → Validates input data
    ├── security/input_safety.py → Blocks secrets
    │
    ├── routes.py → Routes to correct handler
    │
    ├── services/scam.py → Analyzes scam patterns
    ├── services/gemini.py → Calls AI API
    ├── ml/engine.py → Detects anomalies, forecasts
    │
    ├── models/entities.py → Database operations
    └── database/core.py → Executes SQL queries
    │
    ▼
Response back to frontend
```

---

## Key Features Explained Simply

### 1. Scam Detection
When a user pastes a suspicious message or URL, the system:
- Checks for urgency words ("immediately", "urgent")
- Checks for threat language ("blocked", "suspended")
- Checks for sensitive data requests ("OTP", "PIN", "password")
- Checks for money requests ("send money", "pay now")
- Checks URL structure for suspicious patterns
- Returns a risk score (0-100) and recommended actions

### 2. Anomaly Detection
The ML engine (`ml/engine.py`) uses three methods:
- **Z-score**: How far a transaction is from the normal amount
- **Isolation Forest**: ML model that finds outliers
- **Local Outlier Factor**: Compares to nearby transactions

It combines these into a single risk score and explains why.

### 3. Expense Forecasting
The forecast function:
- Groups transactions by month
- Uses Random Forest (ML) if enough history exists
- Falls back to trend extrapolation if not
- Returns predicted amount, range, and confidence for next 3 months

### 4. Authentication
- Passwords are hashed with Argon2 (very secure)
- JWT tokens are issued on login (expires in 30 minutes)
- Every API request includes the token
- Token is checked on every protected endpoint

### 5. Input Safety
Both frontend and backend check for:
- OTPs, PINs, CVVs
- Passwords in plain text
- Private keys
- These are rejected before storage

---

## Running the Project Locally

### Backend (Terminal 1)
```bash
cd finguard-finance-project-1.0/backend
python -m venv .venv
.venv\Scripts\activate  # On Windows
pip install -r requirements.txt
# Copy .env.example to .env and edit if needed
uvicorn app.main:app --reload --port 8000
```

### Frontend (Terminal 2)
```bash
cd finguard-finance-project-1.0/frontend
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

### Demo Login
- Email: `demo@finguard.app`
- Password: `FinGuard@2026`

---

## Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Custom CSS (no Tailwind) |
| Charts | Recharts |
| Animation | Framer Motion |
| Icons | Lucide React |
| Backend Framework | FastAPI (Python) |
| Database ORM | SQLAlchemy |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Password Hashing | Argon2 (via passlib) |
| Authentication | JWT (via python-jose) |
| AI Integration | Google Gemini API (via httpx) |
| ML Libraries | scikit-learn, numpy (optional) |
| CSV Processing | Built-in csv module |
| PDF Generation | jspdf (frontend) |

---

## Environment Variables (Backend .env)

| Variable | What It Does | Example |
|----------|--------------|---------|
| `APP_NAME` | Name shown in API docs | FinGuard API |
| `ENVIRONMENT` | dev or production | development |
| `SECRET_KEY` | Secret for JWT tokens | (random 64 chars) |
| `DATABASE_URL` | Database connection string | sqlite:///./finguard.db |
| `ACCESS_TOKEN_MINUTES` | How long login lasts | 30 |
| `ALLOWED_ORIGINS` | Which websites can call API | http://localhost:5173 |
| `ALLOWED_HOSTS` | Which hosts can serve API | localhost,127.0.0.1 |
| `GEMINI_API_KEY` | Google AI key (optional) | (your key) |
| `GEMINI_MODEL` | Which AI model to use | gemini-3.8-flash |
| `SEED_DEMO` | Create demo data on startup | true |
| `DEMO_PASSWORD` | Password for demo account | FinGuard@2026 |

---

## What Makes This Project Special

1. **Explainable AI**: Every scam detection and anomaly score comes with a clear explanation of why
2. **Safety First**: The system actively blocks users from submitting sensitive credentials
3. **Honest About Limits**: Clear messages that AI is assistive, not definitive
4. **Complete Flow**: From landing page → login → dashboard → scam analysis → incident documentation → recovery guidance
5. **Demo-Ready**: Comes with sample data so the app looks alive immediately
6. **Production-Aware**: Rate limiting, CORS, security headers, input validation

---

## Files to Upload to GitHub

When uploading to GitHub, include ALL files in `finguard-finance-project-1.0/` EXCEPT:
- `.env` (if you create one - never commit secrets)
- `*.db` (database files)
- `node_modules/` (installed packages)
- `dist/` (built files)
- `__pycache__/` (Python cache)
- `.venv/` (Python virtual environment)

The `.gitignore` file already handles this.

---

## Quick Reference: Which File Does What

### If you want to...
- **Change how the app looks** → Edit files in `frontend/src/styles.css` or page components
- **Add a new API endpoint** → Add it to `backend/app/api/routes.py`
- **Change the database structure** → Edit `backend/app/models/entities.py`
- **Change how scams are detected** → Edit `backend/app/services/scam.py`
- **Change the ML models** → Edit `backend/app/ml/engine.py`
- **Add a new page** → Create a new file in `frontend/src/pages/`
- **Change authentication** → Edit `backend/app/security/auth.py` and `frontend/src/context/AuthContext.tsx`
- **Connect to a real database** → Change `DATABASE_URL` in `.env` to PostgreSQL
- **Add AI features** → Configure `GEMINI_API_KEY` in `.env` and edit `backend/app/services/gemini.py`
- **Deploy to production** → Set `ENVIRONMENT=production` and configure proper secrets
