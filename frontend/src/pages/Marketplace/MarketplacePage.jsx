import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProposals, fetchLoans, fetchAdvisors } from '../../features/marketplace/marketplaceSlice';
import { Search, PlusCircle, Bookmark, Home, UserCheck, ChevronRight, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { UserRoles } from '../../constants/roles';

// Modals
import CreateProposalModal from '../../components/marketplace/CreateProposalModal';
import InvestModal from '../../components/marketplace/InvestModal';
import CreateLoanModal from '../../components/marketplace/CreateLoanModal';
import ApplyLoanModal from '../../components/marketplace/ApplyLoanModal';
import CreateAdvisoryModal from '../../components/marketplace/CreateAdvisoryModal';
import BookSessionModal from '../../components/marketplace/BookSessionModal'; // ✅ NEW

// Helper
const formatCurrency = (amount) => {
  return typeof amount === 'number' ? amount.toLocaleString() : '0';
};

const MarketplacePage = () => {
  const dispatch = useDispatch();

  // Redux State
  const { proposals, loans, advisors, isLoading, error } = useSelector(
    (state) => state.marketplace
  );
  const { user } = useSelector((state) => state.auth);

  // Local State
  const [activeTab, setActiveTab] = useState('proposals');
  const [filters, setFilters] = useState({
    industry: '',
    fundingStage: '',
    search: '',
  });

  // Modal States
  const [isCreateProposalOpen, setIsCreateProposalOpen] = useState(false);
  const [isCreateLoanOpen, setIsCreateLoanOpen] = useState(false);
  const [isCreateAdvisoryOpen, setIsCreateAdvisoryOpen] = useState(false);

  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // ✅ NEW: Booking Session State
  const [selectedService, setSelectedService] = useState(null);
  const [isBookSessionOpen, setIsBookSessionOpen] = useState(false);

  // Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === 'proposals') {
        const query = {};
        if (filters.industry) query.industry = filters.industry;
        if (filters.fundingStage) query.fundingStage = filters.fundingStage;
        if (filters.search) query.search = filters.search;

        dispatch(fetchProposals(query));
      }

      if (activeTab === 'loans') dispatch(fetchLoans());
      if (activeTab === 'advisors') dispatch(fetchAdvisors());
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [dispatch, activeTab, filters.industry, filters.fundingStage, filters.search]);

  // Handlers
  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleViewProposal = (proposal) => {
    setSelectedProposal(proposal);
    setIsInvestModalOpen(true);
  };

  const handleApplyLoan = (loan) => {
    if (user?.role === UserRoles.BUSINESS) {
      setSelectedLoan(loan);
    } else {
      toast.error('Only Business accounts can apply for loans');
    }
  };

  // ✅ UPDATED: Book Session handler with role check + modal open
  const handleBookSession = (service) => {
    if (user?.role === UserRoles.BUSINESS || user?.role === UserRoles.INVESTOR) {
      setSelectedService(service);
      setIsBookSessionOpen(true);
    } else {
      toast.error('Only Business or Investors can book sessions');
    }
  };

  const getTabClass = (tabName) =>
    activeTab === tabName
      ? 'pb-2 text-sm font-medium border-b-2 cursor-pointer transition-colors duration-200 outline-none whitespace-nowrap text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
      : 'pb-2 text-sm font-medium border-b-2 cursor-pointer transition-colors duration-200 outline-none whitespace-nowrap text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200';

  // Helper: list empty check
  const isListEmpty = () => {
    if (activeTab === 'proposals') return proposals.length === 0;
    if (activeTab === 'loans') return loans.length === 0;
    if (activeTab === 'advisors') return advisors.length === 0;
    return false;
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Marketplace
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Discover investment opportunities and financial solutions
          </p>
        </div>

        {user?.role === UserRoles.BUSINESS && activeTab === 'proposals' && (
          <button
            onClick={() => setIsCreateProposalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Create Proposal
          </button>
        )}

        {user?.role === UserRoles.BANKER && activeTab === 'loans' && (
          <button
            onClick={() => setIsCreateLoanOpen(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Create Loan Product
          </button>
        )}

        {user?.role === UserRoles.ADVISOR && activeTab === 'advisors' && (
          <button
            onClick={() => setIsCreateAdvisoryOpen(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Offer New Service
          </button>
        )}
      </div>

      {/* Tabs */}
      <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('proposals')}
          className={getTabClass('proposals')}
        >
          Business Proposals
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          className={getTabClass('loans')}
        >
          Loan Products
        </button>
        <button
          onClick={() => setActiveTab('advisors')}
          className={getTabClass('advisors')}
        >
          Advisory Services
        </button>
      </nav>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {activeTab === 'proposals' && (
            <div className="flex gap-4 w-full sm:w-auto">
              <select
                name="industry"
                value={filters.industry}
                onChange={handleFilterChange}
                className="w-1/2 sm:w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Industries</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
              </select>

              <select
                name="fundingStage"
                value={filters.fundingStage}
                onChange={handleFilterChange}
                className="w-1/2 sm:w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Stages</option>
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg flex items-center text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>Failed to load data: {error}</p>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : isListEmpty() && !error ? (
        // Empty State
        <div className="col-span-full py-16 text-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 border-dashed">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            No items found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
            We couldn't find any results matching your filters. Try adjusting them
            or check back later.
          </p>

          {user?.role === UserRoles.BUSINESS && activeTab === 'proposals' && (
            <button
              onClick={() => setIsCreateProposalOpen(true)}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Post First Proposal
            </button>
          )}

          {user?.role === UserRoles.ADVISOR && activeTab === 'advisors' && (
            <button
              onClick={() => setIsCreateAdvisoryOpen(true)}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Offer First Service
            </button>
          )}
        </div>
      ) : (
        // Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Proposals */}
          {activeTab === 'proposals' &&
            proposals.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                  <img
                    src={
                      item.images?.[0] ||
                      `https://source.unsplash.com/400x300/?${item.industry.toLowerCase()}`
                    }
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&fit=crop';
                    }}
                  />
                  <span className="absolute top-4 right-4 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full shadow-sm">
                    {item.fundingStage}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                      {item.shortDescription}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Target
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ${formatCurrency(item.amountAsked)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Equity
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {item.equityOffered}%
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-auto">
                    <button
                      onClick={() => handleViewProposal(item)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      {user?.role === UserRoles.INVESTOR
                        ? 'Invest Now'
                        : 'View Details'}
                    </button>
                    <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* Loans */}
          {activeTab === 'loans' &&
            loans.map((loan) => (
              <div
                key={loan._id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Home className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {loan.title}
                    </h3>
                    <p className="text-sm text-gray-500">{loan.bankName}</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex justify-between text-sm py-1 border-b border-gray-100 dark:border-gray-700 border-dashed">
                    <span className="text-gray-500">Interest Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {loan.interestRate}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-gray-100 dark:border-gray-700 border-dashed">
                    <span className="text-gray-500">Max Amount</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${formatCurrency(loan.maxAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-gray-500">Tenure</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {loan.tenure}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleApplyLoan(loan)}
                  disabled={user?.role !== UserRoles.BUSINESS}
                  className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm mt-auto flex justify-center items-center ${
                    user?.role === UserRoles.BUSINESS
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  }`}
                >
                  {user?.role === UserRoles.BUSINESS ? (
                    'Apply Now'
                  ) : (
                    <>
                      <Lock className="w-3 h-3 mr-1" />{' '}
                      {user?.role === UserRoles.BANKER
                        ? 'Managed by Banker'
                        : 'Business Only'}
                    </>
                  )}
                </button>
              </div>
            ))}

          {/* Advisors */}
          {activeTab === 'advisors' &&
            advisors.map((service) => (
              <div
                key={service._id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={
                      service.advisor?.avatar ||
                      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&fit=crop'
                    }
                    className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-sm"
                    alt="Advisor"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {service.advisor?.firstName} {service.advisor?.lastName}
                    </h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide mt-0.5">
                      {service.title}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <UserCheck className="w-3 h-3 mr-1 text-green-500" /> Verified
                      Advisor
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 flex-1">
                  {service.description ||
                    'Expert guidance for your business growth and financial strategy.'}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                  <div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${formatCurrency(service.price)}
                    </span>
                    <span className="text-xs text-gray-500 font-normal ml-1">
                      / hour
                    </span>
                  </div>
                  <button
                    onClick={() => handleBookSession(service)}
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Book Session <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modals */}
      <CreateProposalModal
        isOpen={isCreateProposalOpen}
        onClose={() => setIsCreateProposalOpen(false)}
      />
      <CreateLoanModal
        isOpen={isCreateLoanOpen}
        onClose={() => setIsCreateLoanOpen(false)}
      />
      <InvestModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
        proposal={selectedProposal}
      />
      <ApplyLoanModal
        isOpen={!!selectedLoan}
        onClose={() => setSelectedLoan(null)}
        loan={selectedLoan}
      />
      <CreateAdvisoryModal
        isOpen={isCreateAdvisoryOpen}
        onClose={() => setIsCreateAdvisoryOpen(false)}
      />

      {/* ✅ NEW: Book Session Modal */}
      <BookSessionModal
        isOpen={isBookSessionOpen}
        onClose={() => setIsBookSessionOpen(false)}
        service={selectedService}
      />
    </div>
  );
};

export default MarketplacePage;
