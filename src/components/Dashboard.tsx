import React from 'react';
import { Star, TrendingUp, Clock, MessageSquare, Users, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const { currentUser, swapRequests, ratings, users } = useApp();

  if (!currentUser) return null; 

  const userSwapRequests = swapRequests.filter(
    req => req.requesterId === currentUser.id || req.receiverId === currentUser.id
  );

  const incomingRequests = userSwapRequests.filter(req => req.status === 'pending' && req.receiverId === currentUser.id).length;
  const outgoingRequests = userSwapRequests.filter(req => req.status === 'pending' && req.requesterId === currentUser.id).length;
  const completedSwaps = userSwapRequests.filter(req => req.status === 'completed').length;
  const activeSwaps = userSwapRequests.filter(req => req.status === 'accepted').length;

  const recentActivity = userSwapRequests
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const stats = [
    {
      title: 'Total Swaps',
      value: currentUser.totalSwaps,
      icon: MessageSquare,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Rating',
      value: currentUser.rating.toFixed(1),
      icon: Star,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Incoming Requests',
      value: incomingRequests,
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Active Swaps',
      value: activeSwaps,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-white/15 to-white/5 border border-white/20 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {currentUser.name}!</h1>
            <p className="text-white/80 text-base sm:text-lg">
              Ready to share your skills and learn something new today?
            </p>
          </div>
          <div className="hidden sm:block relative z-10 flex-shrink-0">
            <div className="backdrop-blur-md bg-white/20 rounded-full p-2 border-2 border-white/30">
              {currentUser.profilePhoto ? (
                <img
                  src={currentUser.profilePhoto}
                  alt={currentUser.name}
                  className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/80">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className="backdrop-blur-md bg-white/20 p-2 sm:p-3 rounded-lg">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Skills Overview */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white relative z-10">Your Skills</h2>
            <button
              onClick={() => onPageChange('profile')}
              className="backdrop-blur-xl bg-white/15 border border-white/20 text-white px-4 py-2 rounded-full hover:bg-white/25 hover:border-white/30 transition-all text-xs sm:text-sm font-medium relative z-10 self-start shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Manage Skills
            </button>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-white/90 mb-2 flex items-center">
                <Target className="h-4 w-4 mr-2 text-white/80" />
                Skills You Offer ({currentUser.skillsOffered.length})
              </h3>
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-3 sm:p-4 mb-4">
                <div className="flex flex-wrap gap-2">
                {currentUser.skillsOffered.slice(0, 3).map(skill => (
                  <span
                    key={skill.id}
                    className="px-2 sm:px-3 py-1 sm:py-2 backdrop-blur-md bg-green-500/20 text-green-100 border border-green-400/30 rounded-full text-xs sm:text-sm font-medium shadow-lg"
                  >
                    {skill.name}
                    <span className="ml-1 sm:ml-2 text-xs opacity-75">({skill.level})</span>
                  </span>
                ))}
                {currentUser.skillsOffered.length > 3 && (
                  <span className="px-2 sm:px-3 py-1 backdrop-blur-md bg-white/20 text-white/80 border border-white/30 rounded-full text-xs sm:text-sm">
                    +{currentUser.skillsOffered.length - 3} more
                  </span>
                )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-medium text-white/90 mb-2 flex items-center">
                <Target className="h-4 w-4 mr-2 text-white/80" />
                Skills You Want ({currentUser.skillsWanted.length})
              </h3>
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-3 sm:p-4">
                <div className="flex flex-wrap gap-2">
                {currentUser.skillsWanted.slice(0, 3).map(skill => (
                  <span
                    key={skill.id}
                    className="px-2 sm:px-3 py-1 sm:py-2 backdrop-blur-md bg-blue-500/20 text-blue-100 border border-blue-400/30 rounded-full text-xs sm:text-sm font-medium shadow-lg"
                  >
                    {skill.name}
                    <span className="ml-1 sm:ml-2 text-xs opacity-75">({skill.level})</span>
                  </span>
                ))}
                {currentUser.skillsWanted.length > 3 && (
                  <span className="px-2 sm:px-3 py-1 backdrop-blur-md bg-white/20 text-white/80 border border-white/30 rounded-full text-xs sm:text-sm">
                    +{currentUser.skillsWanted.length - 3} more
                  </span>
                )}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onPageChange('browse')}
            className="w-full mt-4 sm:mt-6 backdrop-blur-xl bg-gradient-to-r from-white/15 to-white/10 border border-white/20 text-white py-3 sm:py-4 px-6 rounded-full text-sm sm:text-base font-medium hover:from-white/25 hover:to-white/15 hover:border-white/30 transition-all shadow-lg relative z-10 hover:scale-105 transform"
          >
            Browse Skills
          </button>
        </div>

        {/* Recent Activity */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white relative z-10">Recent Activity</h2>
            <button
              onClick={() => onPageChange('swaps')}
              className="backdrop-blur-xl bg-white/15 border border-white/20 text-white px-4 py-2 rounded-full hover:bg-white/25 hover:border-white/30 transition-all text-xs sm:text-sm font-medium relative z-10 self-start shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View All
            </button>
          </div>

          <div className="space-y-4 relative z-10">
            {recentActivity.length > 0 ? (
              recentActivity.map(activity => {
                const otherUser = users.find(u => 
                  u.id === (activity.requesterId === currentUser.id ? activity.receiverId : activity.requesterId)
                );
                
                return (
                  <div key={activity.id} className="flex items-start sm:items-center space-x-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-3 hover:bg-white/20 transition-all">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'accepted' ? 'bg-green-500' :
                      activity.status === 'pending' ? 'bg-yellow-500' :
                      activity.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
                    } flex-shrink-0 mt-1 sm:mt-0`}></div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-white">
                        {activity.status === 'pending' && activity.requesterId === currentUser.id && 'Sent request to '}
                        {activity.status === 'pending' && activity.receiverId === currentUser.id && 'Received request from '}
                        {activity.status === 'accepted' && 'Swap accepted with '}
                        {activity.status === 'completed' && 'Completed swap with '}
                        {activity.status === 'rejected' && 'Swap rejected by '}
                        <span className="font-medium">{otherUser?.name}</span>
                      </p>
                      <p className="text-xs text-white/60">
                        {new Date(activity.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-4 sm:p-6 text-center">
                <p className="text-white/60">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;