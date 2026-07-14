const pool = require('../config/database');

class SwapRequest {
  static async create(swapData) {
    const { requesterId, receiverId, offeredSkillId, wantedSkillId, message } = swapData;
    
    const query = `
      INSERT INTO swap_requests (requester_id, receiver_id, offered_skill_id, wanted_skill_id, message, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, 'pending', NOW(), NOW())
      RETURNING *
    `;
    
    const values = [requesterId, receiverId, offeredSkillId, wantedSkillId, message];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM swap_requests WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId) {
    const query = `
      SELECT sr.*, 
             req.name as requester_name, req.profile_photo as requester_photo,
             rec.name as receiver_name, rec.profile_photo as receiver_photo,
             os.name as offered_skill_name, ws.name as wanted_skill_name
      FROM swap_requests sr
      JOIN users req ON sr.requester_id = req.id
      JOIN users rec ON sr.receiver_id = rec.id
      JOIN skills os ON sr.offered_skill_id = os.id
      JOIN skills ws ON sr.wanted_skill_id = ws.id
      WHERE sr.requester_id = $1 OR sr.receiver_id = $1
      ORDER BY sr.created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    const query = `
      SELECT sr.*, 
             req.name as requester_name, req.profile_photo as requester_photo,
             rec.name as receiver_name, rec.profile_photo as receiver_photo,
             os.name as offered_skill_name, ws.name as wanted_skill_name
      FROM swap_requests sr
      JOIN users req ON sr.requester_id = req.id
      JOIN users rec ON sr.receiver_id = rec.id
      JOIN skills os ON sr.offered_skill_id = os.id
      JOIN skills ws ON sr.wanted_skill_id = ws.id
      ORDER BY sr.created_at DESC
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status, userId = null) {
    let query = `
      UPDATE swap_requests 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
    `;
    const values = [status, id];

    if (userId) {
      query += ' AND (requester_id = $3 OR receiver_id = $3)';
      values.push(userId);
    }

    query += ' RETURNING *';

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id, userId) {
    const query = `
      DELETE FROM swap_requests 
      WHERE id = $1 AND requester_id = $2
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SwapRequest;