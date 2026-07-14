import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, MessageSquare, Activity, BarChart3 } from 'lucide-react';
import UserManagement from './UserManagement';
import SwapMonitoring from './SwapMonitoring';
import PlatformMessages from './PlatformMessages';

const AdminDashboard: React.FC = () => {
  const { users = [], swapRequests = [] } = useApp() || {};
  const [activeTab, setActiveTab] = React.useState('overview');

  const stats = {
    totalUsers: users.length,
    activeSwaps: swapRequests.filter(swap => swap.status === 'pending').length,
    completedSwaps: swapRequests.filter(swap => swap.status === 'completed').length,
    totalSkills: users.reduce((total, user) => total + user.skillsOffered.length + user.skillsWanted.length, 0)
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'swaps':
        return <SwapMonitoring />;
      case 'messages':
        return <PlatformMessages />;
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <div className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-300" />
                </div>
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">Active Swaps</p>
                  <p className="text-2xl font-bold text-white">{stats.activeSwaps}</p>
                </div>
                <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 p-3 rounded-lg">
                  <Activity className="h-6 w-6 text-green-300" />
                </div>
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">Completed Swaps</p>
                  <p className="text-2xl font-bold text-white">{stats.completedSwaps}</p>
                </div>
                <div className="backdrop-blur-md bg-purple-500/20 border border-purple-400/30 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-300" />
                </div>
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">Total Skills</p>
                  <p className="text-2xl font-bold text-white">{stats.totalSkills}</p>
                </div>
                <div className="backdrop-blur-md bg-orange-500/20 border border-orange-400/30 p-3 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-orange-300" />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
      </div>

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
        <nav className="flex flex-wrap gap-2 sm:gap-8 p-4 sm:p-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'swaps', label: 'Swap Monitoring', icon: Activity },
            { id: 'messages', label: 'Platform Messages', icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-3 sm:px-4 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'backdrop-blur-md bg-white/20 border border-white/30 text-white'
                    : 'text-white/60 hover:text-white/80 hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.id === 'overview' ? 'Overview' : tab.id === 'users' ? 'Users' : tab.id === 'swaps' ? 'Swaps' : 'Messages'}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;