import React, { useState } from 'react';
import { X, Building, DollarSign, Percent, Clock, Briefcase } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createLoanProduct } from '../../features/marketplace/marketplaceSlice';

const CreateLoanModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  
  // ✅ State Initialization
  const [formData, setFormData] = useState({
    title: '',
    bankName: '',
    type: 'TERM_LOAN',
    interestRate: '',
    tenure: '',
    minAmount: '',
    maxAmount: '',
    processingTime: '',
    description: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // ✅ Handler: Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      minAmount: Number(formData.minAmount),
      maxAmount: Number(formData.maxAmount),
    };
    
    const result = await dispatch(createLoanProduct(payload));
    setIsLoading(false);
    
    if (!result.error) {
      // Reset form & close
      setFormData({
        title: '', bankName: '', type: 'TERM_LOAN', interestRate: '',
        tenure: '', minAmount: '', maxAmount: '', processingTime: '', description: ''
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Loan Product</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        {/* Form */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Loan Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="title" // ✅ Name Must Match State Key
                    value={formData.title} // ✅ Controlled Input
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-gray-300"
                    placeholder="e.g. SME Growth Loan"
                  />
                </div>
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bank Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-gray-300"
                    placeholder="e.g. HDFC Bank"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Interest Rate</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-gray-300"
                    placeholder="e.g. 10.5%"
                  />
                </div>
              </div>

              {/* Tenure */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tenure</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="tenure"
                    value={formData.tenure}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-gray-300"
                    placeholder="e.g. 5 Years"
                  />
                </div>
              </div>

              {/* Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
                <select 
                  name="type" 
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-gray-300"
                >
                  <option value="TERM_LOAN">Term Loan</option>
                  <option value="LINE_OF_CREDIT">Line of Credit</option>
                  <option value="EQUIPMENT_FINANCING">Equipment Financing</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Min Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Min Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="minAmount"
                    value={formData.minAmount}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-gray-300"
                    placeholder="5000"
                  />
                </div>
              </div>

              {/* Max Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Max Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="maxAmount"
                    value={formData.maxAmount}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-gray-300"
                    placeholder="500000"
                  />
                </div>
              </div>
            </div>

            {/* Processing Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Processing Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="processingTime"
                  value={formData.processingTime}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-gray-300"
                  placeholder="e.g. 7-10 Days"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description & Eligibility</label>
              <textarea 
                name="description" 
                rows="3" 
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-gray-300"
                placeholder="Details about eligibility criteria and documents required..."
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-70"
            >
              {isLoading ? "Creating..." : "Launch Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLoanModal;