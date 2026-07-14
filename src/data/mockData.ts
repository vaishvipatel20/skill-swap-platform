import { User, SwapRequest, Rating, AdminMessage, Notification } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    location: 'San Francisco, CA',
    profilePhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    isPublic: true,
    availability: ['Weekends', 'Evenings'],
    skillsOffered: [
      { id: '1', name: 'Adobe Photoshop', description: 'Professional photo editing and design', category: 'Design', level: 'Expert' },
      { id: '2', name: 'UI/UX Design', description: 'Modern interface and user experience design', category: 'Design', level: 'Advanced' }
    ],
    skillsWanted: [
      { id: '3', name: 'Python Programming', description: 'Learn Python for data analysis', category: 'Programming', level: 'Intermediate' }
    ],
    rating: 4.8,
    totalSwaps: 12,
    joinedDate: '2024-01-15',
    isActive: true,
    role: 'user'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    location: 'New York, NY',
    profilePhoto: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    isPublic: true,
    availability: ['Weekdays', 'Evenings'],
    skillsOffered: [
      { id: '4', name: 'Python Programming', description: 'Full-stack Python development', category: 'Programming', level: 'Expert' },
      { id: '5', name: 'Data Analysis', description: 'Statistical analysis and visualization', category: 'Data', level: 'Advanced' }
    ],
    skillsWanted: [
      { id: '6', name: 'Digital Marketing', description: 'Social media and content marketing', category: 'Marketing', level: 'Beginner' }
    ],
    rating: 4.9,
    totalSwaps: 18,
    joinedDate: '2023-11-22',
    isActive: true,
    role: 'user'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    location: 'London, UK',
    profilePhoto: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    isPublic: true,
    availability: ['Weekends'],
    skillsOffered: [
      { id: '7', name: 'Digital Marketing', description: 'SEO, SEM, and social media marketing', category: 'Marketing', level: 'Expert' },
      { id: '8', name: 'Content Writing', description: 'Blog posts and copywriting', category: 'Writing', level: 'Advanced' }
    ],
    skillsWanted: [
      { id: '9', name: 'Web Development', description: 'Frontend React development', category: 'Programming', level: 'Intermediate' }
    ],
    rating: 4.7,
    totalSwaps: 8,
    joinedDate: '2024-02-10',
    isActive: true,
    role: 'user'
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@skillxchange.com',
    location: 'Platform',
    isPublic: false,
    availability: [],
    skillsOffered: [],
    skillsWanted: [],
    rating: 5.0,
    totalSwaps: 0,
    joinedDate: '2023-01-01',
    isActive: true,
    role: 'admin'
  }
];

export const mockSwapRequests: SwapRequest[] = [
  {
    id: '1',
    requesterId: '1',
    receiverId: '2',
    offeredSkillId: '1',
    wantedSkillId: '4',
    message: 'Hi! I\'d love to learn Python in exchange for teaching Photoshop. I have 5+ years of experience.',
    status: 'pending',
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-20T10:00:00Z'
  },
  {
    id: '2',
    requesterId: '2',
    receiverId: '3',
    offeredSkillId: '5',
    wantedSkillId: '7',
    message: 'Looking to trade data analysis skills for digital marketing expertise!',
    status: 'accepted',
    createdAt: '2024-12-19T14:30:00Z',
    updatedAt: '2024-12-19T16:45:00Z'
  }
];

export const mockRatings: Rating[] = [
  {
    id: '1',
    swapId: '2',
    raterId: '2',
    ratedUserId: '3',
    rating: 5,
    feedback: 'Emma was an excellent teacher! Very patient and knowledgeable about digital marketing.',
    createdAt: '2024-12-19T18:00:00Z'
  }
];

export const mockAdminMessages: AdminMessage[] = [
  {
    id: '1',
    title: 'Welcome to SkillXchange Platform!',
    content: 'We\'re excited to have you join our community of skill exchangers.',
    type: 'info',
    createdAt: '2024-12-20T09:00:00Z',
    isActive: true
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'New Swap Request',
    message: 'Mike Chen wants to exchange skills with you',
    type: 'swap_request',
    isRead: false,
    createdAt: '2024-12-20T10:30:00Z',
    relatedId: '1'
  },
  {
    id: '2',
    userId: '2',
    title: 'Swap Request Accepted',
    message: 'Emma Wilson accepted your swap request',
    type: 'swap_accepted',
    isRead: false,
    createdAt: '2024-12-19T16:45:00Z',
    relatedId: '2'
  },
  {
    id: '3',
    userId: '1',
    title: 'Welcome to SkillXchange!',
    message: 'We\'re excited to have you join our community of skill exchangers.',
    type: 'admin_message',
    isRead: true,
    createdAt: '2024-12-20T09:00:00Z'
  }
];