import React, { useState } from 'react';
import { X, DollarSign, CheckCircle, Lock } from 'lucide-react'; // Lock আইকন আনা হলো
import { useDispatch, useSelector } from 'react-redux'; // useSelector আনা হলো
import { investInProposal } from '../../features/marketplace/marketplaceSlice';

const InvestModal = ({ isOpen, onClose, proposal }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // ✅ কারেন্ট ইউজার রোল চেক করার জন্য
  
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !proposal) return null;

  const handleInvest = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    await dispatch(investInProposal({ 
      proposalId: proposal._id, 
      amount: Number(amount) 
    }));
    
    setLoading(false);
    onClose();
  };

  // Progress Bar Calculation
  const progress = Math.min((proposal.totalFunded / proposal.amountAsked) * 100, 100);
  const isInvestor = user?.role === 'INVESTOR'; // ✅ চেক

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-4">
            {isInvestor ? 'Invest in ' : 'Details: '}{proposal.title}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Project Summary Card */}
          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
            <div className="flex justify-between text-sm mb-3 text-gray-600 dark:text-gray-400 font-medium">
              <span>Raised: <span className="text-gray-900 dark:text-white">${proposal.totalFunded.toLocaleString()}</span></span>
              <span>Goal: <span className="text-gray-900 dark:text-white">${proposal.amountAsked.toLocaleString()}</span></span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">{progress.toFixed(1)}% Funded</span>
              <span className="text-gray-500">{proposal.investorCount} Investors</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">About Project</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {proposal.description}
            </p>
          </div>

          {/* Business Details (Optional: Show Owner Info if available) */}
          {proposal.createdBy && (
             <div className="text-sm text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
                Posted by: <span className="font-medium text-gray-900 dark:text-white">
                  {proposal.createdBy.firstName} {proposal.createdBy.lastName}
                </span>
             </div>
          )}

          {/* ✅ INVESTMENT FORM (Only for Investors) */}
          {isInvestor ? (
            <form onSubmit={handleInvest} className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Investment Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input 
                  type="number" 
                  required 
                  min="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none text-lg font-semibold dark:text-gray-300"
                  placeholder="Min $100"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30 flex justify-center items-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Confirm Investment <CheckCircle className="w-5 h-5 ml-2" /></>
                )}
              </button>
            </form>
          ) : (
            /* 🚫 Non-Investor View */
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-3 text-gray-400">
                <Lock className="w-6 h-6" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Only registered <strong>Investors</strong> can fund projects.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default InvestModal;