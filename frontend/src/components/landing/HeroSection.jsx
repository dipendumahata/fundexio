import React from 'react';

const HeroSection = () => {
  return (
    <div className="text-center animate-fadeInUp opacity-0 animation-delay-200">
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6 pt-6">
        Welcome to <br />
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Fundexio Platform
        </span>
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
        Choose your role to continue and unlock tailored opportunities for your professional journey
      </p>
    </div>
  );
};

export default HeroSection;