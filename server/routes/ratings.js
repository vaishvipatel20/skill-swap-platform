const express = require('express');
const Rating = require('../models/Rating');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get user's ratings
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.findByUserId(userId);
    res.json(ratings);
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all ratings (admin only)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const ratings = await Rating.findAll();
    res.json(ratings);
  } catch (error) {
    console.error('Get all ratings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create rating
router.post('/', authenticateToken, async (req, res) => {
  try {
    const ratingData = {
      ...req.body,
      raterId: req.user.id
    };
    
    const rating = await Rating.create(ratingData);
    
    // Update user's average rating
    const avgRating = await Rating.getAverageRating(ratingData.ratedUserId);
    await User.updateRating(ratingData.ratedUserId, parseFloat(avgRating.average_rating));
    
    res.status(201).json(rating);
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;