# SkillXchange Platform
#video link- https://youtu.be/cwbEqvSOSlQ?si=tBIVTZ3Fyx_zA_v0
A comprehensive skill exchange platform that enables users to list their skills, request others in return, and manage skill swaps with a complete admin panel.

## Features

### User Features
- **Profile Management**: Name, location, profile photo, availability settings
- **Skills Management**: List skills offered and wanted with categories and levels
- **Privacy Controls**: Public/private profile visibility
- **Skill Discovery**: Browse and search users by skills, categories, and levels
- **Swap Requests**: Send, accept, reject, and manage skill exchange requests
- **Ratings & Feedback**: Rate and provide feedback after completed swaps
- **Request Management**: Delete pending swap requests

### Admin Features
- **User Management**: View, monitor, and ban users who violate policies
- **Swap Monitoring**: Track pending, accepted, completed, and cancelled swaps
- **Content Moderation**: Review and reject inappropriate skill descriptions
- **Platform Messaging**: Send platform-wide announcements and updates
- **Analytics Dashboard**: Monitor user activity, swap statistics, and platform health

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for development and building

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** authentication
- **bcryptjs** for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE skillxchange;
```

2. Run the schema file to create tables:
```bash
psql -U your_username -d skillxchange -f server/database/schema.sql
```

### Environment Configuration

1. Copy the environment example file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skillxchange
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the backend server:
```bash
npm run server:dev
```

3. In a new terminal, start the frontend development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Default Login Credentials

### Admin Account
- Email: `admin@skillxchange.com`
- Password: `admin123`

### Demo User Accounts
- Email: `sarah@example.com` / Password: `demo123`
- Email: `mike@example.com` / Password: `demo123`
- Email: `emma@example.com` / Password: `demo123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/:id/ban` - Ban user (admin only)

### Skills
- `GET /api/skills/my-skills` - Get user's skills
- `GET /api/skills/search` - Search skills
- `POST /api/skills` - Create skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Swaps
- `GET /api/swaps/my-swaps` - Get user's swaps
- `GET /api/swaps/all` - Get all swaps (admin only)
- `POST /api/swaps` - Create swap request
- `PUT /api/swaps/:id/status` - Update swap status
- `DELETE /api/swaps/:id` - Delete swap request

### Ratings
- `GET /api/ratings/user/:userId` - Get user ratings
- `GET /api/ratings/all` - Get all ratings (admin only)
- `POST /api/ratings` - Create rating

### Admin
- `GET /api/admin/messages` - Get admin messages
- `POST /api/admin/messages` - Create admin message
- `PUT /api/admin/messages/:id` - Update admin message
- `DELETE /api/admin/messages/:id` - Delete admin message

## Database Schema

The application uses the following main tables:
- `users` - User accounts and profiles
- `skills` - Skills offered and wanted by users
- `swap_requests` - Skill exchange requests
- `ratings` - User ratings and feedback
- `admin_messages` - Platform-wide messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
