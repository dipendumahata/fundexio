import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../features/dashboard/dashboardSlice';
import { UserRoles } from '../../constants/roles';

// Import Role Components
import AdvisorDashboard from './components/AdvisorDashboard';
import BankerDashboard from './components/BankerDashboard';
import BusinessDashboard from './components/BusinessDashboard';
import InvestorDashboard from './components/InvestorDashboard';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  // Common Header
  const renderHeader = () => (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Welcome back, {user?.firstName}. Here's your overview.
      </p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {renderHeader()}

      {/* Role Based Rendering */}
      {user?.role === UserRoles.ADVISOR && <AdvisorDashboard stats={stats} />}
      {user?.role === UserRoles.BANKER && <BankerDashboard stats={stats} />}
      {user?.role === UserRoles.INVESTOR && <InvestorDashboard stats={stats} />}
      {user?.role === UserRoles.BUSINESS && <BusinessDashboard stats={stats} />}
    </div>
  );
};

export default DashboardPage;