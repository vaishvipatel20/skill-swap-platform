-- SkillXchange Database Schema

-- Create database (run this separately)
-- CREATE DATABASE skillxchange;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    profile_photo TEXT,
    is_public BOOLEAN DEFAULT true,
    availability JSONB DEFAULT '[]',
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_swaps INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    type VARCHAR(20) NOT NULL CHECK (type IN ('offered', 'wanted')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Swap requests table
CREATE TABLE IF NOT EXISTS swap_requests (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    offered_skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    wanted_skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    swap_id INTEGER REFERENCES swap_requests(id) ON DELETE CASCADE,
    rater_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rated_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin messages table
CREATE TABLE IF NOT EXISTS admin_messages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_public ON users(is_public);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_type ON skills(type);
CREATE INDEX IF NOT EXISTS idx_swap_requests_requester ON swap_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_receiver ON swap_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_status ON swap_requests(status);
CREATE INDEX IF NOT EXISTS idx_ratings_rated_user ON ratings(rated_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_messages_active ON admin_messages(is_active);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role, is_public) 
VALUES (
    'Admin User', 
    'admin@skillxchange.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9jm', 
    'admin', 
    false
) ON CONFLICT (email) DO NOTHING;

-- Insert sample users for testing (password: demo123)
INSERT INTO users (name, email, password, location, profile_photo, availability) VALUES
(
    'Sarah Johnson',
    'sarah@example.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9jm',
    'San Francisco, CA',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    '["Weekends", "Evenings"]'
),
(
    'Mike Chen',
    'mike@example.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9jm',
    'New York, NY',
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    '["Weekdays", "Evenings"]'
),
(
    'Emma Wilson',
    'emma@example.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9jm',
    'London, UK',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    '["Weekends"]'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample skills
INSERT INTO skills (user_id, name, description, category, level, type) VALUES
(2, 'Adobe Photoshop', 'Professional photo editing and design', 'Design', 'Expert', 'offered'),
(2, 'UI/UX Design', 'Modern interface and user experience design', 'Design', 'Advanced', 'offered'),
(2, 'Python Programming', 'Learn Python for data analysis', 'Programming', 'Intermediate', 'wanted'),
(3, 'Python Programming', 'Full-stack Python development', 'Programming', 'Expert', 'offered'),
(3, 'Data Analysis', 'Statistical analysis and visualization', 'Data', 'Advanced', 'offered'),
(3, 'Digital Marketing', 'Social media and content marketing', 'Marketing', 'Beginner', 'wanted'),
(4, 'Digital Marketing', 'SEO, SEM, and social media marketing', 'Marketing', 'Expert', 'offered'),
(4, 'Content Writing', 'Blog posts and copywriting', 'Writing', 'Advanced', 'offered'),
(4, 'Web Development', 'Frontend React development', 'Programming', 'Intermediate', 'wanted');

-- Insert sample admin message
INSERT INTO admin_messages (title, content, type) VALUES
('Welcome to SkillXchange Platform!', 'We''re excited to have you join our community of skill exchangers.', 'info');