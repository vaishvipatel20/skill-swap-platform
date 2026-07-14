import React, { useState } from 'react';
import { User, Mail, Lock, Camera, Upload, Save, X, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminProfileProps {
  onClose: () => void;
}

const AdminProfile: React.FC<AdminProfileProps> = ({ onClose }) => {
  const { currentUser, updateProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: '',
    confirmPassword: '',
    profilePhoto: currentUser?.profilePhoto || '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Admin name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updates: any = {
      name: formData.name,
      email: formData.email,
      profilePhoto: formData.profilePhoto,
    };

    // Only include password if it's being changed
    if (formData.password) {
      updates.password = formData.password;
    }

    updateProfile(updates);
    setIsEditing(false);
    setFormData({ ...formData, password: '', confirmPassword: '' });
    setErrors({});
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      password: '',
      confirmPassword: '',
      profilePhoto: currentUser?.profilePhoto || '',
    });
    setIsEditing(false);
    setErrors({});
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, photo: 'Please select an image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, photo: 'Image size should be less than 5MB' });
      return;
    }

    setUploadingPhoto(true);
    setErrors({ ...errors, photo: '' });

    // Create a FileReader to convert image to base64 or blob URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData({ ...formData, profilePhoto: result });
      setUploadingPhoto(false);
    };
    reader.onerror = () => {
      setErrors({ ...errors, photo: 'Error reading file' });
      setUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const triggerPhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handlePhotoUpload;
    input.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl relative overflow-auto max-h-[80vh]">
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-xl font-semibold text-white">Admin Profile</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 relative z-10">
          {/* Profile Photo Section */}
          <div className="text-center">
            <div className="relative inline-block">
              {formData.profilePhoto ? (
                <img
                  src={formData.profilePhoto}
                  alt="Admin Profile"
                  className="h-20 w-20 rounded-full object-cover border-4 border-white/30 shadow-lg mx-auto"
                />
              ) : (
                <div className="h-20 w-20 backdrop-blur-md bg-white/20 border-4 border-white/30 rounded-full flex items-center justify-center shadow-lg mx-auto">
                  <User className="h-10 w-10 text-white/80" />
                </div>
              )}
              
              {isEditing && (
                <button
                  type="button"
                  onClick={triggerPhotoUpload}
                  disabled={uploadingPhoto}
                  className="absolute -bottom-2 -right-2 backdrop-blur-xl bg-blue-500/20 border border-blue-400/30 text-blue-100 p-2 rounded-full hover:bg-blue-500/30 hover:border-blue-400/40 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {uploadingPhoto ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
            
            {isEditing && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={triggerPhotoUpload}
                  disabled={uploadingPhoto}
                  className="flex items-center justify-center px-4 py-2 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 text-white rounded-full hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/30 transition-all text-sm shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none mx-auto"
                >
                  {uploadingPhoto ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </>
                  )}
                </button>
                
                {formData.profilePhoto && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, profilePhoto: '' })}
                    className="mt-2 text-xs text-red-300 hover:text-red-100 transition-colors"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            )}
            
            {errors.photo && (
              <p className="text-red-300 text-xs mt-2">{errors.photo}</p>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Admin Name */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Admin Name
              </label>
              {isEditing ? (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`pl-10 w-full px-4 py-3 backdrop-blur-md bg-white/20 border rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/60 shadow-lg ${
                      errors.name ? 'border-red-400/50' : 'border-white/30'
                    }`}
                    placeholder="Enter admin name"
                  />
                  {errors.name && (
                    <p className="text-red-300 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg">
                  <User className="h-5 w-5 text-white/60 mr-3" />
                  <span className="text-white">{currentUser?.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`pl-10 w-full px-4 py-3 backdrop-blur-md bg-white/20 border rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/60 shadow-lg ${
                      errors.email ? 'border-red-400/50' : 'border-white/30'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="text-red-300 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg">
                  <Mail className="h-5 w-5 text-white/60 mr-3" />
                  <span className="text-white">{currentUser?.email}</span>
                </div>
              )}
            </div>

            {/* Password (only show when editing) */}
            {isEditing && (
              <>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    New Password (optional)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`pl-10 pr-10 w-full px-4 py-3 backdrop-blur-md bg-white/20 border rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/60 shadow-lg ${
                        errors.password ? 'border-red-400/50' : 'border-white/30'
                      }`}
                      placeholder="Enter new password (min 6 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-300 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`pl-10 pr-10 w-full px-4 py-3 backdrop-blur-md bg-white/20 border rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/60 shadow-lg ${
                        errors.confirmPassword ? 'border-red-400/50' : 'border-white/30'
                      }`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-300 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-white/20 text-white rounded-full hover:from-green-500/30 hover:to-blue-500/30 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full px-6 py-3 backdrop-blur-xl bg-white/15 border border-white/20 text-white rounded-full hover:bg-white/25 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full flex items-center justify-center px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 text-white rounded-full hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Additional Info */}
          {!isEditing && (
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 mt-4">
              <h4 className="text-sm font-medium text-white/90 mb-2">Account Information</h4>
              <div className="space-y-2 text-xs text-white/70">
                <div>Role: Administrator</div>
                <div>Account Status: Active</div>
                <div>Last Login: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;