import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { loginUser, registerUser, logout } from './authSlice'; // ✅ Logout import kora hoyeche
import toast from 'react-hot-toast';

const AuthForm = ({ role, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('signin');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // 🛡️ Safety Check: Selected Role (From Landing Page Card)
  // role null হতে পারে যদি Navbar থেকে লগইন করে, তখন চেক হবে না
  const targetRole = role ? role.toUpperCase() : null;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (activeTab === 'signin') {
        // 1. Login API Call
        const result = await dispatch(loginUser({ 
          email: formData.email, 
          password: formData.password 
        })).unwrap();
        
        // 🔍 2. ROLE MISMATCH CHECK (The Fix)
        // যদি ল্যান্ডিং পেজের কার্ড থেকে আসে (targetRole আছে) এবং ইউজারের আসল রোলের সাথে না মেলে
        if (targetRole && result.user.role !== targetRole) {
            // 🛑 Stop Access
            await dispatch(logout()); // সাথে সাথে লগআউট করিয়ে দেওয়া
            toast.error(`Access Denied! This is a ${result.user.role} account.`);
            toast("Please login via the correct card.", { icon: "⚠️" });
            return; // ড্যাশবোর্ডে রিডাইরেক্ট হবে না
        }

        // ✅ 3. Success: Role Matched or General Login
        toast.success(`Welcome back, ${result.user.firstName}!`);
        
        if (onSubmit) onSubmit('signin', result.user.role);
        navigate('/dashboard');

      } else {
        // ... (Register Logic same as before) ...
        const result = await dispatch(registerUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: targetRole || "BUSINESS" 
        })).unwrap();

        toast.success("Account created! Logging you in...");
        
        if (onSubmit) onSubmit('register', targetRole);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Auth Error:", error);
      // Toast already handled in Slice
    }
  };

  return (
    <div>
      {/* Role Indicator */}
      {targetRole && (
        <div className="mb-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Logging in as <span className="font-bold text-blue-600 dark:text-blue-400">{targetRole}</span>
            </p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setActiveTab('signin')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'signin'
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('register')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'register'
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Register
        </button>
      </div>

      {/* Form Inputs */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {activeTab === 'register' && (
           <div className="grid grid-cols-2 gap-4">
               <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                   <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
               </div>
               <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                   <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
               </div>
           </div>
        )}

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input name="email" value={formData.email} onChange={handleChange} type="email" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>

        {activeTab === 'register' && (
           <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} type="tel" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
           </div>
        )}

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input name="password" value={formData.password} onChange={handleChange} type="password" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>

        <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg">
            {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;