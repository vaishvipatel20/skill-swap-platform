import React, { useState } from 'react';
import { User, Settings, LogOut, Menu, X, Users, BarChart3, MessageSquare, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import NotificationDropdown from './NotificationDropdown';
import AdminProfile from './admin/AdminProfile';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { currentUser, logout, adminMessages, swapRequests, notifications } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdminProfile, setShowAdminProfile] = useState(false);

  const userNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'browse', label: 'Browse Skills', icon: Users },
    { id: 'swaps', label: 'My Swaps', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: BarChart3 },
    { id: 'user-management', label: 'User Management', icon: Users },
    { id: 'swap-monitoring', label: 'Swap Monitoring', icon: MessageSquare },
    { id: 'messages', label: 'Platform Messages', icon: Bell },
  ];

  const navItems = currentUser?.role === 'admin' ? adminNavItems : userNavItems;
  const activeMessages = adminMessages.filter(m => m.isActive);
  
  // Count incoming swap requests for mobile notification badge (fallback)
  const incomingRequestsCount = currentUser ? swapRequests.filter(
    req => req.receiverId === currentUser.id && req.status === 'pending'
  ).length : 0;

  // Count unread notifications
  const unreadNotificationsCount = currentUser ? notifications.filter(
    n => n.userId === currentUser.id && !n.isRead
  ).length : 0;

  const handleLogout = () => {
    logout();
    onPageChange('login');
  };

  if (!currentUser) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-green-500">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-15"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/40 to-indigo-900/40"></div>
      
      {/* Professional Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-32 w-40 h-40 bg-indigo-400/5 rounded-full blur-2xl animate-pulse"></div>
      
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/10 shadow-2xl border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-lg sm:text-xl font-bold text-white">SkillXchange</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-4 xl:space-x-5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                  className={`flex flex-col items-center justify-center px-2 xl:px-3 py-1.5 xl:py-2 rounded-md text-[10px] xl:text-xs font-medium transition-all transform hover:scale-105 backdrop-blur-xl border shadow-lg hover:shadow-xl min-w-[100px] xl:min-w-[110px] ${
                      currentPage === item.id
                        ? 'text-white bg-gradient-to-br from-blue-500/40 to-purple-500/40 border-white/40'
                        : 'text-white/80 hover:text-white bg-white/15 hover:bg-white/25 border-white/20 hover:border-white/30'
                    }`}
                  >
                    <Icon className="h-4 w-4 xl:h-5 xl:w-5 mb-1" />
                    <span className="text-[10px] xl:text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Tablet Navigation */}
            <nav className="hidden md:flex lg:hidden space-x-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                  className={`flex flex-col items-center justify-center px-2 py-1.5 rounded-md text-[10px] font-medium transition-all transform hover:scale-105 backdrop-blur-xl border shadow-lg hover:shadow-xl min-w-[90px] ${
                      currentPage === item.id
                        ? 'text-white bg-gradient-to-br from-blue-500/40 to-purple-500/40 border-white/40'
                        : 'text-white/80 hover:text-white bg-white/15 hover:bg-white/25 border-white/20 hover:border-white/30'
                    }`}
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-[10px] font-medium truncate max-w-16">{item.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notification Dropdown */}
              <NotificationDropdown unreadCount={unreadNotificationsCount} />
              
              {/* Fallback notification for mobile - show swap requests if no notifications system */}
              {currentUser?.role !== 'admin' && unreadNotificationsCount === 0 && incomingRequestsCount > 0 && (
                <div className="sm:hidden">
                  <button
                    onClick={() => onPageChange('swaps')}
                    className="relative"
                  >
                    <MessageSquare className="h-5 w-5 text-white/80 hover:text-white transition-colors" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                      {incomingRequestsCount}
                    </span>
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => currentUser.role === 'admin' ? setShowAdminProfile(true) : onPageChange('profile')}
                  className="flex items-center space-x-3 hover:bg-white/10 rounded-full p-1 transition-colors"
                >
                  {currentUser.profilePhoto ? (
                    <img
                      src={currentUser.profilePhoto}
                      alt={currentUser.name}
                      className="h-8 w-8 rounded-full object-cover border-2 border-white/30"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-white truncate max-w-32">{currentUser.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white/80 hover:text-white p-1"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden backdrop-blur-xl bg-white/10 border-t border-white/20 shadow-2xl">
            <div className="px-3 pt-3 pb-3 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-4 rounded-2xl text-sm font-medium transition-all backdrop-blur-xl border shadow-lg ${
                      currentPage === item.id
                        ? 'text-white bg-gradient-to-br from-blue-500/40 to-purple-500/40 border-white/40'
                        : 'text-white/80 hover:text-white bg-white/15 hover:bg-white/25 border-white/20 hover:border-white/30'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10 ${showAdminProfile ? 'overflow-hidden' : 'overflow-auto'}`}>
        {children}
      </main>

      {/* Admin Profile Modal */}
      {showAdminProfile && (
        <AdminProfile onClose={() => setShowAdminProfile(false)} />
      )}
    </div>
  );
};

export default Layout;