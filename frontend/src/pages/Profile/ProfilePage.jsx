import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // 👈 Import navigate
import { Mail, MapPin, Briefcase, User, Save, Phone, DollarSign, AlertTriangle, ArrowLeft, X } from 'lucide-react'; // 👈 Import Icons
import { updateProfile } from '../../features/auth/authSlice';
import { UserRoles } from '../../constants/roles';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 👈 Hook for navigation
  const { user, isLoading, error } = useSelector((state) => state.auth);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    bio: '',
    investmentFocus: 'Technology',
    riskTolerance: 'Moderate',
    hourlyRate: '',
    experienceYears: ''
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        investmentFocus: user.investmentFocus || 'Technology',
        riskTolerance: user.riskTolerance || 'Moderate',
        hourlyRate: user.hourlyRate ? String(user.hourlyRate) : '',
        experienceYears: user.experienceYears ? String(user.experienceYears) : ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
        ...formData,
        hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
        experienceYears: formData.experienceYears ? Number(formData.experienceYears) : undefined,
    };
    dispatch(updateProfile(payload));
  };

  if (!user) return <div className="text-center p-10 text-gray-500">Loading Profile...</div>;

  const isInvestor = user.role === UserRoles.INVESTOR;
  const isAdvisor = user.role === UserRoles.ADVISOR;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* ✅ NEW: Top Navigation Bar */}
      <div className="flex justify-between items-center mb-6">
        <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
        </button>
        
        {/* Optional: Close Icon specifically if user prefers 'X' feel */}
        <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
            <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        
        {/* Header Section */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 relative">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0 text-center sm:text-left">
            <img 
              src={user.avatar || "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-transparent-600nw-2534623311.jpg"} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-md object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Briefcase className="w-4 h-4" /> 
                <span className="font-medium">{user.role}</span>
                {formData.location && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {formData.location}</span>
                  </>
                )}
              </p>
              <div className="flex items-center justify-center sm:justify-start mt-2 text-sm text-gray-500 dark:text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error UI */}
        {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 m-8 mb-0 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
        )}

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" /> Personal Information
                </h3>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">First Name</label>
                      <input 
                        type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Name</label>
                      <input 
                        type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Email (Read-only)</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input 
                            type="email" 
                            value={user.email} 
                            disabled 
                            className="w-full pl-9 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input 
                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        className="w-full pl-9 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input 
                        type="text" name="location" value={formData.location} onChange={handleChange}
                        className="w-full pl-9 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
                    <textarea 
                      rows="4" name="bio" value={formData.bio} onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Role Specific Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-green-600" /> Professional Profile
                </h3>
                
                <div className="space-y-5">
                  {isInvestor && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Investment Focus</label>
                        <select name="investmentFocus" value={formData.investmentFocus} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Technology</option>
                          <option>Healthcare</option>
                          <option>Finance</option>
                          <option>Energy</option>
                          <option>Real Estate</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Risk Tolerance</label>
                        <select name="riskTolerance" value={formData.riskTolerance} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Conservative</option>
                          <option>Moderate</option>
                          <option>Aggressive</option>
                        </select>
                      </div>
                    </>
                  )}

                  {isAdvisor && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hourly Rate ($)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input 
                            type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange}
                            className="w-full pl-9 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Experience (Years)</label>
                        <input 
                          type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button type="submit" disabled={isLoading} className="flex items-center bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70">
                {isLoading ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;