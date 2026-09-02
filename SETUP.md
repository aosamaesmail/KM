# Benzine KM Tracker — Setup Guide

Two parts: **(A)** a Google Sheets backend that receives readings, and **(B)** a mobile web app
your engineers install on their phones like an app. Takes about 15 minutes, no coding required
beyond copy-paste.

## A) Google Sheets backend

1. Create a new Google Sheet (or reuse your existing "Benzine Main" sheet).
2. Go to **Extensions → Apps Script**.
3. Delete the placeholder code and paste in the contents of `Code.gs` (included in this download).
4. At the top of the script, change:
   ```
   const SHARED_TOKEN = 'CHANGE-ME-TO-A-SECRET';
   ```
   to any password-like string only you know, e.g. `'benzine-2026-eng'`.
5. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** (this lets the phone app post data without each engineer needing a Google login — the token above is what keeps it safe)
6. Click **Deploy**, authorize the permissions Google asks for, and copy the **Web app URL** it gives you (ends in `/exec`).
7. Submit one test reading from the app (step B) — a new tab called **"Benzine Sheet"** will be created automatically with the right columns the first time it receives data, and a **"Benzine KM Photos"** folder will appear in your Google Drive with the dashboard photos.

Your Finance team keeps working exactly as before — they open the Google Sheet (or export it to `.xlsx`, File → Download → Microsoft Excel) and review the `Benzine Sheet` tab, same columns as your current template, plus two extra columns with links to the start/finish dashboard photos for verification.

## B) The phone app

The app is a **Progressive Web App (PWA)** — a website that installs like an app, works offline,
and uses the phone's camera. No Play Store submission needed.

1. Host the files (`index.html`, `manifest.json`, `service-worker.js`, `icon-192.png`, `icon-512.png`)
   somewhere with HTTPS. Easiest free options:
   - **GitHub Pages**: create a repo, upload the files, enable Pages in repo settings.
   - **Netlify / Vercel**: drag-and-drop the folder into their free deploy dashboard.
2. Open the hosted URL on an Android phone in **Chrome**.
3. Tap the **⚙️ settings icon** in the app and paste:
   - **Google Sheet sync URL** — the `/exec` URL from step A.6
   - **Sync token** — the same secret string you set in `SHARED_TOKEN`
   - Optionally pre-fill the engineer's name and rate per KM
4. Tap **Save Settings**.
5. Tap Chrome's menu (⋮) → **Add to Home screen** → **Install**. It now behaves like a normal
   Android app icon, opens full-screen, and works without a signed connection for filling the form
   (it queues offline and syncs automatically once the phone has signal).

## How it works day-to-day

- Engineer opens the app, fills in Engineer/Driver/Area/Task, enters the **Start KM**, taps
  **Take Start Photo** of the odometer, does the same for **Finish KM**, and hits **Submit**.
- Trip, Total KM, and Amount Spent are calculated automatically (rate per KM is editable in Settings).
- If there's no signal, the entry is saved on the phone and auto-syncs the next time it's online —
  nothing is lost.
- Every submission lands as a new row in your Google Sheet, with clickable links to both photos,
  ready for Finance to review or export to Excel.

## Notes / things you may want to adjust later

- Right now anyone with the link can post a row if they also have the token — fine for an internal
  tool, but rotate the token periodically if engineers change.
- `Rent`, `Paid By`, and `Solfa` columns are left for Finance to fill in, matching how your current
  template is used (Paid By defaults to the engineer's name).
- Photos are compressed on the phone before upload (~100–300 KB each) to keep data usage low.
