const express = require('express');
const Skill = require('../models/Skill');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's skills
router.get('/my-skills', authenticateToken, async (req, res) => {
  try {
    const { type } = req.query;
    const skills = await Skill.findByUserId(req.user.id, type);
    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search skills
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q: searchTerm, category, level } = req.query;
    const skills = await Skill.search(searchTerm, category, level);
    res.json(skills);
  } catch (error) {
    console.error('Search skills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create skill
router.post('/', authenticateToken, async (req, res) => {
  try {
    const skillData = {
      ...req.body,
      userId: req.user.id
    };
    
    const skill = await Skill.create(skillData);
    res.status(201).json(skill);
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update skill
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const skill = await Skill.update(id, req.user.id, updates);
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found or unauthorized' });
    }

    res.json(skill);
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete skill
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.delete(id, req.user.id);
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found or unauthorized' });
    }

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;