import React, { useState } from 'react';
import { X, UploadCloud, Image as ImageIcon, DollarSign, PieChart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createProposal } from '../../features/marketplace/marketplaceSlice';

const CreateProposalModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    amountAsked: '',
    equityOffered: '',
    industry: 'Technology',
    fundingStage: 'Seed',
    imageUrl: '', // 📷 ইমেজের জন্য নতুন স্টেট
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      amountAsked: Number(formData.amountAsked),
      equityOffered: Number(formData.equityOffered),
      // 📷 ব্যাকএন্ডে অ্যারে হিসেবে পাঠাতে হবে
      images: formData.imageUrl ? [formData.imageUrl] : [],
    };
    
    const result = await dispatch(createProposal(payload));
    if (!result.error) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
      
      {/* Modal Container */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* 1. Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pitch Your Idea</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Share your business vision with investors</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* 2. Scrollable Form Area */}
        <div className="overflow-y-auto p-8 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section: Basic Info */}
            <div className="space-y-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Project Details
              </label>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Project Title</label>
                <input 
                  name="title" 
                  required 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none  dark:text-gray-300" 
                  placeholder="e.g. NextGen Solar Tech" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tagline (Short Description)</label>
                <input 
                  name="shortDescription" 
                  maxLength="150" 
                  required 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none  dark:text-gray-300" 
                  placeholder="A one-line pitch that grabs attention (Max 150 chars)" 
                />
              </div>
            </div>

            {/* Section: Financials (Grid Layout) */}
            <div className="space-y-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Funding & Market
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Amount Needed</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input 
                      type="number" 
                      name="amountAsked" 
                      required 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none  dark:text-gray-300" 
                      placeholder="50000"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Equity Offered (%)</label>
                  <div className="relative">
                    <PieChart className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input 
                      type="number" 
                      name="equityOffered" 
                      required 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none  dark:text-gray-300" 
                      placeholder="10" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Industry</label>
                  <div className="relative">
                    <select name="industry" onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none appearance-none  dark:text-gray-300">
                      <option>Technology</option>
                      <option>Healthcare</option>
                      <option>Finance</option>
                      <option>Energy</option>
                      <option>Retail</option>
                      <option>Education</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Funding Stage</label>
                  <div className="relative">
                    <select name="fundingStage" onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none appearance-none  dark:text-gray-300">
                      <option>Seed</option>
                      <option>Series A</option>
                      <option>Series B</option>
                      <option>Growth</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Visuals */}
            <div className="space-y-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Visuals & Details
              </label>

              {/* 📷 Image URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cover Image URL</label>
                <div className="flex gap-3 items-start">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input 
                      name="imageUrl" 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none  dark:text-gray-300" 
                      placeholder="https://images.unsplash.com/photo-..." 
                    />
                  </div>
                </div>
                {/* 🖼️ Image Preview */}
                {formData.imageUrl && (
                  <div className="mt-3 relative h-40 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none' }} 
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">Paste a direct image link from Unsplash or your website.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Detailed Description</label>
                <textarea 
                  name="description" 
                  rows="5" 
                  required 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none  dark:text-gray-300" 
                  placeholder="Tell investors about your business model, traction, and how you plan to use the funds..." 
                />
              </div>
            </div>

          </form>
        </div>

        {/* 3. Footer Actions */}
        <div className="px-8 py-5 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 flex items-center"
          >
            <UploadCloud className="w-4 h-4 mr-2" />
            Publish Proposal
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateProposalModal;