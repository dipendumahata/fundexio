import React from 'react';
import { TrendingUp, Building2, Landmark, Users } from 'lucide-react';

const roles = [
  {
    id: 'investor',
    title: 'Investor',
    icon: TrendingUp,
    color: 'green',
    desc: 'Discover promising investment opportunities and connect with innovative businesses',
  },
  {
    id: 'business',
    title: 'Business',
    icon: Building2,
    color: 'blue',
    desc: 'Showcase your business and secure funding from qualified investors',
  },
  {
    id: 'banker',
    title: 'Banker',
    icon: Landmark,
    color: 'indigo',
    desc: 'Facilitate transactions and provide financial expertise to all parties',
  },
  {
    id: 'advisor',
    title: 'Advisor',
    icon: Users,
    color: 'teal',
    desc: 'Provide strategic guidance and mentorship to businesses and investors',
  },
];

const colorMap = {
  green: {
    bg: 'bg-green-200/70 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    shadow: 'hover:shadow-green-500/20',
  },
  blue: {
    bg: 'bg-blue-200/70 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    shadow: 'hover:shadow-blue-500/20',
  },
  indigo: {
    bg: 'bg-indigo-200/70 dark:bg-indigo-900/30',
    text: 'text-indigo-700 dark:text-indigo-400',
    shadow: 'hover:shadow-indigo-500/20',
  },
  teal: {
    bg: 'bg-teal-200/70 dark:bg-teal-900/30',
    text: 'text-teal-700 dark:text-teal-400',
    shadow: 'hover:shadow-teal-500/20',
  },
};

const RoleCards = ({ onRoleSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto px-4">
      {roles.map((role) => {
        const styles = colorMap[role.color];

        return (
          <div
            key={role.id}
            onClick={() => onRoleSelect?.(role.id)}
            className={`
              cursor-pointer
              rounded-2xl
              p-5 sm:p-8
              bg-gray-50 dark:bg-gray-900
              border border-gray-300 dark:border-gray-800
              shadow-sm dark:shadow-none
              transition-all duration-200
              active:scale-[0.97]
              sm:hover:-translate-y-1
              sm:hover:shadow-lg
              ${styles.shadow}
            `}
          >
            <div className="text-center">
              <div
                className={`
                  w-12 h-12 sm:w-16 sm:h-16
                  mx-auto mb-3 sm:mb-4
                  rounded-2xl
                  flex items-center justify-center
                  ${styles.bg}
                `}
              >
                <role.icon
                  className={`w-6 h-6 sm:w-8 sm:h-8 ${styles.text}`}
                  strokeWidth={1.5}
                />
              </div>

              <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {role.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 leading-snug sm:leading-relaxed">
                {role.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoleCards;
