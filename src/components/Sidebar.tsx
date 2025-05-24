import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  Calculator, 
  MapPin,
  AlertCircle,
  Settings,
  HelpCircle,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
          Main Menu
        </h2>
        <nav className="mt-5 space-y-1">
          <SidebarLink to="/" icon={<LayoutDashboard size={20} />} text="Dashboard" />
          <SidebarLink to="/price-tracker" icon={<LineChart size={20} />} text="Price Tracker" />
          <SidebarLink to="/tax-calculator" icon={<Calculator size={20} />} text="Tax Calculator" />
          <SidebarLink to="/atm-finder" icon={<MapPin size={20} />} text="ATM Finder" />
        </nav>
      </div>
      
      <div className="mt-6 p-4">
        <h2 className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
          Other
        </h2>
        <nav className="mt-5 space-y-1">
          <SidebarLink to="/alerts" icon={<AlertCircle size={20} />} text="Price Alerts" />
          <SidebarLink to="/settings" icon={<Settings size={20} />} text="Settings" />
          <SidebarLink to="/help" icon={<HelpCircle size={20} />} text="Help & Support" />
        </nav>
      </div>
      
      <div className="mt-auto p-4">
        <div className="rounded-lg bg-bitcoin-light dark:bg-bitcoin-dark p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm text-secondary-600 dark:text-secondary-300">Current Price</span>
            <span className="animate-pulse-slow inline-block w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <div className="text-lg font-bold text-secondary-900 dark:text-white" id="current-price">
            $--,---
          </div>
          <div className="text-sm text-success-500 mt-1" id="price-change">
            +-.--% 24h
          </div>
        </div>
      </div>
    </aside>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, text }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-bitcoin-light text-bitcoin-orange dark:bg-bitcoin-dark dark:text-bitcoin-orange'
            : 'text-secondary-600 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-700'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {text}
    </NavLink>
  );
};

export default Sidebar;