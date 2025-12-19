import React from 'react';
import { X } from 'lucide-react';
import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    // ✅ Fix: Close on Escape
    useEffect(() => {
      const handleEsc = (e) => {
          if (e.key === 'Escape') onClose();
      };
      if (isOpen) window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" 
        onClick={onClose}
      ></div>
      
      {/* Content */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-fadeInUp">
        <div className="p-8">
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
                <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
            
            <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                    {title}
                </h3>
            </div>
            
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;