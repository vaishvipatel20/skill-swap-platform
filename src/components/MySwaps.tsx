import React, { useState } from 'react';
import { Clock, Check, X, Star, MessageSquare, User, Calendar, Trash2, UserCheck, UserX } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MySwaps: React.FC = () => {
  const { currentUser, swapRequests, users, updateSwapRequest, submitRating } = useApp();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'active' | 'completed'>('incoming');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<string>('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  if (!currentUser) return null;

  const userSwaps = swapRequests.filter(
    req => req.requesterId === currentUser.id || req.receiverId === currentUser.id
  );

  const pendingSwaps = userSwaps.filter(swap => swap.status === 'pending');
  const incomingRequests = pendingSwaps.filter(swap => swap.receiverId === currentUser.id);
  const outgoingRequests = pendingSwaps.filter(swap => swap.requesterId === currentUser.id);
  const activeSwaps = userSwaps.filter(swap => swap.status === 'accepted');
  const completedSwaps = userSwaps.filter(swap => swap.status === 'completed');

  const handleAcceptSwap = (swapId: string) => {
    updateSwapRequest(swapId, { status: 'accepted' });
  };

  const handleRejectSwap = (swapId: string) => {
    updateSwapRequest(swapId, { status: 'rejected' });
  };

  const handleDeleteRequest = (swapId: string) => {
    updateSwapRequest(swapId, { status: 'cancelled' });
  };

  const handleCompleteSwap = (swapId: string) => {
    updateSwapRequest(swapId, { status: 'completed' });
    setSelectedSwap(swapId);
    setShowRatingModal(true);
  };

  const handleSubmitRating = () => {
    if (!selectedSwap) return;

    const swap = swapRequests.find(s => s.id === selectedSwap);
    if (!swap) return;

    const ratedUserId = swap.requesterId === currentUser.id ? swap.receiverId : swap.requesterId;

    submitRating({
      swapId: selectedSwap,
      raterId: currentUser.id,
      ratedUserId,
      rating,
      feedback
    });

    setShowRatingModal(false);
    setSelectedSwap('');
    setRating(5);
    setFeedback('');
  };

  const getOtherUser = (swap: any) => {
    const otherUserId = swap.requesterId === currentUser.id ? swap.receiverId : swap.requesterId;
    return users.find(u => u.id === otherUserId);
  };

  const getSkillName = (skillId: string, userId: string) => {
    const user = users.find(u => u.id === userId);
    const skill = user?.skillsOffered.find(s => s.id === skillId);
    return skill?.name || 'Unknown Skill';
  };

  const tabs = [
    { id: 'incoming', label: 'Incoming', count: incomingRequests.length },
    { id: 'outgoing', label: 'Outgoing', count: outgoingRequests.length },
    { id: 'active', label: 'Active', count: activeSwaps.length },
    { id: 'completed', label: 'Completed', count: completedSwaps.length },
  ];

  const getCurrentSwaps = () => {
    switch (activeTab) {
      case 'incoming': return incomingRequests;
      case 'outgoing': return outgoingRequests;
      case 'active': return activeSwaps;
      case 'completed': return completedSwaps;
      default: return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Swaps</h1>
        <p className="text-white/80">Manage your skill exchange requests and ongoing swaps</p>
      </div>

      {/* Tabs */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-2xl">
        <div className="border-b border-white/20">
          <nav className="flex space-x-2 sm:space-x-4 px-4 sm:px-6 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-blue-300'
                    : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/30'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1 sm:ml-2 px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-blue-400/20 text-blue-300'
                      : 'bg-white/20 text-white/60'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Swap List */}
        <div className="p-4 sm:p-6">
          {getCurrentSwaps().length > 0 ? (
            <div className="space-y-4">
              {getCurrentSwaps().map(swap => {
                const otherUser = getOtherUser(swap);
                const isRequester = swap.requesterId === currentUser.id;
                
                return (
                  <div key={swap.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl hover:bg-white/20 transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                          {otherUser?.profilePhoto ? (
                            <img
                              src={otherUser.profilePhoto}
                              alt={otherUser.name}
                              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-white/30 shadow-lg"
                            />
                          ) : (
                            <div className="h-10 w-10 sm:h-12 sm:w-12 backdrop-blur-md bg-white/20 border-2 border-white/30 rounded-full flex items-center justify-center shadow-lg">
                              <User className="h-5 w-5 sm:h-6 sm:w-6 text-white/80" />
                            </div>
                          )}
                        </div>

                        {/* Swap Details */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-white">
                              {otherUser?.name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              swap.status === 'pending' ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30' :
                              swap.status === 'accepted' ? 'bg-green-500/20 text-green-100 border border-green-400/30' :
                              swap.status === 'completed' ? 'bg-blue-500/20 text-blue-100 border border-blue-400/30' :
                              'bg-red-500/20 text-red-100 border border-red-400/30'
                            }`}>
                              {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex flex-col gap-2 text-xs sm:text-sm">
                              <div className="flex items-center text-green-300">
                                <span className="font-medium">You offer:</span>
                                <span className="ml-1">{getSkillName(swap.offeredSkillId, currentUser.id)}</span>
                              </div>
                              <div className="flex items-center text-blue-300">
                                <span className="font-medium">You want:</span>
                                <span className="ml-1">{getSkillName(swap.wantedSkillId, swap.receiverId)}</span>
                              </div>
                            </div>

                            {swap.message && (
                              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-2 sm:p-3">
                                <p className="text-xs sm:text-sm text-white/80">{swap.message}</p>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(swap.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(swap.updatedAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:ml-4">
                        {activeTab === 'incoming' && (
                          <>
                            {/* Incoming request actions - you can accept or reject */}
                            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto">
                              <button
                                onClick={() => handleAcceptSwap(swap.id)}
                                className="flex items-center justify-center px-4 py-3 backdrop-blur-xl bg-green-500/20 border border-green-400/20 text-green-100 rounded-full hover:bg-green-500/30 hover:border-green-400/30 transition-all text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleRejectSwap(swap.id)}
                                className="flex items-center justify-center px-4 py-3 backdrop-blur-xl bg-red-500/20 border border-red-400/20 text-red-100 rounded-full hover:bg-red-500/30 hover:border-red-400/30 transition-all text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                <UserX className="h-4 w-4 mr-1" />
                                Reject
                              </button>
                            </div>
                          </>
                        )}

                        {activeTab === 'outgoing' && (
                          <>
                            {/* Outgoing request actions - you can only delete your own requests */}
                            <button
                              onClick={() => handleDeleteRequest(swap.id)}
                              className="flex items-center justify-center px-4 py-3 backdrop-blur-xl bg-white/15 border border-white/20 text-white rounded-full hover:bg-white/25 hover:border-white/30 transition-all text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Cancel
                            </button>
                          </>
                        )}

                        {activeTab === 'active' && (
                          <button
                            onClick={() => handleCompleteSwap(swap.id)}
                            className="flex items-center justify-center px-4 py-3 backdrop-blur-xl bg-blue-500/20 border border-blue-400/20 text-blue-100 rounded-full hover:bg-blue-500/30 hover:border-blue-400/30 transition-all text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Mark Complete
                          </button>
                        )}

                        {activeTab === 'completed' && (
                          <div className="flex items-center text-green-300 text-xs sm:text-sm">
                            <Check className="h-4 w-4 mr-1" />
                            Completed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No {activeTab === 'incoming' ? 'incoming requests' : activeTab === 'outgoing' ? 'outgoing requests' : activeTab} swaps
              </h3>
              <p className="text-white/60">
                {activeTab === 'incoming' && 'You don\'t have any incoming swap requests.'}
                {activeTab === 'outgoing' && 'You don\'t have any outgoing swap requests.'}
                {activeTab === 'active' && 'You don\'t have any active swaps.'}
                {activeTab === 'completed' && 'You haven\'t completed any swaps yet.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Rate Your Experience</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`h-8 w-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Feedback (optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60"
                  placeholder="Share your experience with this skill exchange..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => setShowRatingModal(false)}
                className="w-full px-6 py-3 backdrop-blur-xl bg-white/15 border border-white/20 text-white rounded-full hover:bg-white/25 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Skip
              </button>
              <button
                onClick={handleSubmitRating}
                className="w-full px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-white/20 text-white rounded-full hover:from-blue-500/30 hover:to-green-500/30 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySwaps;