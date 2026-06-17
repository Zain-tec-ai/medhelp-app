const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'medhelp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected successfully');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
  });

// Routes
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/health-topics', require('./routes/health-topics'));
app.use('/api/salt-scans', require('./routes/salt-scans'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MedHelp API is running' });
});

// Export pool for use in routes
app.locals.pool = pool;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});