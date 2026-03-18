import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Changed from <a> to Link
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  DollarSign,
  Activity,
  LineChart,
  Calculator,
  MapPin,
  RefreshCw // Added for better UX
} from 'lucide-react';
import { fetchBitcoinData } from '../services/cryptoService';
import PriceChart from '../components/PriceChart';
import StatCard from '../components/StatCard';

interface BitcoinData {
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

const Dashboard: React.FC = () => {
  const [bitcoinData, setBitcoinData] = useState<BitcoinData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false); // For silent updates
  const [error, setError] = useState<string | null>(null);

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setIsRefreshing(true);

      const data = await fetchBitcoinData();
      setBitcoinData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch Bitcoin data. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Resume Point: 30s Polling for Real-time consistency
    const interval = setInterval(() => loadData(true), 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !bitcoinData) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-12 w-12 text-bitcoin-orange animate-spin mb-4" />
          <div className="text-lg font-medium text-secondary-600 dark:text-secondary-400">Booting Analytics Dashboard...</div>
        </div>
      </div>
    );
  }

  if (error && !bitcoinData) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-secondary-800 rounded-2xl shadow-xl max-w-md border border-error-100">
          <div className="text-error-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">Sync Error</h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">{error}</p>
          <button className="btn btn-primary w-full py-3" onClick={() => loadData()}>Retry Connection</button>
        </div>
      </div>
    );
  }

  if (!bitcoinData) return null;

  const isPositive = bitcoinData.priceChangePercentage24h >= 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900 dark:text-white tracking-tight">Market Overview</h1>
          <p className="text-secondary-500 dark:text-secondary-400 text-sm">Real-time Bitcoin performance metrics.</p>
        </div>
        <div className="flex items-center mt-3 md:mt-0 bg-white dark:bg-secondary-800 px-4 py-2 rounded-xl shadow-sm border border-secondary-100 dark:border-secondary-700">
          <Clock className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin text-bitcoin-orange' : 'text-secondary-400'}`} />
          <span className="text-sm font-medium text-secondary-600 dark:text-secondary-300">
            {isRefreshing ? 'Syncing...' : `Updated: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </span>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 shadow-lg border-none">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-medium text-secondary-500 uppercase tracking-wider">Live Price</p>
              <div className="flex items-baseline mt-1">
                <h2 className="text-4xl font-black text-secondary-900 dark:text-white">
                  ${bitcoinData.currentPrice.toLocaleString()}
                </h2>
                <div className={`ml-3 flex items-center px-2 py-0.5 rounded-full text-sm font-bold ${isPositive ? 'bg-success-100 text-success-600' : 'bg-error-100 text-error-600'}`}>
                  {isPositive ? '+' : ''}{bitcoinData.priceChangePercentage24h.toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="flex bg-secondary-100 dark:bg-secondary-700 p-1 rounded-lg">
              <button className="px-3 py-1 text-xs font-bold rounded-md bg-white dark:bg-secondary-600 shadow-sm text-bitcoin-orange">24H</button>
              <button className="px-3 py-1 text-xs font-bold text-secondary-500">7D</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <PriceChart />
          </div>
        </div>

        {/* Vertical Stats */}
        <div className="grid grid-cols-1 gap-4">
          <StatCard
            title="Market Capitalization"
            value={`$${(bitcoinData.marketCap / 1e9).toFixed(2)}B`}
            icon={<DollarSign className="h-5 w-5 text-bitcoin-orange" />}
          />
          <StatCard
            title="Trading Volume (24h)"
            value={`$${(bitcoinData.volume24h / 1e9).toFixed(2)}B`}
            icon={<Activity className="h-5 w-5 text-primary-500" />}
          />
          <StatCard
            title="Highest (24h)"
            value={`$${bitcoinData.high24h.toLocaleString()}`}
            icon={<TrendingUp className="h-5 w-5 text-success-500" />}
          />
          <StatCard
            title="Lowest (24h)"
            value={`$${bitcoinData.low24h.toLocaleString()}`}
            icon={<TrendingDown className="h-5 w-5 text-error-500" />}
          />
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickAccessCard
          title="Price Analytics"
          description="In-depth historical trends and volatility analysis."
          linkTo="/price-tracker"
          icon={<LineChart className="h-6 w-6" />}
          color="bg-blue-500"         // flat blue
        />
        <QuickAccessCard
          title="Tax Intelligence"
          description="Regional tax estimation for Bitcoin assets."
          linkTo="/tax-calculator"
          icon={<Calculator className="h-6 w-6" />}
          color="bg-emerald-500"      // flat green
        />
        <QuickAccessCard
          title="ATM Locator"
          description="Find over 500+ secure Bitcoin exchange points."
          linkTo="/atm-finder"
          icon={<MapPin className="h-6 w-6" />}
          color="bg-amber-500"        // flat yellow/amber
        />
      </div>
    </div>
  );
};

// Sub-component for Cleanliness
const QuickAccessCard: React.FC<{ title: string, description: string, linkTo: string, icon: React.ReactNode, color: string }> = ({
  title, description, linkTo, icon, color
}) => (
  <Link to={linkTo} className="group card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className={`${color} p-5 text-white flex justify-between items-center`}>
      <h3 className="text-lg font-bold tracking-tight">{title}</h3>
      <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
    <div className="p-5 bg-white dark:bg-secondary-800">
      <p className="text-secondary-600 dark:text-secondary-400 text-sm leading-relaxed mb-4">{description}</p>
      <div className="text-bitcoin-orange text-sm font-bold flex items-center group-hover:translate-x-1 transition-transform">
        Explore Module <ArrowUpRight className="h-4 w-4 ml-1" />
      </div>
    </div>
  </Link>
);

export default Dashboard;