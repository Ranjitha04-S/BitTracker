import React, { useEffect, useState } from 'react';
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
import { fetchBitcoinData } from '../services/cryptoService'; // Import unga service

const Sidebar: React.FC = () => {
  // Logic to handle live price in sidebar
  const [priceData, setPriceData] = useState<{price: number, change: number} | null>(null);

  useEffect(() => {
    const getLivePrice = async () => {
      try {
        const data = await fetchBitcoinData();
        setPriceData({
          price: data.currentPrice,
          change: data.priceChangePercentage24h
        });
      } catch (err) {
        console.error("Sidebar price fetch failed");
      }
    };

    getLivePrice();
    const interval = setInterval(getLivePrice, 60000); // Every 1 minute refresh
    return () => clearInterval(interval);
  }, []);

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
      
      {/* Dynamic Price Card Section */}
      <div className="mt-auto p-4">
        <div className="rounded-lg bg-bitcoin-light dark:bg-bitcoin-dark p-4 border border-bitcoin-orange/20">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm text-secondary-600 dark:text-secondary-300">Live BTC Price</span>
            <span className="animate-ping inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
          <div className="text-lg font-bold text-secondary-900 dark:text-white">
            {priceData ? `$${priceData.price.toLocaleString()}` : 'Loading...'}
          </div>
          <div className={`text-sm mt-1 font-medium ${priceData && priceData.change >= 0 ? 'text-success-500' : 'text-error-500'}`}>
            {priceData ? `${priceData.change >= 0 ? '+' : ''}${priceData.change.toFixed(2)}%` : '--'} 
            <span className="ml-1 text-secondary-400 font-normal text-xs">24h</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

// SidebarLink component stays the same...
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