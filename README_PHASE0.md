# CYBEV Frontend — Phase 0 Stabilization

This patch adds missing repo hygiene files and removes hardcoded backend URLs.

## What changed
- Added `.gitignore` (prevents `node_modules`, `.next`, env files, logs from being committed)
- Added `.env.example`
- Updated `src/utils/getUserProfile.js` to use `NEXT_PUBLIC_API_URL` rather than hardcoding `http://localhost:5000`

## Quick run
1) Create `.env.local`:
```bash
cp .env.example .env.local
```
2) Install & run:
```bash
npm install
npm run dev
```
