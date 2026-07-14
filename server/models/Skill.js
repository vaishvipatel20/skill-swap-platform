const pool = require('../config/database');

class Skill {
  static async create(skillData) {
    const { userId, name, description, category, level, type } = skillData;
    
    const query = `
      INSERT INTO skills (user_id, name, description, category, level, type, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;
    
    const values = [userId, name, description, category, level, type];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId, type = null) {
    let query = 'SELECT * FROM skills WHERE user_id = $1';
    const values = [userId];
    
    if (type) {
      query += ' AND type = $2';
      values.push(type);
    }
    
    query += ' ORDER BY created_at DESC';
    
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async search(searchTerm, category = null, level = null) {
    let query = `
      SELECT s.*, u.name as user_name, u.profile_photo, u.location, u.rating
      FROM skills s
      JOIN users u ON s.user_id = u.id
      WHERE u.is_public = true AND u.is_active = true AND s.type = 'offered'
    `;
    const values = [];
    let paramCount = 0;

    if (searchTerm) {
      paramCount++;
      query += ` AND (s.name ILIKE $${paramCount} OR s.description ILIKE $${paramCount})`;
      values.push(`%${searchTerm}%`);
    }

    if (category) {
      paramCount++;
      query += ` AND s.category = $${paramCount}`;
      values.push(category);
    }

    if (level) {
      paramCount++;
      query += ` AND s.level = $${paramCount}`;
      values.push(level);
    }

    query += ' ORDER BY s.created_at DESC';
    
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM skills WHERE id = $1 AND user_id = $2 RETURNING *';
    
    try {
      const result = await pool.query(query, [id, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userId, updates) {
    const allowedFields = ['name', 'description', 'category', 'level'];
    const setClause = [];
    const values = [];
    let paramCount = 0;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        paramCount++;
        setClause.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
      }
    });

    if (setClause.length === 0) {
      throw new Error('No valid fields to update');
    }

    paramCount++;
    values.push(id);
    paramCount++;
    values.push(userId);

    const query = `
      UPDATE skills 
      SET ${setClause.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount - 1} AND user_id = $${paramCount}
      RETURNING *
    `;

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Skill;