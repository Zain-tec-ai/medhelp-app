const express = require('express');
const router = express.Router();

// GET all appointments
router.get('/', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    const [appointments] = await connection.query('SELECT * FROM appointments ORDER BY created_at DESC');
    connection.release();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    const [appointment] = await connection.query('SELECT * FROM appointments WHERE id = ?', [req.params.id]);
    connection.release();
    res.json(appointment[0] || { error: 'Appointment not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Create new appointment
router.post('/', async (req, res) => {
  try {
    const { user_id, full_name, phone, department, preferred_date, reason } = req.body;
    
    if (!full_name || !phone || !department || !preferred_date || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO appointments (user_id, full_name, phone, department, preferred_date, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id || null, full_name, phone, department, preferred_date, reason, 'new']
    );
    connection.release();
    
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Appointment created successfully',
      appointment_id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update appointment status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();
    await connection.query('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id]);
    connection.release();
    
    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;