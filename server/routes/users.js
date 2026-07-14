const express = require('express');
const User = require('../models/User');
const Skill = require('../models/Skill');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users (public profiles only for regular users)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const filters = req.user.role === 'admin' ? {} : { isPublic: true, isActive: true };
    const users = await User.findAll(filters);
    
    // Get skills for each user
    const usersWithSkills = await Promise.all(
      users.map(async (user) => {
        const skillsOffered = await Skill.findByUserId(user.id, 'offered');
        const skillsWanted = await Skill.findByUserId(user.id, 'wanted');
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          location: user.location,
          profilePhoto: user.profile_photo,
          isPublic: user.is_public,
          availability: JSON.parse(user.availability || '[]'),
          skillsOffered,
          skillsWanted,
          rating: user.rating,
          totalSwaps: user.total_swaps,
          joinedDate: user.created_at,
          isActive: user.is_active,
          role: user.role
        };
      })
    );

    res.json(usersWithSkills);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.update(req.user.id, updates);
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        location: updatedUser.location,
        profilePhoto: updatedUser.profile_photo,
        isPublic: updatedUser.is_public,
        availability: JSON.parse(updatedUser.availability || '[]'),
        rating: updatedUser.rating,
        totalSwaps: updatedUser.total_swaps,
        joinedDate: updatedUser.created_at,
        isActive: updatedUser.is_active,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ban user (admin only)
router.put('/:id/ban', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.banUser(id);
    
    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User banned successfully' });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;