const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const {
      name,
      email,
      password,
      location,
      profilePhoto,
      isPublic = true,
      availability = [],
      role = 'user'
    } = userData;

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const query = `
      INSERT INTO users (name, email, password, location, profile_photo, is_public, availability, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id, name, email, location, profile_photo, is_public, availability, rating, total_swaps, created_at, is_active, role
    `;
    
    const values = [name, email, hashedPassword, location, profilePhoto, isPublic, JSON.stringify(availability), role];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = `
      SELECT id, name, email, location, profile_photo, is_public, availability, 
             rating, total_swaps, created_at, is_active, role
      FROM users WHERE id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT id, name, email, location, profile_photo, is_public, availability, 
             rating, total_swaps, created_at, is_active, role
      FROM users WHERE role != 'admin'
    `;
    const values = [];
    let paramCount = 0;

    if (filters.isActive !== undefined) {
      paramCount++;
      query += ` AND is_active = $${paramCount}`;
      values.push(filters.isActive);
    }

    if (filters.isPublic !== undefined) {
      paramCount++;
      query += ` AND is_public = $${paramCount}`;
      values.push(filters.isPublic);
    }

    query += ' ORDER BY created_at DESC';
    
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updates) {
    const allowedFields = ['name', 'location', 'profile_photo', 'is_public', 'availability'];
    const setClause = [];
    const values = [];
    let paramCount = 0;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        paramCount++;
        setClause.push(`${key} = $${paramCount}`);
        values.push(key === 'availability' ? JSON.stringify(updates[key]) : updates[key]);
      }
    });

    if (setClause.length === 0) {
      throw new Error('No valid fields to update');
    }

    paramCount++;
    values.push(id);

    const query = `
      UPDATE users 
      SET ${setClause.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING id, name, email, location, profile_photo, is_public, availability, rating, total_swaps, created_at, is_active, role
    `;

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateRating(userId, newRating) {
    const query = `
      UPDATE users 
      SET rating = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING rating
    `;

    try {
      const result = await pool.query(query, [newRating, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async banUser(userId) {
    const query = `
      UPDATE users 
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
      RETURNING id, is_active
    `;

    try {
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;