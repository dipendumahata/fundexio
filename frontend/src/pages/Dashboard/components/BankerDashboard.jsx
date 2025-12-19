import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBankerApplications,
  updateLoanStatus,
} from '../../../features/marketplace/marketplaceSlice';
import {
  Check,
  X,
  Briefcase,
  Activity,
  DollarSign,
  Percent,
} from 'lucide-react';

const BankerDashboard = ({ stats }) => {
  const dispatch = useDispatch();
  const { applications } = useSelector((state) => state.marketplace);
  const { roleSpecific } = stats || {};

  useEffect(() => {
    dispatch(fetchBankerApplications());
  }, [dispatch]);

  const handleStatusUpdate = (appId, status) => {
    dispatch(updateLoanStatus({ applicationId: appId, status }));
  };

  const cards = [
    {
      label: 'Loan Products',
      value: roleSpecific?.activeLoanProducts || 0,
      icon: Briefcase,
      color: 'blue',
    },
    {
      label: 'Pending Apps',
      value: roleSpecific?.pendingApplications || 0,
      icon: Activity,
      color: 'orange',
    },
    {
      label: 'Total Apps',
      value: roleSpecific?.totalApplications || 0,
      icon: DollarSign,
      color: 'green',
    },
    {
      label: 'Approval Rate',
      value: '75%',
      icon: Percent,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 🔹 Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 sm:p-3 rounded-lg bg-${card.color}-100 dark:bg-${card.color}-900/30`}
              >
                <card.icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-${card.color}-600 dark:text-${card.color}-400`}
                />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {card.label}
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Applications */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Loan Applications
          </h3>
        </div>

        {/* 📱 Mobile Cards */}
        <div className="block md:hidden p-4 space-y-4">
          {applications?.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              No pending applications
            </p>
          ) : (
            applications.map((app) => (
              <div
                key={app._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/40"
              >
                <div className="flex justify-between">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {app.applicant?.firstName} {app.applicant?.lastName}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      app.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : app.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {app.loanProduct?.title}
                </p>

                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">
                  ${app.amountRequested.toLocaleString()}
                </p>

                {app.status === 'PENDING' && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() =>
                        handleStatusUpdate(app._id, 'APPROVED')
                      }
                      className="py-2 rounded-lg bg-green-600 text-white text-sm font-medium active:scale-95"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(app._id, 'REJECTED')
                      }
                      className="py-2 rounded-lg bg-red-600 text-white text-sm font-medium active:scale-95"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 🖥 Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 uppercase">
              <tr>
                <th className="px-6 py-3">Applicant</th>
                <th className="px-6 py-3">Loan Product</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {applications?.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500"
                  >
                    No pending applications
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id}>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {app.applicant?.firstName}{' '}
                      {app.applicant?.lastName}
                    </td>
                    <td className="px-6 py-4">
                      {app.loanProduct?.title}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      ${app.amountRequested.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.status === 'PENDING' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                app._id,
                                'APPROVED'
                              )
                            }
                            className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                app._id,
                                'REJECTED'
                              )
                            }
                            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BankerDashboard;
