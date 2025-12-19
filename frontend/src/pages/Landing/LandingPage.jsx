import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import HeroSection from '../../components/landing/HeroSection';
import RoleCards from '../../components/landing/RoleCards';
import Modal from '../../components/ui/Modal';
import AuthForm from '../../features/auth/AuthForm';

const LandingPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setIsModalOpen(true);
  };

  // ✅ Fix: প্যারামিটার আপডেট করা হয়েছে
  const handleAuthSubmit = (type, role) => {
    // এখানে আমরা চাইলে Analytics ইভেন্ট ফায়ার করতে পারি
    console.log(`User ${type} success as ${role}`);
    setIsModalOpen(false); // মডাল বন্ধ করা
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      
      <main className="relative overflow-hidden pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection />
          <RoleCards onRoleSelect={handleRoleSelect} />
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-12 text-center text-sm text-gray-600 dark:text-gray-400">
        © 2025 Fundexio. All rights reserved.
      </footer>

      {/* Auth Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedRole ? `Welcome, ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}!` : 'Sign In'}
      >
        {/* ✅ Fix: Role পাস করা হচ্ছে */}
        <AuthForm role={selectedRole} onSubmit={handleAuthSubmit} />
      </Modal>
    </div>
  );
};

export default LandingPage;