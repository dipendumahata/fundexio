import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      {/* Fixed Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-16 pb-8 min-h-screen">
        {/* 👇 এই div টা কন্টেন্টকে সেন্টারে রাখবে এবং ফুল উইডথ হওয়া আটকাবে */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;