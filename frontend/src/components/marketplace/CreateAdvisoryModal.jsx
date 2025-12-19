import React, { useState } from 'react';
import { X, Briefcase, DollarSign, Clock, Tag } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createAdvisoryService } from '../../features/marketplace/marketplaceSlice';

const CreateAdvisoryModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '60', // Default 60 mins
    tags: '' // Comma separated string
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert tags string to array
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

    const payload = {
      ...formData,
      price: Number(formData.price),
      duration: Number(formData.duration),
      tags: tagsArray
    };
    
    const result = await dispatch(createAdvisoryService(payload));
    if (!result.error) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Offer Advisory Service</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Service Title</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                name="title" required onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Startup Financial Planning"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hourly Rate ($)</label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input 
                        type="number" name="price" required onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="150"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Duration (Mins)</label>
                <div className="relative">
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input 
                        type="number" name="duration" required onChange={handleChange} defaultValue={60}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tags (comma separated)</label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                name="tags" onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Finance, Strategy, Marketing"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea 
              name="description" rows="3" required onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Describe what you will provide in this session..."
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg">
            Publish Service
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdvisoryModal;