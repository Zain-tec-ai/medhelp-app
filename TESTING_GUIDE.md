# 🧪 Backend Testing Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Database

Update `.env` file with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=medhelp
PORT=3000
```

## Step 3: Verify Database

```bash
mysql -u root -p
USE medhelp;
SHOW TABLES;
SELECT * FROM appointments;
```

## Step 4: Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ MySQL connected successfully
🚀 Server running on http://localhost:3000
```

## Step 5: Test API Endpoints

### Health Check
```bash
curl http://localhost:3000/api/health
```

Expected Response:
```json
{"status":"OK","message":"MedHelp API is running"}
```

### Get All Appointments
```bash
curl http://localhost:3000/api/appointments
```

### Create Appointment
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Patient",
    "phone": "+1234567890",
    "department": "General Medicine",
    "preferred_date": "2026-06-25",
    "reason": "Fever and cough"
  }'
```

Expected Response:
```json
{"id":X,"message":"Appointment created successfully","appointment_id":X}
```

### Get All Contacts
```bash
curl http://localhost:3000/api/contacts
```

### Create Contact
```bash
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "message": "Help needed"
  }'
```

## Step 6: Test Frontend Integration

### 1. Start Frontend Server (separate terminal)
```bash
python -m http.server 5502
```

### 2. Open in Browser
Go to: `http://localhost:5502`

### 3. Test Appointment Form
- Fill appointment form
- Click "Submit Request"
- Check console for success message
- Verify in MySQL: `SELECT * FROM appointments;`

### 4. Test Contact Form
- Fill contact form
- Click "Send Message"
- Check console for success message
- Verify in MySQL: `SELECT * FROM contact_messages;`

## 🐛 Troubleshooting

### CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:** Backend already has CORS enabled in `server.js`

### Port 3000 Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

Or change PORT in `.env`

### MySQL Connection Error
- Check `.env` credentials
- Ensure MySQL service is running
- Verify database exists: `SHOW DATABASES;`

### Cannot Find API Client
- Ensure `api-client.js` is loaded before `app.js` in HTML
- Check browser console for errors

## ✅ What to Check

- [ ] Backend server starts without errors
- [ ] Health endpoint responds with 200 OK
- [ ] Can create appointment via API
- [ ] Appointment appears in MySQL database
- [ ] Frontend form submission shows success message
- [ ] Contact form works and saves to database
- [ ] Salt scans save to database

## 📊 Database Verification

```sql
-- Check appointments
SELECT * FROM appointments ORDER BY created_at DESC LIMIT 5;

-- Check contacts
SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5;

-- Check salt scans
SELECT * FROM salt_scans ORDER BY created_at DESC LIMIT 5;

-- Count records
SELECT COUNT(*) FROM appointments;
SELECT COUNT(*) FROM contact_messages;
SELECT COUNT(*) FROM salt_scans;
```

## 🎉 Success!

If all tests pass:
1. Backend is working ✅
2. Database connections are good ✅
3. Frontend can communicate with API ✅
4. Data is persisting in database ✅

Next steps:
- Deploy to production
- Add authentication
- Add data validation
- Setup monitoring
