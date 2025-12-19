import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../features/auth/authSlice';
import { useTheme } from '../../hooks/useTheme';
import { 
  Lock, Shield, Eye, EyeOff, Save, AlertTriangle, Smartphone, 
  Moon, Sun, Globe, Bell
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, isLoading } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('general');

  // --- PASSWORD FORM STATE ---
  const [passData, setPassData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // --- NOTIFICATION STATE ---
  const [notifSettings, setNotifSettings] = useState({
    emailAlerts: true,
    pushNotifs: true,
    marketingEmails: false
  });

  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  const handleNotifChange = (e) => {
    setNotifSettings({ ...notifSettings, [e.target.name]: e.target.checked });
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    const result = await dispatch(changePassword({
      oldPassword: passData.oldPassword,
      newPassword: passData.newPassword
    }));
    if (!result.error) {
      setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h1>

      {/* Tabs Navigation (Scrollable on mobile) */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 sm:mb-8 overflow-x-auto scrollbar-hide">
        <button onClick={() => setActiveTab('general')} className={`pb-4 px-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'general' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
            General Preferences
        </button>
        <button onClick={() => setActiveTab('security')} className={`pb-4 px-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'security' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
            Security & Login
        </button>
        <button onClick={() => setActiveTab('notifications')} className={`pb-4 px-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'notifications' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
            Notifications
        </button>
      </div>

      {/* 🟢 TAB 1: GENERAL SETTINGS (Mobile Fixed) */}
      {activeTab === 'general' && (
        <div className="space-y-6">
            
            {/* Profile Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <img src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop"} alt="User" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 break-all">{user?.email}</p>
                    </div>
                </div>
                <button 
                  onClick={() => navigate('/profile')} 
                  className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
                >
                    Edit Profile
                </button>
            </div>

            {/* Appearance */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Moon className="w-5 h-5 mr-2 text-purple-600" /> Appearance
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Theme Mode</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Switch between light and dark themes.</p>
                    </div>
                    <button 
                        onClick={toggleTheme}
                        className="w-full sm:w-auto p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center sm:justify-start"
                    >
                        {theme === 'dark' ? (
                          <>
                            <Sun className="w-4 h-4 mr-2" /> <span>Light Mode</span>
                          </>
                        ) : (
                          <>
                            <Moon className="w-4 h-4 mr-2" /> <span>Dark Mode</span>
                          </>
                        )}
                    </button>
                </div>
            </div>

            {/* Language */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-blue-600" /> Language & Region
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Language</label>
                        <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                            <option>English (US)</option>
                            <option>Spanish</option>
                            <option>French</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Timezone</label>
                        <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                            <option>UTC (GMT+0)</option>
                            <option>EST (GMT-5)</option>
                            <option>IST (GMT+5:30)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 🔒 TAB 2: SECURITY SETTINGS */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-blue-600" /> Change Password
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Ensure your account is using a long, random password to stay secure.</p>

            <form onSubmit={handleSubmitPassword} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                <div className="relative">
                  <input type={showOld ? "text" : "password"} name="oldPassword" value={passData.oldPassword} onChange={handlePassChange} className="w-full pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                  <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">{showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <div className="relative">
                  <input type={showNew ? "text" : "password"} name="newPassword" value={passData.newPassword} onChange={handlePassChange} className="w-full pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">{showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                <input type="password" name="confirmPassword" value={passData.confirmPassword} onChange={handlePassChange} className="w-full pl-4 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isLoading} className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70">
                    {isLoading ? 'Updating...' : <><Save className="w-4 h-4 mr-2" /> Update Password</>}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center">
                    <Smartphone className="w-5 h-5 mr-2 text-purple-600" /> Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account.</p>
                </div>
                <button onClick={() => setTwoFactorEnabled(!twoFactorEnabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
            {twoFactorEnabled && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200 flex items-center">
                    <Shield className="w-4 h-4 mr-2" /> 2FA is currently active (Mock UI).
                </div>
            )}
          </div>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" /> Danger Zone
            </h3>
            <p className="text-sm text-red-600 dark:text-red-300 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button onClick={() => toast.error("Account deletion is restricted in this demo!")} className="w-full sm:w-auto px-4 py-2 bg-white border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition">
                Delete Account
            </button>
          </div>
        </div>
      )}

      {/* 🔔 TAB 3: NOTIFICATIONS SETTINGS */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-orange-500" /> Notification Preferences
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Email Alerts</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 pr-4">Receive emails about activity.</p>
                        </div>
                        <input type="checkbox" name="emailAlerts" checked={notifSettings.emailAlerts} onChange={handleNotifChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 pr-4">Receive push notifications.</p>
                        </div>
                        <input type="checkbox" name="pushNotifs" checked={notifSettings.pushNotifs} onChange={handleNotifChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Marketing Emails</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 pr-4">Receive emails about new offers.</p>
                        </div>
                        <input type="checkbox" name="marketingEmails" checked={notifSettings.marketingEmails} onChange={handleNotifChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button onClick={() => toast.success("Notification preferences saved!")} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default SettingsPage;