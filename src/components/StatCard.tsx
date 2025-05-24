import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="card p-4 hover:shadow-card-hover transition-all">
      <div className="flex items-center">
        <div className="rounded-full p-2 bg-secondary-100 dark:bg-secondary-700">
          {icon}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">{title}</h3>
          <p className="text-xl font-bold text-secondary-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;