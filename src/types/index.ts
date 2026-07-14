export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  isPublic: boolean;
  availability: string[];
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  rating: number;
  totalSwaps: number;
  joinedDate: string;
  isActive: boolean;
  role: 'user' | 'admin';
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  receiverId: string;
  offeredSkillId: string;
  wantedSkillId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  swapId: string;
  raterId: string;
  ratedUserId: string;
  rating: number;
  feedback: string;
  createdAt: string;
}

export interface AdminMessage {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'error' | 'success';
  createdAt: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'swap_request' | 'swap_accepted' | 'swap_completed' | 'admin_message' | 'rating_received';
  isRead: boolean;
  createdAt: string;
  relatedId?: string; // ID of related swap, message, etc.
}

export interface AppContextType {
  currentUser: User | null;
  users: User[];
  swapRequests: SwapRequest[];
  ratings: Rating[];
  adminMessages: AdminMessage[];
  notifications: Notification[];
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  sendSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSwapRequest: (id: string, updates: Partial<SwapRequest>) => void;
  submitRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  sendAdminMessage: (message: Omit<AdminMessage, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  loginWithOAuth: (provider: 'google' | 'apple', userData: any) => Promise<boolean>;
}