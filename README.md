# MedHelp Starter App

This folder contains a simple launch-ready frontend starter for a health information website/app.

## Files

- `index.html` - Main website page.
- `style.css` - Responsive visual design.
- `app.js` - Search, filters, saved topics, salt scanner, appointment form, and contact form.
- `database.sql` - MySQL database schema and starter seed data.
- `manifest.webmanifest` and `sw.js` - PWA install/offline support.
- `playstore/` - Google Play listing copy and launch checklist.
- `capacitor.config.json` and `package.json` - Android packaging starter files.

## How to Run

Open `index.html` in a browser. No build step is required.

For the local preview server:

```bash
python -m http.server 5502
```

Then open `http://localhost:5502`.

## Database Setup

Import `database.sql` into MySQL:

```sql
SOURCE database.sql;
```

The current frontend saves form submissions in browser `localStorage` for demo purposes. When you add a backend, connect these forms to the `appointments` and `contact_messages` tables.

The salt scanner previews uploaded medicine-label photos and uses browser OCR through Tesseract.js when the CDN is available. Users can also type or paste the composition text manually. Save production scan results to `salt_scans`.

## Google Play Packaging

This app is ready to package with Capacitor after Android Studio, Java, and the Android SDK are installed:

```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```

Build a signed Android App Bundle (`.aab`) from Android Studio and upload it in Play Console. Use `playstore/launch-checklist.md` before submitting.

## Launch Checklist

- Replace demo medical content with reviewed content from qualified professionals.
- Add user authentication and real password hashing on the backend.
- Connect forms to an API.
- Replace CDN OCR with your own OCR/API pipeline if you need offline support, faster scans, or medical-grade audit logs.
- Add privacy policy, terms, and medical disclaimer pages.
- Configure hosting, SSL, backups, and database access controls.
