const express = require('express');
const AdminMessage = require('../models/AdminMessage');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all admin messages
router.get('/messages', authenticateToken, async (req, res) => {
  try {
    const messages = req.user.role === 'admin' 
      ? await AdminMessage.findAll()
      : await AdminMessage.findActive();
    
    res.json(messages);
  } catch (error) {
    console.error('Get admin messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create admin message
router.post('/messages', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const message = await AdminMessage.create(req.body);
    res.status(201).json(message);
  } catch (error) {
    console.error('Create admin message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update admin message
router.put('/messages/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const message = await AdminMessage.update(id, req.body);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Update admin message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete admin message
router.delete('/messages/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const message = await AdminMessage.delete(id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Admin message deleted successfully' });
  } catch (error) {
    console.error('Delete admin message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;