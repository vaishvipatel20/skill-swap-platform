import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Star, Clock, ArrowRight, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User as UserType } from '../types';
import UserProfileModal from './UserProfileModal';

interface BrowseSkillsProps {
  onPageChange: (page: string) => void;
}

const BrowseSkills: React.FC<BrowseSkillsProps> = ({ onPageChange }) => {
  const { users, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const publicUsers = users.filter(user => 
    user.isPublic && 
    user.isActive && 
    user.id !== currentUser?.id &&
    user.role !== 'admin'
  );

  const categories = ['All', 'Design', 'Programming', 'Marketing', 'Writing', 'Data', 'Business'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const filteredUsers = useMemo(() => {
    return publicUsers.filter(user => {
      const matchesSearch = searchTerm === '' || 
        user.skillsOffered.some(skill => 
          skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          skill.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === '' || selectedCategory === 'All' ||
        user.skillsOffered.some(skill => skill.category === selectedCategory);

      const matchesLevel = selectedLevel === '' || selectedLevel === 'All' ||
        user.skillsOffered.some(skill => skill.level === selectedLevel);

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [publicUsers, searchTerm, selectedCategory, selectedLevel]);

  const handleViewProfile = (user: UserType) => {
    setSelectedUser(user);
    setShowUserProfile(true);
  };

  const closeUserProfile = () => {
    setSelectedUser(null);
    setShowUserProfile(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Discover Skills</h1>
        <p className="text-white/80">Find talented people ready to share their expertise</p>
      </div>

      {/* Search and Filters */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 sm:p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              placeholder="Search skills, users, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/60"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-3 backdrop-blur-md bg-white/20 border border-white/30 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category === 'All' ? '' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white"
                >
                  {levels.map(level => (
                    <option key={level} value={level === 'All' ? '' : level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredUsers.map(user => (
          <UserCard
            key={user.id}
            user={user}
            onViewProfile={() => handleViewProfile(user)}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
          <p className="text-white/60">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* User Profile Modal */}
      {showUserProfile && selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={closeUserProfile}
        />
      )}
    </div>
  );
};

interface UserCardProps {
  user: UserType;
  onViewProfile: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onViewProfile }) => {
  const { sendSwapRequest, currentUser } = useApp();
  const [selectedSkill, setSelectedSkill] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');

  const handleSendRequest = () => {
    if (!currentUser || !selectedSkill) return;

    const userSkill = user.skillsOffered.find(s => s.id === selectedSkill);
    const mySkill = currentUser.skillsOffered[0]; // For demo, using first skill

    if (userSkill && mySkill) {
      sendSwapRequest({
        requesterId: currentUser.id,
        receiverId: user.id,
        offeredSkillId: mySkill.id,
        wantedSkillId: userSkill.id,
        message: requestMessage,
        status: 'pending'
      });

      setShowRequestForm(false);
      setRequestMessage('');
      setSelectedSkill('');
      
      // Show success message
      alert('Swap request sent successfully!');
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl hover:bg-white/20 transition-all transform hover:scale-[1.02]">
      {/* User Header */}
      <div className="flex items-start sm:items-center space-x-3 mb-4">
        {user.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt={user.name}
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-white/30 shadow-lg flex-shrink-0"
          />
        ) : (
          <div className="h-10 w-10 sm:h-12 sm:w-12 backdrop-blur-md bg-white/20 border-2 border-white/30 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-white/80" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-white">{user.name}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-white/80">
            {user.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {user.location}
              </div>
            )}
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-400" />
              {user.rating.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Offered */}
      <div className="mb-4">
        <h4 className="text-xs sm:text-sm font-medium text-white/90 mb-2">Skills Offered</h4>
        <div className="space-y-2">
          {user.skillsOffered.slice(0, 2).map(skill => (
            <div key={skill.id} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-2 sm:p-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 mb-1">
                <span className="font-medium text-white text-sm">{skill.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  skill.level === 'Expert' ? 'bg-purple-500/20 text-purple-100 border border-purple-400/30' :
                  skill.level === 'Advanced' ? 'bg-blue-500/20 text-blue-100 border border-blue-400/30' :
                  skill.level === 'Intermediate' ? 'bg-green-500/20 text-green-100 border border-green-400/30' :
                  'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30'
                } self-start`}>
                  {skill.level}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/80">{skill.description}</p>
            </div>
          ))}
          {user.skillsOffered.length > 2 && (
            <p className="text-xs sm:text-sm text-white/60">+{user.skillsOffered.length - 2} more skills</p>
          )}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <h4 className="text-xs sm:text-sm font-medium text-white/90 mb-2">Availability</h4>
        <div className="flex flex-wrap gap-2">
          {user.availability.map(time => (
            <span key={time} className="flex items-center px-2 py-1 backdrop-blur-md bg-green-500/20 text-green-100 border border-green-400/30 rounded-full text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {time}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onViewProfile}
          className="w-full px-6 py-3 backdrop-blur-xl bg-white/15 border border-white/20 text-white rounded-full hover:bg-white/25 hover:border-white/30 transition-all text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          View Profile
        </button>
        <button
          onClick={() => setShowRequestForm(true)}
          className="w-full px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-white/20 text-white rounded-full hover:from-blue-500/30 hover:to-green-500/30 hover:border-white/30 transition-all flex items-center justify-center text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Request Swap
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Request Skill Swap</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Which skill would you like to learn?
                </label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white"
                >
                  <option value="">Select a skill</option>
                  {user.skillsOffered.map(skill => (
                    <option key={skill.id} value={skill.id}>{skill.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Message (optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60"
                  placeholder="Tell them why you'd like to learn this skill..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => setShowRequestForm(false)}
                className="w-full px-6 py-3 backdrop-blur-xl bg-white/15 border border-white/20 text-white rounded-full hover:bg-white/25 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                disabled={!selectedSkill}
                className="w-full px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-white/20 text-white rounded-full hover:from-blue-500/30 hover:to-green-500/30 hover:border-white/30 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseSkills;