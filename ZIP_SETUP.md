# FinGuard source-code package

This package includes the frontend, backend, ML training/inference utilities, artwork assets, tests, documentation and deployment configuration.

## Local setup
1. Extract the ZIP and open the FinGuard folder.
2. Follow the Quick start commands in README.md.
3. Copy backend/.env.example to backend/.env and set a new SECRET_KEY.
4. For a local API connection, create frontend/.env.local with:
   VITE_API_URL=http://localhost:8000/api/v1
5. Start the backend and frontend in separate terminals.
6. Gemini is optional: set GEMINI_API_KEY only in backend/.env. Never put it in frontend variables.

## Package scope
Installed dependencies, virtual environments, Git history, build caches, local databases and private backend/.env configuration are intentionally excluded. Install dependencies using frontend/package-lock.json and backend/requirements.txt. Demo data and optional model-training code are not real bank data or evidence of validated fraud-detection accuracy.
