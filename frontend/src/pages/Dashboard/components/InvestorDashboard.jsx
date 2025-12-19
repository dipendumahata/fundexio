import React from 'react';
import { DollarSign, TrendingUp, Users, Percent } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


const colorStyles = {
  blue: {
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
  },
  green: {
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
  },
  purple: {
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
  },
  orange: {
    iconBg: 'bg-orange-100',
    iconText: 'text-orange-600',
  },
};

const InvestorDashboard = ({ stats }) => {
  const { roleSpecific } = stats || {};

  const cards = [
    {
      label: 'Total Invested',
      value: `$${(roleSpecific?.totalInvested || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'blue',
    },
    {
      label: 'Active Deals',
      value: roleSpecific?.numberOfDeals || 0,
      icon: TrendingUp,
      color: 'green',
    },
    {
      label: 'Portfolio Co.',
      value: roleSpecific?.portfolioSummary?.length || 0,
      icon: Users,
      color: 'purple',
    },
    {
      label: 'ROI',
      value: '18.5%',
      icon: Percent,
      color: 'orange',
    },
  ];

  const doughnutData = {
    labels: ['Tech', 'Health', 'Finance', 'Energy'],
    datasets: [
      {
        data: [40, 25, 15, 20],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 0,
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
                <div
                  className={`p-2 sm:p-3 rounded-lg ${style.iconBg}`}
                >
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

      {/* 🔹 Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Allocation */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 dark:bg-gray-800 dark:border-gray-700 p-5 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Portfolio Allocation
          </h3>
          <div className="h-56 sm:h-64 flex justify-center">
            <Doughnut
  data={doughnutData}
  options={{
    maintainAspectRatio: false,
    responsive: true,
    animation: false,   // ✅ prevents double canvas init
  }}
/>

          </div>
        </div>

        {/* Recent Investments */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 dark:bg-gray-800 dark:border-gray-700 p-5 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Recent Investments
          </h3>

          <div className="space-y-3">
            {roleSpecific?.portfolioSummary?.length === 0 ? (
              <p className="text-sm text-slate-500">
                No recent investments
              </p>
            ) : (
              roleSpecific?.portfolioSummary?.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center rounded-lg border border-slate-200 bg-white dark:bg-gray-700/40 dark:border-gray-600 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {item.proposal?.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      Amount: ${item.amount}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
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

export default InvestorDashboard;
