import React, { useState } from 'react';
import { Search, User, MapPin, Star, Shield, Ban, Eye, X, Mail, Calendar, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const UserManagement: React.FC = () => {
  const { users, banUser, unbanUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned'>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const filteredUsers = users.filter(user => {
    if (user.role === 'admin') return false;
    
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'banned' && !user.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const handleBanUser = (userId: string) => {
    if (window.confirm('Are you sure you want to ban this user?')) {
      banUser(userId);
    }
  };

  const handleUnbanUser = (userId: string) => {
    if (window.confirm('Are you sure you want to unban this user?')) {
      unbanUser(userId);
    }
  };
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setShowUserModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-white/80">Manage user accounts and monitor platform activity</p>
      </div>

      {/* Search and Filters */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white"
          >
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="banned">Banned Users</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/20">
            <thead className="backdrop-blur-md bg-white/10">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                  User
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                  Rating
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                  Swaps
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="backdrop-blur-md bg-white/5 divide-y divide-white/20">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/10 transition-colors">
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex items-center">
                      {user.profilePhoto ? (
                        <img
                          src={user.profilePhoto}
                          alt={user.name}
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-white/30 shadow-lg"
                        />
                      ) : (
                        <div className="h-8 w-8 sm:h-10 sm:w-10 backdrop-blur-md bg-white/20 border-2 border-white/30 rounded-full flex items-center justify-center shadow-lg">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-white/80" />
                        </div>
                      )}
                      <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-white truncate">{user.name}</div>
                        <div className="text-xs sm:text-sm text-white/60 truncate">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-white/60">
                      <MapPin className="h-4 w-4 mr-1" />
                      {user.location || 'Not specified'}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-white">{user.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-white">
                    {user.totalSwaps}
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {user.skillsOffered.length} offered, {user.skillsWanted.length} wanted
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive
                        ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                        : 'bg-red-500/20 text-red-100 border border-red-400/30'
                    }`}>
                      {user.isActive ? 'Active' : 'Banned'}
                    </span>
                    {user.isPublic && (
                      <div className="hidden sm:flex items-center mt-1">
                        <Eye className="h-3 w-3 text-blue-500 mr-1" />
                        <span className="text-xs text-blue-500">Public</span>
                      </div>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-300 hover:text-blue-100 text-xs sm:text-sm"
                      >
                        View
                      </button>
                      {user.isActive ? (
                        <button
                          onClick={() => handleBanUser(user.id)}
                          className="text-red-300 hover:text-red-100 flex items-center text-xs sm:text-sm"
                        >
                          <Ban className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Ban
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnbanUser(user.id)}
                          className="text-green-300 hover:text-green-100 flex items-center text-xs sm:text-sm"
                        >
                          <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Unban
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
            <p className="text-white/60">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl text-center">
          <div className="text-2xl sm:text-3xl font-bold text-blue-300 mb-2">
            {users.filter(u => u.role !== 'admin' && u.isActive).length}
          </div>
          <div className="text-sm text-white/80">Active Users</div>
        </div>
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl text-center">
          <div className="text-2xl sm:text-3xl font-bold text-red-300 mb-2">
            {users.filter(u => u.role !== 'admin' && !u.isActive).length}
          </div>
          <div className="text-sm text-white/80">Banned Users</div>
        </div>
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl text-center">
          <div className="text-2xl sm:text-3xl font-bold text-green-300 mb-2">
            {users.filter(u => u.role !== 'admin' && u.isPublic).length}
          </div>
          <div className="text-sm text-white/80">Public Profiles</div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">User Details</h3>
              <button
                onClick={closeUserModal}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* User Profile Section */}
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
                <h4 className="text-lg font-medium text-white mb-4">Profile Information</h4>
                <div className="flex items-start space-x-4 mb-4">
                  {selectedUser.profilePhoto ? (
                    <img
                      src={selectedUser.profilePhoto}
                      alt={selectedUser.name}
                      className="h-16 w-16 rounded-full object-cover border-2 border-white/30 shadow-lg"
                    />
                  ) : (
                    <div className="h-16 w-16 backdrop-blur-md bg-white/20 border-2 border-white/30 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-8 w-8 text-white/80" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h5 className="text-lg font-semibold text-white">{selectedUser.name}</h5>
                    <div className="flex items-center text-white/80 mb-2">
                      <Mail className="h-4 w-4 mr-2" />
                      {selectedUser.email}
                    </div>
                    {selectedUser.location && (
                      <div className="flex items-center text-white/80 mb-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        {selectedUser.location}
                      </div>
                    )}
                    <div className="flex items-center text-white/80">
                      <Calendar className="h-4 w-4 mr-2" />
                      Joined {new Date(selectedUser.joinedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{selectedUser.rating.toFixed(1)}</div>
                    <div className="text-xs text-white/60">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{selectedUser.totalSwaps}</div>
                    <div className="text-xs text-white/60">Total Swaps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{selectedUser.skillsOffered.length}</div>
                    <div className="text-xs text-white/60">Skills Offered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{selectedUser.skillsWanted.length}</div>
                    <div className="text-xs text-white/60">Skills Wanted</div>
                  </div>
                </div>
              </div>

              {/* Skills Offered */}
              {selectedUser.skillsOffered.length > 0 && (
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
                  <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Skills Offered
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedUser.skillsOffered.map((skill: any) => (
                      <div key={skill.id} className="backdrop-blur-md bg-green-500/20 border border-green-400/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-white text-sm">{skill.name}</h5>
                          <span className="px-2 py-1 bg-green-500/30 text-green-100 rounded-full text-xs">
                            {skill.level}
                          </span>
                        </div>
                        <p className="text-xs text-white/80 mb-2">{skill.description}</p>
                        <span className="inline-block px-2 py-1 bg-white/20 text-white/70 rounded-full text-xs">
                          {skill.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Wanted */}
              {selectedUser.skillsWanted.length > 0 && (
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
                  <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Skills Wanted
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedUser.skillsWanted.map((skill: any) => (
                      <div key={skill.id} className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-white text-sm">{skill.name}</h5>
                          <span className="px-2 py-1 bg-blue-500/30 text-blue-100 rounded-full text-xs">
                            {skill.level}
                          </span>
                        </div>
                        <p className="text-xs text-white/80 mb-2">{skill.description}</p>
                        <span className="inline-block px-2 py-1 bg-white/20 text-white/70 rounded-full text-xs">
                          {skill.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              {selectedUser.availability.length > 0 && (
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
                  <h4 className="text-lg font-medium text-white mb-4">Availability</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.availability.map((time: string) => (
                      <span key={time} className="px-3 py-1 bg-purple-500/20 text-purple-100 border border-purple-400/30 rounded-full text-sm">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeUserModal}
                className="px-6 py-3 backdrop-blur-xl bg-white/15 border border-white/20 text-white rounded-full hover:bg-white/25 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;