import React from 'react';
import { DollarSign, Briefcase, Activity, Percent } from 'lucide-react';
import { Line } from 'react-chartjs-2';

// ⚠️ ChartJS registration SHOULD already exist globally
// (Do not re-register here if already done)

const colorStyles = {
  blue: {
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    pillBg: 'bg-blue-100 text-blue-800',
  },
  green: {
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
    pillBg: 'bg-green-100 text-green-800',
  },
  purple: {
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
    pillBg: 'bg-purple-100 text-purple-800',
  },
  orange: {
    iconBg: 'bg-orange-100',
    iconText: 'text-orange-600',
    pillBg: 'bg-orange-100 text-orange-800',
  },
};

const BusinessDashboard = ({ stats }) => {
  const { roleSpecific } = stats || {};

  const cards = [
    {
      label: 'Funding Received',
      value: `$${(roleSpecific?.totalFundingReceived || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'blue',
    },
    {
      label: 'Total Proposals',
      value: roleSpecific?.totalProposals || 0,
      icon: Briefcase,
      color: 'green',
    },
    {
      label: 'Active Loans',
      value: roleSpecific?.activeLoans || 0,
      icon: Activity,
      color: 'purple',
    },
    {
      label: 'Success Rate',
      value: '85%',
      icon: Percent,
      color: 'orange',
    },
  ];

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Funding Growth',
        data: [10000, 15000, 12000, 18000, 25000, 30000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* 🔹 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const style = colorStyles[card.color];
          return (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50 dark:bg-gray-800 dark:border-gray-700 p-4 sm:p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 sm:p-3 rounded-lg ${style.iconBg}`}>
                  <card.icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${style.iconText}`}
                  />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">
                    {card.label}
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white">
                    {card.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔹 Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funding Overview */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 dark:bg-gray-800 dark:border-gray-700 p-5 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Funding Overview
          </h3>
          <div className="h-56 sm:h-64">
            <Line
              data={lineChartData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                animation: false, // ✅ safe for React re-render
              }}
            />
          </div>
        </div>

        {/* Recent Proposals */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 dark:bg-gray-800 dark:border-gray-700 p-5 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Recent Proposals
          </h3>

          <div className="space-y-3">
            {roleSpecific?.recentActivity?.length === 0 ? (
              <p className="text-sm text-slate-500">
                No recent proposals
              </p>
            ) : (
              roleSpecific?.recentActivity?.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center rounded-lg border border-slate-200 bg-white dark:bg-gray-700/40 dark:border-gray-600 p-3"
                >
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {item.title}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      colorStyles.blue.pillBg
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
