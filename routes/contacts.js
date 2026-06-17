const express = require('express');
const router = express.Router();

// GET all contact messages
router.get('/', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    const [messages] = await connection.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    connection.release();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET contact message by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    const [message] = await connection.query('SELECT * FROM contact_messages WHERE id = ?', [req.params.id]);
    connection.release();
    res.json(message[0] || { error: 'Message not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Create new contact message
router.post('/', async (req, res) => {
  try {
    const { email, message } = req.body;
    
    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required' });
    }

    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO contact_messages (email, message, status) VALUES (?, ?, ?)',
      [email, message, 'new']
    );
    connection.release();
    
    res.status(201).json({ 
      id: result.insertId,
      message: 'Contact message sent successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update message status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    await connection.query('UPDATE contact_messages SET status = ? WHERE id = ?', [status, req.params.id]);
    connection.release();
    
    res.json({ message: 'Message status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;