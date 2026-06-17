const express = require('express');
const router = express.Router();

// GET all health topics
router.get('/', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    const [topics] = await connection.query('SELECT * FROM health_topics ORDER BY type, title');
    connection.release();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET topics by type (symptom, medicine, condition)
router.get('/type/:type', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    const [topics] = await connection.query('SELECT * FROM health_topics WHERE type = ? ORDER BY title', [req.params.type]);
    connection.release();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET topic by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    const [topic] = await connection.query('SELECT * FROM health_topics WHERE id = ?', [req.params.id]);
    connection.release();
    res.json(topic[0] || { error: 'Topic not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Create new health topic (Admin only)
router.post('/', async (req, res) => {
  try {
    const { type, title, summary, keywords, reviewed_by, reviewed_at } = req.body;
    
    if (!type || !title || !summary) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO health_topics (type, title, summary, keywords, reviewed_by, reviewed_at) VALUES (?, ?, ?, ?, ?, ?)',
      [type, title, summary, keywords || null, reviewed_by || null, reviewed_at || null]
    );
    connection.release();
    
    res.status(201).json({ 
      id: result.insertId,
      message: 'Health topic created successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;