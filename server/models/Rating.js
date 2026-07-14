const pool = require('../config/database');

class Rating {
  static async create(ratingData) {
    const { swapId, raterId, ratedUserId, rating, feedback } = ratingData;
    
    const query = `
      INSERT INTO ratings (swap_id, rater_id, rated_user_id, rating, feedback, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    
    const values = [swapId, raterId, ratedUserId, rating, feedback];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId) {
    const query = `
      SELECT r.*, u.name as rater_name, u.profile_photo as rater_photo
      FROM ratings r
      JOIN users u ON r.rater_id = u.id
      WHERE r.rated_user_id = $1
      ORDER BY r.created_at DESC
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
      SELECT r.*, 
             rater.name as rater_name, rater.profile_photo as rater_photo,
             rated.name as rated_user_name, rated.profile_photo as rated_user_photo
      FROM ratings r
      JOIN users rater ON r.rater_id = rater.id
      JOIN users rated ON r.rated_user_id = rated.id
      ORDER BY r.created_at DESC
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getAverageRating(userId) {
    const query = `
      SELECT AVG(rating) as average_rating, COUNT(*) as total_ratings
      FROM ratings
      WHERE rated_user_id = $1
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Rating;