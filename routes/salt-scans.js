const express = require('express');
const router = express.Router();

// GET all salt scans
router.get('/', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    const [scans] = await connection.query('SELECT * FROM salt_scans ORDER BY created_at DESC');
    connection.release();
    res.json(scans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET scans by user ID
router.get('/user/:user_id', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    const [scans] = await connection.query('SELECT * FROM salt_scans WHERE user_id = ? ORDER BY created_at DESC', [req.params.user_id]);
    connection.release();
    res.json(scans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET scan by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    const [scan] = await connection.query('SELECT * FROM salt_scans WHERE id = ?', [req.params.id]);
    connection.release();
    res.json(scan[0] || { error: 'Scan not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Create new salt scan
router.post('/', async (req, res) => {
  try {
    const { user_id, image_url, detected_text, matched_salts } = req.body;
    
    if (!detected_text) {
      return res.status(400).json({ error: 'Detected text is required' });
    }

    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO salt_scans (user_id, image_url, detected_text, matched_salts) VALUES (?, ?, ?, ?)',
      [user_id || null, image_url || null, detected_text, matched_salts ? JSON.stringify(matched_salts) : null]
    );
    connection.release();
    
    res.status(201).json({ 
      id: result.insertId,
      message: 'Salt scan saved successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;