import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Bell, ChevronDown, User, Settings, LogOut, Menu, X, CheckCheck } from 'lucide-react';
import { logout } from '../../features/auth/authSlice';
import { fetchNotifications, markNotificationsAsRead } from '../../features/notification/notificationSlice';
import { useTheme } from '../../hooks/useTheme';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  // Redux Data
  const { user } = useSelector((state) => state.auth);
  const { items: notifications, unreadCount } = useSelector((state) => state.notifications);

  // Dropdown States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for "Click Outside" logic
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // 🔄 Fetch Notifications on Mount
  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

  // 🖱️ Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Profile Dropdown Close
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      // Notification Dropdown Close
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleMarkAllRead = () => {
    dispatch(markNotificationsAsRead());
  };

  const getLinkClass = (path, isMobile = false) => {
    const baseClass = isMobile 
      ? "block px-3 py-2 rounded-md text-base font-medium transition-colors"
      : "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeClass = "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700";
    const inactiveClass = "text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
    return location.pathname === path ? `${baseClass} ${activeClass}` : `${baseClass} ${inactiveClass}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo & Menu */}
          <div className="flex items-center">
            <div className="flex items-center md:hidden mr-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <Link to={user ? "/dashboard" : "/"}>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  FUNDEXIO
                </h1>
              </Link>
            </div>
            
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
              <Link to="/marketplace" className={getLinkClass('/marketplace')}>Marketplace</Link>
              <Link to="/messages" className={getLinkClass('/messages')}>Messages</Link>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* 🔔 Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 animate-fadeIn overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center">
                        <CheckCheck className="w-3 h-3 mr-1" /> Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 text-sm">No new notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif._id} className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notif.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-gray-400 mt-2 text-right">{new Date(notif.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 👤 Profile Dropdown */}
            <div className="relative ml-2" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 sm:p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <img 
                  src={user?.avatar || "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-transparent-600nw-2534623311.jpg"} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600"
                />
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user ? user.firstName : 'User'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 md:hidden">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2"/> Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2"/> Settings
                  </Link>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2"/> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/dashboard" className={getLinkClass('/dashboard', true)} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            <Link to="/marketplace" className={getLinkClass('/marketplace', true)} onClick={() => setIsMobileMenuOpen(false)}>Marketplace</Link>
            <Link to="/messages" className={getLinkClass('/messages', true)} onClick={() => setIsMobileMenuOpen(false)}>Messages</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;