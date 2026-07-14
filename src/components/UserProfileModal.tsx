import React, { useState } from 'react';
import { X, User, MapPin, Star, Clock, MessageSquare, ArrowRight, Mail, Calendar } from 'lucide-react';
import { User as UserType } from '../types';
import { useApp } from '../context/AppContext';

interface UserProfileModalProps {
  user: UserType;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
  const { sendSwapRequest, currentUser } = useApp();
  const [selectedSkill, setSelectedSkill] = useState(''); // User's skill to offer
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestMessage, setRequestMessage] = useState(''); // Skill they want to learn
  const [formData, setFormData] = useState({ message: '' });

  const handleSendRequest = () => {
    if (!currentUser || !selectedSkill || !requestMessage) {
      alert('Please select both skills before sending the request.');
      return;
    }

    // Find the skills
    const myOfferedSkill = currentUser.skillsOffered.find(s => s.id === selectedSkill);
    const theirOfferedSkill = user.skillsOffered.find(s => s.id === requestMessage);

    if (!myOfferedSkill || !theirOfferedSkill) {
      alert('Error: Could not find the selected skills.');
      return;
    }

    try {
      sendSwapRequest({
        requesterId: currentUser.id,
        receiverId: user.id,
        offeredSkillId: myOfferedSkill.id,
        wantedSkillId: theirOfferedSkill.id,
        message: formData.message || `Hi! I'd like to exchange my ${myOfferedSkill.name} skills for your ${theirOfferedSkill.name} expertise.`,
        status: 'pending'
      });

      // Reset form and close modal
      setShowRequestForm(false);
      setSelectedSkill('');
      setRequestMessage('');
      setFormData({ message: '' });
      onClose();
      
      alert(`Swap request sent successfully! You offered "${myOfferedSkill.name}" in exchange for "${theirOfferedSkill.name}".`);
    } catch (error) {
      console.error('Error sending swap request:', error);
      alert('Failed to send swap request. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-3xl"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-2xl font-bold text-white">User Profile</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6 relative z-10">
          {/* User Header */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-4 border-white/30 shadow-lg mx-auto sm:mx-0"
                />
              ) : (
                <div className="h-20 w-20 sm:h-24 sm:w-24 backdrop-blur-md bg-white/20 border-4 border-white/30 rounded-full flex items-center justify-center shadow-lg mx-auto sm:mx-0">
                  <User className="h-10 w-10 sm:h-12 sm:w-12 text-white/80" />
                </div>
              )}
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{user.name}</h2>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-white/80 mb-4">
                  {user.location && (
                    <div className="flex items-center justify-center sm:justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      {user.location}
                    </div>
                  )}
                  <div className="flex items-center justify-center sm:justify-start">
                    <Star className="h-4 w-4 mr-2 text-yellow-400" />
                    {user.rating.toFixed(1)} rating
                  </div>
                  <div className="flex items-center justify-center sm:justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {user.totalSwaps} swaps
                  </div>
                </div>

                <div className="flex items-center justify-center sm:justify-start text-sm text-white/60">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {new Date(user.joinedDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Offered */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-green-400" />
              Skills Offered ({user.skillsOffered.length})
            </h3>
            
            {user.skillsOffered.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {user.skillsOffered.map(skill => (
                  <div key={skill.id} className="backdrop-blur-md bg-green-500/20 border border-green-400/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{skill.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        skill.level === 'Expert' ? 'bg-purple-500/30 text-purple-100 border border-purple-400/40' :
                        skill.level === 'Advanced' ? 'bg-blue-500/30 text-blue-100 border border-blue-400/40' :
                        skill.level === 'Intermediate' ? 'bg-green-500/30 text-green-100 border border-green-400/40' :
                        'bg-yellow-500/30 text-yellow-100 border border-yellow-400/40'
                      }`}>
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-sm text-white/90 mb-3">{skill.description}</p>
                    <span className="inline-block px-3 py-1 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-xs text-white/80">
                      {skill.category}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/60">No skills offered yet</p>
              </div>
            )}
          </div>

          {/* Skills Wanted */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-blue-400" />
              Skills Wanted ({user.skillsWanted.length})
            </h3>
            
            {user.skillsWanted.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {user.skillsWanted.map(skill => (
                  <div key={skill.id} className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{skill.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        skill.level === 'Expert' ? 'bg-purple-500/30 text-purple-100 border border-purple-400/40' :
                        skill.level === 'Advanced' ? 'bg-blue-500/30 text-blue-100 border border-blue-400/40' :
                        skill.level === 'Intermediate' ? 'bg-green-500/30 text-green-100 border border-green-400/40' :
                        'bg-yellow-500/30 text-yellow-100 border border-yellow-400/40'
                      }`}>
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-sm text-white/90 mb-3">{skill.description}</p>
                    <span className="inline-block px-3 py-1 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-xs text-white/80">
                      {skill.category}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/60">No skills wanted yet</p>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-purple-400" />
              Availability
            </h3>
            
            {user.availability.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {user.availability.map(time => (
                  <span key={time} className="flex items-center px-4 py-2 backdrop-blur-md bg-purple-500/20 text-purple-100 border border-purple-400/30 rounded-full text-sm shadow-lg">
                    <Clock className="h-4 w-4 mr-2" />
                    {time}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/60">No availability specified</p>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-orange-400" />
              Contact Information
            </h3>
            
            <div className="flex items-center text-white/80">
              <Mail className="h-4 w-4 mr-3" />
              <span>{user.email}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {currentUser && currentUser.id !== user.id && (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  if (user.skillsOffered.length === 0) {
                    alert('This user has no skills available for exchange.');
                    return;
                  }
                  if (currentUser.skillsOffered.length === 0) {
                    alert('You need to add skills to your profile before requesting a swap.');
                    return;
                  }
                  setShowRequestForm(true);
                }}
                className="flex-1 flex items-center justify-center px-6 py-4 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-white/20 text-white rounded-full hover:from-blue-500/30 hover:to-green-500/30 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Request Skill Swap
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          )}
        </div>

        {/* Request Form Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h4 className="text-lg font-semibold text-white mb-4">Request Skill Swap</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Your skill to offer
                  </label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white"
                  >
                    <option value="">Select your skill to offer</option>
                    {currentUser?.skillsOffered.map(skill => (
                      <option key={skill.id} value={skill.id}>{skill.name} ({skill.level})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Which of their skills would you like to learn?
                  </label>
                  <select
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white"
                  >
                    <option value="">Select a skill to learn</option>
                    {user.skillsOffered.map(skill => (
                      <option key={skill.id} value={skill.id}>{skill.name} ({skill.level})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Personal message (optional)
                  </label>
                  <textarea
                    value={formData.message || ''}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60"
                    placeholder="Tell them why you'd like to learn this skill..."
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRequestForm(false);
                    setSelectedSkill('');
                    setRequestMessage('');
                    setFormData({ message: '' });
                  }}
                  className="w-full px-6 py-3 backdrop-blur-xl bg-white/15 border border-white/20 text-white rounded-full hover:bg-white/25 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={!selectedSkill || !requestMessage}
                  className="w-full px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-white/20 text-white rounded-full hover:from-blue-500/30 hover:to-green-500/30 hover:border-white/30 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;