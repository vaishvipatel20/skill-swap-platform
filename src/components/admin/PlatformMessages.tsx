import React, { useState } from 'react';
import { Send, MessageSquare, AlertTriangle, Info, CheckCircle, X, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PlatformMessages: React.FC = () => {
  const { adminMessages, sendAdminMessage, updateAdminMessage, deleteAdminMessage } = useApp();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'error' | 'success'
  });

  const handleSendMessage = () => {
    if (!formData.title || !formData.content) return;

    sendAdminMessage({
      ...formData,
      isActive: true
    });

    setFormData({ title: '', content: '', type: 'info' });
    setShowCreateForm(false);
  };

  const handleEditMessage = (message: any) => {
    setSelectedMessage(message);
    setFormData({
      title: message.title,
      content: message.content,
      type: message.type
    });
    setShowEditForm(true);
  };

  const handleUpdateMessage = () => {
    if (!formData.title || !formData.content || !selectedMessage) return;

    updateAdminMessage(selectedMessage.id, formData);
    setFormData({ title: '', content: '', type: 'info' });
    setSelectedMessage(null);
    setShowEditForm(false);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteAdminMessage(messageId);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', type: 'info' });
    setSelectedMessage(null);
    setShowCreateForm(false);
    setShowEditForm(false);
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-5 w-5 text-blue-300" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-300" />;
      case 'error': return <X className="h-5 w-5 text-red-300" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-300" />;
      default: return <Info className="h-5 w-5 text-blue-300" />;
    }
  };

  const messageTypes = [
    { value: 'info', label: 'Information', icon: Info },
    { value: 'warning', label: 'Warning', icon: AlertTriangle },
    { value: 'error', label: 'Error', icon: X },
    { value: 'success', label: 'Success', icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Platform Messages</h1>
          <p className="text-white/80">Send announcements and updates to all users</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-white/20 text-white rounded-full hover:from-blue-500/30 hover:to-green-500/30 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Send className="h-4 w-4 mr-2" />
          New Message
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {messageTypes.map(type => {
          const count = adminMessages.filter(m => m.type === type.value && m.isActive).length;
          const Icon = type.icon;
          
          return (
            <div key={type.value} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/80">{type.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1">{count}</p>
                </div>
                <div className={`p-3 rounded-lg ${
                  type.value === 'info' ? 'backdrop-blur-md bg-blue-500/20 border border-blue-400/30' :
                  type.value === 'warning' ? 'backdrop-blur-md bg-yellow-500/20 border border-yellow-400/30' :
                  type.value === 'error' ? 'backdrop-blur-md bg-red-500/20 border border-red-400/30' : 'backdrop-blur-md bg-blue-500/20 border border-blue-400/30'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    type.value === 'info' ? 'text-blue-300' :
                    type.value === 'warning' ? 'text-yellow-300' :
                    type.value === 'error' ? 'text-red-300' : 'text-blue-300'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Messages List */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Messages</h2>
          
          <div className="space-y-4">
            {adminMessages.map(message => (
              <div key={message.id} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getMessageIcon(message.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{message.title}</h3>
                      <p className="text-white/90 text-sm mb-3">{message.content}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-white/60">
                        <span>Sent: {new Date(message.createdAt).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full ${
                          message.isActive ? 'bg-green-500/20 text-green-100 border border-green-400/30' : 'bg-white/20 text-white/60 border border-white/30'
                        }`}>
                          {message.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-2">
                    <button
                      onClick={() => handleEditMessage(message)}
                      className="text-blue-300 hover:text-blue-100 p-2 rounded-lg hover:bg-blue-500/20 transition-all"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="text-red-300 hover:text-red-100 p-2 rounded-lg hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {adminMessages.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No messages sent</h3>
              <p className="text-white/60">Create your first platform message to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Message Modal */}
      {(showCreateForm || showEditForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">
              {showEditForm ? 'Edit Platform Message' : 'Send Platform Message'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Message Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {messageTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setFormData({ ...formData, type: type.value as any })}
                        className={`flex items-center justify-center p-3 rounded-lg border transition-colors text-sm ${
                          formData.type === type.value
                            ? `border-white/40 backdrop-blur-xl bg-white/25 text-white rounded-full shadow-lg`
                            : 'border-white/25 backdrop-blur-xl bg-white/10 text-white/80 hover:bg-white/20 hover:border-white/35 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105'
                        }`}
                      >
                        <Icon className={`h-4 w-4 mr-2 ${
                          formData.type === type.value
                            ? `text-white`
                            : 'text-white/60'
                        }`} />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60"
                  placeholder="Message title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60"
                  placeholder="Message content..."
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={resetForm}
                className="flex-1 px-6 py-3 backdrop-blur-xl bg-white/15 border border-white/20 text-white rounded-full hover:bg-white/25 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={showEditForm ? handleUpdateMessage : handleSendMessage}
                disabled={!formData.title || !formData.content}
                className="flex-1 px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-white/20 text-white rounded-full hover:from-blue-500/30 hover:to-green-500/30 hover:border-white/30 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {showEditForm ? 'Update Message' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformMessages;