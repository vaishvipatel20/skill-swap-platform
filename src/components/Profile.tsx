import React, { useState } from 'react';
import { User, MapPin, Clock, Plus, X, Save, Eye, EyeOff, Edit, Upload, Camera, Lock, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Skill } from '../types';

const Profile: React.FC = () => {
  const { currentUser, updateProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    location: currentUser?.location || '',
    profilePhoto: currentUser?.profilePhoto || '',
    isPublic: currentUser?.isPublic || false,
    availability: currentUser?.availability || [],
    password: '',
    confirmPassword: '',
  });
  const [skillsOffered, setSkillsOffered] = useState(currentUser?.skillsOffered || []);
  const [skillsWanted, setSkillsWanted] = useState(currentUser?.skillsWanted || []);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: '',
    description: '',
    category: 'Programming',
    level: 'Beginner'
  });
  const [showSkillForm, setShowSkillForm] = useState<'offered' | 'wanted' | null>(null);
  const [editingSkill, setEditingSkill] = useState<{ id: string; type: 'offered' | 'wanted' } | null>(null);
  const [editSkillData, setEditSkillData] = useState<Partial<Skill>>({});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  if (!currentUser) return null;

  const categories = ['Programming', 'Design', 'Marketing', 'Writing', 'Data', 'Business'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const availabilityOptions = ['Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Afternoons'];

  const handleSaveProfile = () => {
    // Validate form
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
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
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Prepare updates object
    const updates: any = {
      name: formData.name,
      email: formData.email,
      location: formData.location,
      profilePhoto: formData.profilePhoto,
      isPublic: formData.isPublic,
      availability: formData.availability,
      skillsOffered,
      skillsWanted
    };
    
    // Only include password if it's being changed
    if (formData.password) {
      updates.password = formData.password;
    }

    updateProfile({
      ...updates
    });
    
    // Reset password fields and errors
    setFormData({ 
      ...formData, 
      password: '', 
      confirmPassword: '' 
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleAddSkill = (type: 'offered' | 'wanted') => {
    if (!newSkill.name || !newSkill.description) return;

    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name,
      description: newSkill.description,
      category: newSkill.category || 'Programming',
      level: newSkill.level || 'Beginner'
    };

    if (type === 'offered') {
      setSkillsOffered([...skillsOffered, skill]);
    } else {
      setSkillsWanted([...skillsWanted, skill]);
    }

    setNewSkill({ name: '', description: '', category: 'Programming', level: 'Beginner' });
    setShowSkillForm(null);
  };

  const handleRemoveSkill = (id: string, type: 'offered' | 'wanted') => {
    if (type === 'offered') {
      setSkillsOffered(skillsOffered.filter(skill => skill.id !== id));
    } else {
      setSkillsWanted(skillsWanted.filter(skill => skill.id !== id));
    }
  };

  const handleEditSkill = (skill: Skill, type: 'offered' | 'wanted') => {
    setEditingSkill({ id: skill.id, type });
    setEditSkillData(skill);
  };

  const handleSaveSkillEdit = () => {
    if (!editingSkill || !editSkillData.name || !editSkillData.description) return;

    const updatedSkill: Skill = {
      id: editingSkill.id,
      name: editSkillData.name,
      description: editSkillData.description,
      category: editSkillData.category || 'Programming',
      level: editSkillData.level || 'Beginner'
    };

    if (editingSkill.type === 'offered') {
      setSkillsOffered(skillsOffered.map(skill => 
        skill.id === editingSkill.id ? updatedSkill : skill
      ));
    } else {
      setSkillsWanted(skillsWanted.map(skill => 
        skill.id === editingSkill.id ? updatedSkill : skill
      ));
    }

    setEditingSkill(null);
    setEditSkillData({});
  };

  const handleCancelSkillEdit = () => {
    setEditingSkill(null);
    setEditSkillData({});
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingPhoto(true);

    // Create a FileReader to convert image to base64 or blob URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData({ ...formData, profilePhoto: result });
      setUploadingPhoto(false);
    };
    reader.onerror = () => {
      alert('Error reading file');
      setUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const triggerPhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // This enables camera on mobile
    input.onchange = handlePhotoUpload;
    input.click();
  };

  const handleAvailabilityChange = (option: string) => {
    const newAvailability = formData.availability.includes(option)
      ? formData.availability.filter(item => item !== option)
      : [...formData.availability, option];
    
    setFormData({ ...formData, availability: newAvailability });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Profile</h1>
          <p className="text-white/80">Manage your profile information and skills</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-white/15 to-white/10 border border-white/20 text-white rounded-full hover:from-white/25 hover:to-white/15 hover:border-white/30 transition-all shadow-lg self-start hover:shadow-xl transform hover:scale-105"
        >
          {isEditing ? <Save className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Information */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 sm:p-6 shadow-2xl">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Profile Photo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/90 mb-2">Profile Photo</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {(isEditing ? formData.profilePhoto : currentUser.profilePhoto) ? (
                <img
                  src={isEditing ? formData.profilePhoto : currentUser.profilePhoto}
                  alt="Profile"
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-4 border-white/30 shadow-lg"
                />
              ) : (
                <div className="h-16 w-16 sm:h-20 sm:w-20 backdrop-blur-md bg-white/20 border-4 border-white/30 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 sm:h-8 sm:w-8 text-white/80" />
                </div>
              )}
              {isEditing && (
                <div className="flex flex-col gap-3 w-full sm:flex-1">
                  <button
                    type="button"
                    onClick={triggerPhotoUpload}
                    disabled={uploadingPhoto}
                    className="flex items-center justify-center px-4 py-3 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 text-white rounded-full hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    {uploadingPhoto ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={triggerPhotoUpload}
                    disabled={uploadingPhoto}
                    className="flex items-center justify-center px-4 py-3 backdrop-blur-xl bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-white/20 text-white rounded-full hover:from-green-500/30 hover:to-teal-500/30 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none sm:hidden"
                  >
                    {uploadingPhoto ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Camera className="h-4 w-4 mr-2" />
                    )}
                    {uploadingPhoto ? 'Taking Photo...' : 'Take Photo'}
                  </button>
                  
                  {formData.profilePhoto && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, profilePhoto: '' })}
                      className="flex items-center justify-center px-4 py-2 backdrop-blur-xl bg-red-500/20 border border-red-400/20 text-red-100 rounded-full hover:bg-red-500/30 hover:border-red-400/30 transition-all text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove Photo
                    </button>
                  )}
                  
                  <p className="text-xs text-white/60">
                    Supported formats: JPG, PNG, GIF (max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 shadow-lg"
              />
            ) : (
              <p className="text-white">{currentUser.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 shadow-lg"
                placeholder="Enter your email address"
              />
            ) : (
              <p className="text-white">{currentUser.email}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Location</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 shadow-lg"
                placeholder="City, Country"
              />
            ) : (
              <div className="flex items-center text-white/80">
                <MapPin className="h-4 w-4 mr-1" />
                {currentUser.location || 'Not specified'}
              </div>
            )}
          </div>

          {/* Password (only show when editing) */}
          {isEditing && (
            <>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">New Password (optional)</label>
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
                <label className="block text-sm font-medium text-white/90 mb-2">Confirm New Password</label>
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

          {/* Profile Visibility */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/90 mb-2">Profile Visibility</label>
            {isEditing ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                  className={`flex items-center px-4 py-2 backdrop-blur-md rounded-lg transition-colors shadow-lg ${
                    formData.isPublic
                      ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                      : 'bg-red-500/20 text-red-100 border border-red-400/30'
                  }`}
                >
                  {formData.isPublic ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                  {formData.isPublic ? 'Public' : 'Private'}
                </button>
                <span className="text-sm text-white/70">
                  {formData.isPublic 
                    ? 'Other users can see your profile and contact you'
                    : 'Your profile is hidden from other users'
                  }
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                {currentUser.isPublic ? <Eye className="h-4 w-4 mr-2 text-green-300" /> : <EyeOff className="h-4 w-4 mr-2 text-red-300" />}
                <span className={currentUser.isPublic ? 'text-green-300' : 'text-red-300'}>
                  {currentUser.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/90 mb-2">Availability</label>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {availabilityOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => handleAvailabilityChange(option)}
                    className={`px-3 py-2 backdrop-blur-md rounded-full text-xs sm:text-sm transition-colors shadow-lg ${
                      formData.availability.includes(option)
                        ? 'bg-blue-500/20 text-blue-100 border border-blue-400/30'
                        : 'bg-white/20 text-white/80 border border-white/30 hover:bg-white/30'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentUser.availability.map(time => (
                  <span key={time} className="flex items-center px-3 py-2 backdrop-blur-md bg-blue-500/20 text-blue-100 border border-blue-400/30 rounded-full text-xs sm:text-sm shadow-lg">
                    <Clock className="h-3 w-3 mr-1" />
                    {time}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-white/20">
            <button
              onClick={() => setIsEditing(false)}
              className="w-full sm:w-auto px-6 py-3 backdrop-blur-xl bg-white/15 border border-white/20 text-white rounded-full hover:bg-white/25 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="w-full sm:w-auto px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-white/20 text-white rounded-full hover:from-blue-500/30 hover:to-green-500/30 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Skills Offered */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white relative z-10">Skills I Offer</h2>
          {isEditing && (
            <button
              onClick={() => setShowSkillForm('offered')}
              className="flex items-center px-4 py-2 backdrop-blur-xl bg-green-500/15 text-green-100 border border-green-400/20 rounded-full hover:bg-green-500/25 hover:border-green-400/30 transition-all relative z-10 self-start text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Skill
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
          {skillsOffered.map(skill => (
            <div key={skill.id} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-3 sm:p-4 hover:bg-white/20 transition-all shadow-lg">
              {editingSkill?.id === skill.id && editingSkill?.type === 'offered' ? (
                // Edit mode
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={editSkillData.name || ''}
                      onChange={(e) => setEditSkillData({ ...editSkillData, name: e.target.value })}
                      className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 font-medium"
                      placeholder="Skill name"
                    />
                  </div>
                  <div>
                    <textarea
                      value={editSkillData.description || ''}
                      onChange={(e) => setEditSkillData({ ...editSkillData, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 text-sm"
                      placeholder="Skill description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={editSkillData.category || ''}
                      onChange={(e) => setEditSkillData({ ...editSkillData, category: e.target.value })}
                      className="px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white text-xs"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <select
                      value={editSkillData.level || ''}
                      onChange={(e) => setEditSkillData({ ...editSkillData, level: e.target.value as any })}
                      className="px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white text-xs"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleSaveSkillEdit}
                      className="flex-1 px-4 py-2 backdrop-blur-xl bg-green-500/15 text-green-100 border border-green-400/20 rounded-full hover:bg-green-500/25 hover:border-green-400/30 transition-all text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelSkillEdit}
                      className="flex-1 px-4 py-2 backdrop-blur-xl bg-white/15 border border-white/20 text-white rounded-full hover:bg-white/25 hover:border-white/30 transition-all text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-medium text-white text-sm sm:text-base">{skill.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        skill.level === 'Expert' ? 'bg-green-500/20 text-green-100 border border-green-400/30' :
                        skill.level === 'Advanced' ? 'bg-blue-500/20 text-blue-100 border border-blue-400/30' :
                        skill.level === 'Intermediate' ? 'bg-purple-500/20 text-purple-100 border border-purple-400/30' :
                        'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30'
                      } self-start`}>
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/80 mb-2">{skill.description}</p>
                    <span className="inline-block px-2 py-1 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-xs text-white/70">
                      {skill.category}
                    </span>
                  </div>
                  {isEditing && (
                    <div className="flex items-center space-x-1 sm:ml-2">
                      <button
                        onClick={() => handleEditSkill(skill, 'offered')}
                        className="text-blue-300 hover:text-blue-100 backdrop-blur-xl bg-blue-500/15 border border-blue-400/20 rounded-full p-2 hover:bg-blue-500/25 hover:border-blue-400/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveSkill(skill.id, 'offered')}
                        className="text-red-300 hover:text-red-100 backdrop-blur-xl bg-red-500/15 border border-red-400/20 rounded-full p-2 hover:bg-red-500/25 hover:border-red-400/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {skillsOffered.length === 0 && (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-6 sm:p-8 text-center relative z-10">
            <p className="text-white/60">No skills offered yet</p>
          </div>
        )}
      </div>

      {/* Skills Wanted */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white relative z-10">Skills I Want to Learn</h2>
          {isEditing && (
            <button
              onClick={() => setShowSkillForm('wanted')}
              className="flex items-center px-4 py-2 backdrop-blur-xl bg-blue-500/15 text-blue-100 border border-blue-400/20 rounded-full hover:bg-blue-500/25 hover:border-blue-400/30 transition-all relative z-10 self-start text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Skill
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
          {skillsWanted.map(skill => (
            <div key={skill.id} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-3 sm:p-4 hover:bg-white/20 transition-all shadow-lg">
              {editingSkill?.id === skill.id && editingSkill?.type === 'wanted' ? (
                // Edit mode
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={editSkillData.name || ''}
                      onChange={(e) => setEditSkillData({ ...editSkillData, name: e.target.value })}
                      className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 font-medium"
                      placeholder="Skill name"
                    />
                  </div>
                  <div>
                    <textarea
                      value={editSkillData.description || ''}
                      onChange={(e) => setEditSkillData({ ...editSkillData, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 text-sm"
                      placeholder="Skill description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={editSkillData.category || ''}
                      onChange={(e) => setEditSkillData({ ...editSkillData, category: e.target.value })}
                      className="px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white text-xs"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <select
                      value={editSkillData.level || ''}
                      onChange={(e) => setEditSkillData({ ...editSkillData, level: e.target.value as any })}
                      className="px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white text-xs"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleSaveSkillEdit}
                      className="flex-1 px-4 py-2 backdrop-blur-xl bg-green-500/15 text-green-100 border border-green-400/20 rounded-full hover:bg-green-500/25 hover:border-green-400/30 transition-all text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelSkillEdit}
                      className="flex-1 px-4 py-2 backdrop-blur-xl bg-white/15 border border-white/20 text-white rounded-full hover:bg-white/25 hover:border-white/30 transition-all text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-medium text-white text-sm sm:text-base">{skill.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        skill.level === 'Expert' ? 'bg-green-500/20 text-green-100 border border-green-400/30' :
                        skill.level === 'Advanced' ? 'bg-blue-500/20 text-blue-100 border border-blue-400/30' :
                        skill.level === 'Intermediate' ? 'bg-purple-500/20 text-purple-100 border border-purple-400/30' :
                        'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30'
                      } self-start`}>
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/80 mb-2">{skill.description}</p>
                    <span className="inline-block px-2 py-1 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-xs text-white/70">
                      {skill.category}
                    </span>
                  </div>
                  {isEditing && (
                    <div className="flex items-center space-x-1 sm:ml-2">
                      <button
                        onClick={() => handleEditSkill(skill, 'wanted')}
                        className="text-blue-300 hover:text-blue-100 backdrop-blur-xl bg-blue-500/15 border border-blue-400/20 rounded-full p-2 hover:bg-blue-500/25 hover:border-blue-400/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveSkill(skill.id, 'wanted')}
                        className="text-red-300 hover:text-red-100 backdrop-blur-xl bg-red-500/15 border border-red-400/20 rounded-full p-2 hover:bg-red-500/25 hover:border-red-400/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {skillsWanted.length === 0 && (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-6 sm:p-8 text-center relative z-10">
            <p className="text-white/60">No skills wanted yet</p>
          </div>
        )}
      </div>

      {/* Skill Form Modal */}
      {showSkillForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">
              Add {showSkillForm === 'offered' ? 'Offered' : 'Wanted'} Skill
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 shadow-lg"
                  placeholder="e.g., Python Programming"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Description</label>
                <textarea
                  value={newSkill.description}
                  onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 shadow-lg"
                  placeholder="Describe your skill level and experience"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Category</label>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white shadow-lg"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Level</label>
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as any })}
                    className="w-full px-3 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white shadow-lg"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => setShowSkillForm(null)}
                className="w-full sm:flex-1 px-6 py-3 backdrop-blur-xl bg-white/15 border border-white/20 text-white rounded-full hover:bg-white/25 hover:border-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddSkill(showSkillForm)}
                disabled={!newSkill.name || !newSkill.description}
                className="w-full sm:flex-1 px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-white/20 text-white rounded-full hover:from-blue-500/30 hover:to-green-500/30 hover:border-white/30 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;