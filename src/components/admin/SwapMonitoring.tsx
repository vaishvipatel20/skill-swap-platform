import React, { useState } from 'react';
import { Search, MessageSquare, User, Calendar, Eye, CheckCircle, XCircle, Clock, X, Mail, MapPin, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SwapMonitoring: React.FC = () => {
  const { swapRequests, users } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'rejected'>('all');
  const [selectedSwap, setSelectedSwap] = useState<any>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);

  const filteredSwaps = swapRequests.filter(swap => {
    const requester = users.find(u => u.id === swap.requesterId);
    const receiver = users.find(u => u.id === swap.receiverId);
    
    const matchesSearch = searchTerm === '' ||
                         requester?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receiver?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || swap.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillName = (skillId: string, userId: string) => {
    const user = users.find(u => u.id === userId);
    const skill = user?.skillsOffered.find(s => s.id === skillId);
    return skill?.name || 'Unknown Skill';
  };

  const statusCounts = {
    all: swapRequests.length,
    pending: swapRequests.filter(s => s.status === 'pending').length,
    accepted: swapRequests.filter(s => s.status === 'accepted').length,
    completed: swapRequests.filter(s => s.status === 'completed').length,
    rejected: swapRequests.filter(s => s.status === 'rejected').length,
  };

  const handleViewSwapDetails = (swap: any) => {
    setSelectedSwap(swap);
    setShowSwapModal(true);
  };

  const closeSwapModal = () => {
    setSelectedSwap(null);
    setShowSwapModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Swap Monitoring</h1>
        <p className="text-white/80">Monitor and manage skill exchange activities</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl text-center">
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">{count}</div>
            <div className="text-xs sm:text-sm text-white/80 capitalize">{status} Swaps</div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              placeholder="Search by user names..."
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
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Swaps List */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
        <div className="p-6">
          <div className="space-y-4">
            {filteredSwaps.map(swap => {
              const requester = users.find(u => u.id === swap.requesterId);
              const receiver = users.find(u => u.id === swap.receiverId);
              
              return (
                <div key={swap.id} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/20 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Users involved */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          {requester?.profilePhoto ? (
                            <img
                              src={requester.profilePhoto}
                              alt={requester.name}
                              className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover border-2 border-white/30 shadow-lg"
                            />
                          ) : (
                            <div className="h-6 w-6 sm:h-8 sm:w-8 backdrop-blur-md bg-white/20 border-2 border-white/30 rounded-full flex items-center justify-center shadow-lg">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-white/80" />
                            </div>
                          )}
                          <span className="font-medium text-white text-sm sm:text-base">{requester?.name}</span>
                        </div>
                        
                        <div className="text-white/40 hidden sm:block">→</div>
                        <div className="text-white/40 sm:hidden text-center">↓</div>
                        
                        <div className="flex items-center space-x-2">
                          {receiver?.profilePhoto ? (
                            <img
                              src={receiver.profilePhoto}
                              alt={receiver.name}
                              className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover border-2 border-white/30 shadow-lg"
                            />
                          ) : (
                            <div className="h-6 w-6 sm:h-8 sm:w-8 backdrop-blur-md bg-white/20 border-2 border-white/30 rounded-full flex items-center justify-center shadow-lg">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-white/80" />
                            </div>
                          )}
                          <span className="font-medium text-white text-sm sm:text-base">{receiver?.name}</span>
                        </div>
                      </div>

                      {/* Skill Exchange Details */}
                      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-white/90 mb-1">Offering</div>
                            <div className="text-sm text-green-300">
                              {getSkillName(swap.offeredSkillId, swap.requesterId)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white/90 mb-1">Requesting</div>
                            <div className="text-sm text-blue-300">
                              {getSkillName(swap.wantedSkillId, swap.receiverId)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      {swap.message && (
                        <div className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 mb-4">
                          <div className="text-sm text-white/80">{swap.message}</div>
                        </div>
                      )}

                      {/* Timestamps */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-white/60">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Created: {new Date(swap.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Updated: {new Date(swap.updatedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col items-end space-y-2 ml-2 sm:ml-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(swap.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(swap.status)}`}>
                          {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleViewSwapDetails(swap)}
                        className="flex items-center text-blue-300 hover:text-blue-100 text-xs sm:text-sm"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {filteredSwaps.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No swaps found</h3>
            <p className="text-white/60">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Swap Details Modal */}
      {showSwapModal && selectedSwap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 max-w-4xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Swap Request Details</h3>
              <button
                onClick={closeSwapModal}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Swap Overview */}
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
                <h4 className="text-lg font-medium text-white mb-4">Swap Overview</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Requester Info */}
                  <div className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-blue-100 mb-3">Requester</h5>
                    {(() => {
                      const requester = users.find(u => u.id === selectedSwap.requesterId);
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            {requester?.profilePhoto ? (
                              <img
                                src={requester.profilePhoto}
                                alt={requester.name}
                                className="h-12 w-12 rounded-full object-cover border-2 border-white/30 shadow-lg"
                              />
                            ) : (
                              <div className="h-12 w-12 backdrop-blur-md bg-white/20 border-2 border-white/30 rounded-full flex items-center justify-center shadow-lg">
                                <User className="h-6 w-6 text-white/80" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-white">{requester?.name}</div>
                              <div className="text-sm text-white/80 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {requester?.email}
                              </div>
                            </div>
                          </div>
                          {requester?.location && (
                            <div className="flex items-center text-sm text-white/80">
                              <MapPin className="h-4 w-4 mr-2" />
                              {requester.location}
                            </div>
                          )}
                          <div className="flex items-center text-sm text-white/80">
                            <Star className="h-4 w-4 mr-2 text-yellow-400" />
                            {requester?.rating.toFixed(1)} rating • {requester?.totalSwaps} swaps
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Receiver Info */}
                  <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-green-100 mb-3">Receiver</h5>
                    {(() => {
                      const receiver = users.find(u => u.id === selectedSwap.receiverId);
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            {receiver?.profilePhoto ? (
                              <img
                                src={receiver.profilePhoto}
                                alt={receiver.name}
                                className="h-12 w-12 rounded-full object-cover border-2 border-white/30 shadow-lg"
                              />
                            ) : (
                              <div className="h-12 w-12 backdrop-blur-md bg-white/20 border-2 border-white/30 rounded-full flex items-center justify-center shadow-lg">
                                <User className="h-6 w-6 text-white/80" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-white">{receiver?.name}</div>
                              <div className="text-sm text-white/80 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {receiver?.email}
                              </div>
                            </div>
                          </div>
                          {receiver?.location && (
                            <div className="flex items-center text-sm text-white/80">
                              <MapPin className="h-4 w-4 mr-2" />
                              {receiver.location}
                            </div>
                          )}
                          <div className="flex items-center text-sm text-white/80">
                            <Star className="h-4 w-4 mr-2 text-yellow-400" />
                            {receiver?.rating.toFixed(1)} rating • {receiver?.totalSwaps} swaps
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Skills Exchange Details */}
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
                <h4 className="text-lg font-medium text-white mb-4">Skills Exchange</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Skill Being Offered */}
                  <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-green-100 mb-3">Skill Being Offered</h5>
                    {(() => {
                      const requester = users.find(u => u.id === selectedSwap.requesterId);
                      const offeredSkill = requester?.skillsOffered.find(s => s.id === selectedSwap.offeredSkillId);
                      return offeredSkill ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h6 className="font-medium text-white">{offeredSkill.name}</h6>
                            <span className="px-2 py-1 bg-green-500/30 text-green-100 rounded-full text-xs">
                              {offeredSkill.level}
                            </span>
                          </div>
                          <p className="text-sm text-white/80">{offeredSkill.description}</p>
                          <span className="inline-block px-2 py-1 bg-white/20 text-white/70 rounded-full text-xs">
                            {offeredSkill.category}
                          </span>
                        </div>
                      ) : (
                        <p className="text-white/60">Skill not found</p>
                      );
                    })()}
                  </div>

                  {/* Skill Being Requested */}
                  <div className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-blue-100 mb-3">Skill Being Requested</h5>
                    {(() => {
                      const receiver = users.find(u => u.id === selectedSwap.receiverId);
                      const wantedSkill = receiver?.skillsOffered.find(s => s.id === selectedSwap.wantedSkillId);
                      return wantedSkill ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h6 className="font-medium text-white">{wantedSkill.name}</h6>
                            <span className="px-2 py-1 bg-blue-500/30 text-blue-100 rounded-full text-xs">
                              {wantedSkill.level}
                            </span>
                          </div>
                          <p className="text-sm text-white/80">{wantedSkill.description}</p>
                          <span className="inline-block px-2 py-1 bg-white/20 text-white/70 rounded-full text-xs">
                            {wantedSkill.category}
                          </span>
                        </div>
                      ) : (
                        <p className="text-white/60">Skill not found</p>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedSwap.message && (
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
                  <h4 className="text-lg font-medium text-white mb-4">Request Message</h4>
                  <div className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                    <p className="text-white/90">{selectedSwap.message}</p>
                  </div>
                </div>
              )}

              {/* Status and Timeline */}
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
                <h4 className="text-lg font-medium text-white mb-4">Status & Timeline</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      {getStatusIcon(selectedSwap.status)}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSwap.status)}`}>
                      {selectedSwap.status.charAt(0).toUpperCase() + selectedSwap.status.slice(1)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-white/60 mb-1">Created</div>
                    <div className="text-white font-medium">
                      {new Date(selectedSwap.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-white/60">
                      {new Date(selectedSwap.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-white/60 mb-1">Last Updated</div>
                    <div className="text-white font-medium">
                      {new Date(selectedSwap.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-white/60">
                      {new Date(selectedSwap.updatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap ID for Reference */}
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
                <h4 className="text-lg font-medium text-white mb-2">Reference Information</h4>
                <div className="text-sm text-white/60">
                  <span className="font-medium">Swap ID:</span> {selectedSwap.id}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeSwapModal}
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

export default SwapMonitoring;