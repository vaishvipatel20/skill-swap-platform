const express = require('express');
const SwapRequest = require('../models/SwapRequest');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get user's swap requests
router.get('/my-swaps', authenticateToken, async (req, res) => {
  try {
    const swaps = await SwapRequest.findByUserId(req.user.id);
    res.json(swaps);
  } catch (error) {
    console.error('Get swaps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all swap requests (admin only)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const swaps = await SwapRequest.findAll();
    res.json(swaps);
  } catch (error) {
    console.error('Get all swaps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create swap request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const swapData = {
      ...req.body,
      requesterId: req.user.id
    };
    
    const swap = await SwapRequest.create(swapData);
    res.status(201).json(swap);
  } catch (error) {
    console.error('Create swap error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update swap status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const swap = await SwapRequest.updateStatus(id, status, req.user.id);
    
    if (!swap) {
      return res.status(404).json({ error: 'Swap request not found or unauthorized' });
    }

    res.json(swap);
  } catch (error) {
    console.error('Update swap status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete swap request
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const swap = await SwapRequest.delete(id, req.user.id);
    
    if (!swap) {
      return res.status(404).json({ error: 'Swap request not found or unauthorized' });
    }

    res.json({ message: 'Swap request deleted successfully' });
  } catch (error) {
    console.error('Delete swap error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;