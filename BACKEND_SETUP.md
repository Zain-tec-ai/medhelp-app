# MedHelp Backend Setup Guide

## 🎯 Backend Overview

Ye Node.js + Express + MySQL backend hai jo:
- ✅ Appointments ko database mein save karta hai
- ✅ Contact messages ko save karta hai
- ✅ Health topics API provide karta hai
- ✅ Salt scans ko track karta hai

---

## 📋 Prerequisites

1. **Node.js** installed (v14+)
   ```bash
   node --version
   ```

2. **MySQL** running with `medhelp` database
   ```bash
   mysql -u root -p
   SOURCE database.sql;
   ```

3. **npm** installed
   ```bash
   npm --version
   ```

---

## 🚀 Installation & Setup

### Step 1: Install Dependencies
```bash
npm install
```

Ye download karega:
- express (Web framework)
- mysql2 (Database connector)
- cors (Cross-origin requests)
- dotenv (Environment variables)
- nodemon (Auto-reload in dev)

### Step 2: Configure Database

`.env` file mein ye set karo:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=medhelp
PORT=3000
```

### Step 3: Start Server

**Development mode (auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server chalega: `http://localhost:3000`

---

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Appointments
```
GET    /api/appointments              (Get all)
GET    /api/appointments/:id          (Get one)
POST   /api/appointments              (Create new)
PUT    /api/appointments/:id          (Update status)
```

**POST Example:**
```json
{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "department": "General Medicine",
  "preferred_date": "2026-06-25",
  "reason": "Fever and cough"
}
```

### Contact Messages
```
GET    /api/contacts                  (Get all)
GET    /api/contacts/:id              (Get one)
POST   /api/contacts                  (Create new)
PUT    /api/contacts/:id              (Update status)
```

**POST Example:**
```json
{
  "email": "user@example.com",
  "message": "Help needed with the app"
}
```

### Health Topics
```
GET    /api/health-topics             (Get all)
GET    /api/health-topics/type/:type  (By type)
GET    /api/health-topics/:id         (Get one)
POST   /api/health-topics             (Create new - Admin)
```

### Salt Scans
```
GET    /api/salt-scans                (Get all)
GET    /api/salt-scans/user/:user_id  (By user)
GET    /api/salt-scans/:id            (Get one)
POST   /api/salt-scans                (Create new)
```

---

## 🔌 Frontend Integration

### 1. Include API Client
```html
<script src="api-client.js"></script>
```

### 2. Use in app.js

Replace localStorage calls with API calls:

**Before (localStorage):**
```javascript
const appointments = storage.get("appointments");
```

**After (API):**
```javascript
const appointments = await api.appointments.getAll();
```

### 3. Update Form Submissions

**Appointment Form:**
```javascript
appointmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(appointmentForm));
  const result = await api.appointments.create(data);
  if (result.id) {
    appointmentMessage.textContent = "Appointment created successfully!";
  }
});
```

**Contact Form:**
```javascript
contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(contactForm));
  const result = await api.contacts.create(data);
  if (result.id) {
    contactMessage.textContent = "Message sent successfully!";
  }
});
```

---

## 🧪 Testing

### 1. Test Health Endpoint
```bash
curl http://localhost:3000/api/health
```

### 2. Test Create Appointment
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Patient",
    "phone": "+1234567890",
    "department": "General Medicine",
    "preferred_date": "2026-06-25",
    "reason": "Fever"
  }'
```

### 3. Test Get All Appointments
```bash
curl http://localhost:3000/api/appointments
```

---

## 🔐 Security Tips

1. **Password Hashing** - Update later with bcrypt
2. **Input Validation** - Add validation library
3. **Authentication** - Add JWT for user auth
4. **Rate Limiting** - Add rate limiter middleware
5. **HTTPS** - Use in production

---

## 📦 Deployment

### Option 1: Heroku
```bash
heroku login
heroku create medhelp-api
git push heroku backend-setup:main
```

### Option 2: AWS / DigitalOcean
- Rent VPS
- Install Node.js
- Setup MySQL
- Deploy code

---

## ❓ Troubleshooting

**"Cannot connect to MySQL"**
- Check `.env` credentials
- Verify MySQL is running
- Check database name

**"Port 3000 already in use"**
```bash
# Change PORT in .env or kill process
lsof -i :3000
kill -9 <PID>
```

**"CORS errors"**
- Add frontend URL to CORS in `server.js`
- Update this line: `app.use(cors());`

---

## ✅ Next Steps

1. ✅ Database setup done
2. ✅ Backend API created
3. 🔄 **Frontend integration** - Update app.js with API calls
4. 🔄 **Authentication** - Add login/signup
5. 🔄 **Deployment** - Deploy to server

---

**Questions?** Batao! 🚀
