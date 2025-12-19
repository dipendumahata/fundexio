import React from 'react';
import { DollarSign, Users, Clock, Briefcase, Calendar } from 'lucide-react';

const AdvisorDashboard = ({ stats }) => {
  const { roleSpecific } = stats || {};

  const cards = [
    { label: 'Total Earnings', value: `$${(roleSpecific?.totalEarnings || 0).toLocaleString()}`, icon: DollarSign, color: 'green' },
    { label: 'Active Clients', value: roleSpecific?.totalClients || 0, icon: Users, color: 'blue' },
    { label: 'Pending Requests', value: roleSpecific?.pendingSessions?.length || 0, icon: Clock, color: 'orange' },
    { label: 'Active Services', value: roleSpecific?.activeServices || 0, icon: Briefcase, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      {/* 1️⃣ Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 sm:p-3 rounded-lg bg-${card.color}-100 dark:bg-${card.color}-900/30`}>
                <card.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${card.color}-600 dark:text-${card.color}-400`} />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2️⃣ Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Session Requests
            </h3>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              {roleSpecific?.pendingSessions?.length || 0} Pending
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto p-3 sm:p-4 space-y-3">
            {roleSpecific?.pendingSessions?.length === 0 ? (
              <p className="text-center text-sm text-gray-500">No pending requests.</p>
            ) : (
              roleSpecific?.pendingSessions?.map(session => (
                <div
                  key={session._id}
                  className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {session.client?.firstName} {session.client?.lastName}
                    </p>
                    <p className="text-[11px] text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(session.scheduledAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {session.service?.title}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Sessions
            </h3>
          </div>

          {/* 📱 Mobile Card View */}
          <div className="block sm:hidden p-3 space-y-3">
            {roleSpecific?.upcomingSessions?.length === 0 ? (
              <p className="text-center text-sm text-gray-500">No upcoming sessions.</p>
            ) : (
              roleSpecific?.upcomingSessions?.map(session => (
                <div
                  key={session._id}
                  className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900/40"
                >
                  <p className="font-medium text-sm text-gray-900 dark:text-white">
                    {session.client?.firstName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(session.scheduledAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* 🖥 Desktop Table */}
          <div className="hidden sm:block">
            {roleSpecific?.upcomingSessions?.length === 0 ? (
              <p className="p-6 text-center text-gray-500">No upcoming sessions.</p>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {roleSpecific?.upcomingSessions?.map(session => (
                    <tr key={session._id}>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {session.client?.firstName}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(session.scheduledAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorDashboard;
