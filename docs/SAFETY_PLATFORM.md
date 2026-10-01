# FinGuard Financial Safety Platform

## Purpose
FinGuard provides explainable AI-assisted scam screening, transaction anomaly monitoring, incident documentation, evidence organization, guided response, and financial education. It does not recover funds, impersonate institutions, or replace official verification.

## Data flow
User input → Pydantic validation → authenticated FastAPI route → explainable signal extraction / optional ML inference → PostgreSQL record → React risk explanation → incident response checklist.

## Scam pipeline
The runtime baseline combines transparent language rules, URL features, and optional TF-IDF + Logistic Regression output. Signals include urgency, threats, institutional impersonation, sensitive-data requests, money requests, unrealistic rewards, suspicious domain structure, URL encoding, IP hosts, and risky keywords. Every result includes a score, level, category, signals, explanation, confidence, and recommended actions.

## Model training
Install `ml/requirements.txt`, provide an anonymized CSV with `text,label,category`, and run:
`python ml/training/train_scam_classifier.py data.csv`.
The resulting joblib artifact can replace or augment the baseline without changing frontend contracts.

## Security and limitations
No passwords, PINs, CVVs, OTPs, private keys, or banking credentials should be collected. Files are limited by type, size, and row count. SQLAlchemy parameterization, JWT ownership checks, CORS, trusted hosts, rate limiting, and response safety headers are enabled. AI results are indicators—not definitive fraud determinations. Users should verify through official channels.
