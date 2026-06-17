// Database migration script to add extended health content
// Run with: node migrations/add_extended_content.js

const mysql = require('mysql2/promise');
require('dotenv').config();

const extendedTopics = [
  { type: 'symptom', title: 'Nausea', summary: 'Feeling sick or queasy...', keywords: 'vomit, motion sickness, stomach' },
  // ... more topics
];

async function migrate() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'medhelp'
  });

  try {
    const conn = await pool.getConnection();
    
    for (const topic of extendedTopics) {
      await conn.execute(
        'INSERT INTO health_topics (type, title, summary, keywords, reviewed_by, reviewed_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [topic.type, topic.title, topic.summary, topic.keywords, 'Migration']
      );
    }
    
    console.log('✓ Migration completed successfully');
    conn.release();
  } catch (error) {
    console.error('✗ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrate();
