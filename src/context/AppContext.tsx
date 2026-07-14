import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, SwapRequest, Rating, AdminMessage, Notification, AppContextType } from '../types';
import { mockUsers, mockSwapRequests, mockRatings, mockAdminMessages, mockNotifications } from '../data/mockData';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(mockSwapRequests);
  const [ratings, setRatings] = useState<Rating[]>(mockRatings);
  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>(mockAdminMessages);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login logic
    const user = users.find(u => u.email === email && u.isActive);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    
    // Show success message for admin profile updates
    if (currentUser.role === 'admin') {
      // In a real app, this would show a toast notification
      console.log('Admin profile updated successfully');
    }
  };

  const sendSwapRequest = (request: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: SwapRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSwapRequests([...swapRequests, newRequest]);
    
    // Add notification for the receiver
    const requester = users.find(u => u.id === request.requesterId);
    addNotification({
      userId: request.receiverId,
      title: 'New Swap Request',
      message: `${requester?.name} wants to exchange skills with you`,
      type: 'swap_request',
      isRead: false,
      relatedId: newRequest.id
    });
  };

  const updateSwapRequest = (id: string, updates: Partial<SwapRequest>) => {
    const updatedRequests = swapRequests.map(request => {
      if (request.id === id) {
        const updatedRequest = { ...request, ...updates, updatedAt: new Date().toISOString() };
        
        // Add notifications based on status change
        if (updates.status === 'accepted') {
          const receiver = users.find(u => u.id === request.receiverId);
          addNotification({
            userId: request.requesterId,
            title: 'Swap Request Accepted',
            message: `${receiver?.name} accepted your swap request`,
            type: 'swap_accepted',
            isRead: false,
            relatedId: id
          });
        } else if (updates.status === 'completed') {
          const otherUserId = currentUser?.id === request.requesterId ? request.receiverId : request.requesterId;
          const otherUser = users.find(u => u.id === otherUserId);
          addNotification({
            userId: otherUserId,
            title: 'Swap Completed',
            message: `Your skill exchange with ${currentUser?.name} has been completed`,
            type: 'swap_completed',
            isRead: false,
            relatedId: id
          });
        }
        
        return updatedRequest;
      }
      return request;
    });
    
    setSwapRequests(updatedRequests);
  };

  const submitRating = (rating: Omit<Rating, 'id' | 'createdAt'>) => {
    const newRating: Rating = {
      ...rating,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setRatings([...ratings, newRating]);

    // Update user rating
    const userRatings = [...ratings, newRating].filter(r => r.ratedUserId === rating.ratedUserId);
    const avgRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
    
    setUsers(users.map(u => 
      u.id === rating.ratedUserId 
        ? { ...u, rating: Math.round(avgRating * 10) / 10 }
        : u
    ));
    
    // Add notification for the rated user
    const rater = users.find(u => u.id === rating.raterId);
    addNotification({
      userId: rating.ratedUserId,
      title: 'New Rating Received',
      message: `${rater?.name} rated your skill exchange (${rating.rating} stars)`,
      type: 'rating_received',
      isRead: false,
      relatedId: rating.swapId
    });
  };

  const banUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isActive: false } : u));
  };

  const unbanUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isActive: true } : u));
  };
  const sendAdminMessage = (message: Omit<AdminMessage, 'id' | 'createdAt'>) => {
    const newMessage: AdminMessage = {
      ...message,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAdminMessages([newMessage, ...adminMessages]);
  };

  const updateAdminMessage = (id: string, updates: Partial<AdminMessage>) => {
    setAdminMessages(prev => 
      prev.map(message => 
        message.id === id 
          ? { ...message, ...updates }
          : message
      )
    );
  };

  const deleteAdminMessage = (id: string) => {
    setAdminMessages(prev => prev.filter(message => message.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => 
      prev.map(notification => 
        notification.userId === currentUser.id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const loginWithOAuth = async (provider: 'google' | 'apple', userData: any): Promise<boolean> => {
    // In a real implementation, this would:
    // 1. Validate the OAuth token with the provider
    // 2. Extract user information
    // 3. Create or update user in database
    // 4. Return authentication status
    
    try {
      // Check if user already exists
      let user = users.find(u => u.email === userData.email);
      
      if (!user) {
        // Create new OAuth user
        const newUser: User = {
          id: `oauth-${provider}-${Date.now()}`,
          name: userData.name || `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
          email: userData.email,
          location: userData.location || '',
          profilePhoto: userData.picture || userData.profilePhoto || '',
          isPublic: true,
          availability: ['Weekdays'],
          skillsOffered: [],
          skillsWanted: [],
          rating: 0,
          totalSwaps: 0,
          joinedDate: new Date().toISOString(),
          isActive: true,
          role: 'user'
        };
        
        setUsers(prev => [...prev, newUser]);
        user = newUser;
      }
      
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error('OAuth login error:', error);
      return false;
    }
  };

  const value: AppContextType = {
    currentUser,
    users,
    swapRequests,
    ratings,
    adminMessages,
    notifications,
    setCurrentUser,
    login,
    logout,
    updateProfile,
    sendSwapRequest,
    updateSwapRequest,
    submitRating,
    banUser,
    unbanUser,
    sendAdminMessage,
    updateAdminMessage,
    deleteAdminMessage,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    loginWithOAuth,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};