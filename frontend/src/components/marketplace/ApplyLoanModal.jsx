import React, { useState } from 'react';
import { X, DollarSign, FileText } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { applyForLoan } from '../../features/marketplace/marketplaceSlice';

const ApplyLoanModal = ({ isOpen, onClose, loan }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen || !loan) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(applyForLoan({
      loanProductId: loan._id,
      amountRequested: Number(amount),
      notes
    }));
    onClose();
  };

  return (
    // ✅ Fix: z-50 থেকে বাড়িয়ে z-[100] করা হলো
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Apply for {loan.title}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300">
            <p><strong>Bank:</strong> {loan.bankName}</p>
            <p><strong>Range:</strong> ${loan.minAmount.toLocaleString()} - ${loan.maxAmount.toLocaleString()}</p>
            <p><strong>Interest:</strong> {loan.interestRate}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Amount Requested ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="number" 
                required 
                min={loan.minAmount}
                max={loan.maxAmount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Purpose of Loan</label>
            <textarea 
              rows="3" 
              required
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-gray-300"
              placeholder="e.g. Expanding inventory..."
            />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLoanModal;