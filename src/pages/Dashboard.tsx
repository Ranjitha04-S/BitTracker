import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  DollarSign,
  Activity,
  LineChart,
  Calculator,
  MapPin
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchBitcoinData();
        setBitcoinData(data);
      } catch (err) {
        setError('Failed to fetch Bitcoin data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !bitcoinData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 mb-4 rounded-full bg-bitcoin-orange opacity-75"></div>
          <div className="text-lg text-secondary-600 dark:text-secondary-400">Loading Bitcoin data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="text-error-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">Data Error</h2>
          <p className="text-secondary-600 dark:text-secondary-400">{error}</p>
          <button
            className="mt-4 btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!bitcoinData) return null;

  const isPositive = bitcoinData.priceChangePercentage24h >= 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Bitcoin Dashboard</h1>
        <div className="flex items-center mt-2 md:mt-0 bg-white dark:bg-secondary-800 px-3 py-1.5 rounded-lg shadow-sm">
          <Clock className="h-4 w-4 text-secondary-500 dark:text-secondary-400 mr-1.5" />
          <span className="text-sm text-secondary-600 dark:text-secondary-300">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Price Overview */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
              Bitcoin Price
            </h2>
            <div className="flex items-center mt-1">
              <span className="text-3xl font-bold text-secondary-900 dark:text-white">
                ${bitcoinData.currentPrice.toLocaleString()}
              </span>
              <div className={`ml-3 flex items-center ${isPositive ? 'text-success-500' : 'text-error-500'}`}>
                {isPositive ? <TrendingUp className="h-5 w-5 mr-1" /> : <TrendingDown className="h-5 w-5 mr-1" />}
                <span className="font-medium">
                  {isPositive ? '+' : ''}{bitcoinData.priceChangePercentage24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="btn btn-primary flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1.5" />
              Price Alerts
            </button>
            <button className="btn btn-secondary">24h</button>
            <button className="btn btn-secondary">7d</button>
            <button className="btn btn-secondary">30d</button>
          </div>
        </div>

        {/* Price Chart */}
        <div className="h-72">
          <PriceChart />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Market Cap"
          value={`$${(bitcoinData.marketCap / 1e9).toFixed(2)}B`}
          icon={<DollarSign className="h-5 w-5 text-bitcoin-orange" />}
        />
        <StatCard
          title="24h Volume"
          value={`$${(bitcoinData.volume24h / 1e9).toFixed(2)}B`}
          icon={<Activity className="h-5 w-5 text-primary-500" />}
        />
        <StatCard
          title="24h High"
          value={`$${bitcoinData.high24h.toLocaleString()}`}
          icon={<TrendingUp className="h-5 w-5 text-success-500" />}
        />
        <StatCard
          title="24h Low"
          value={`$${bitcoinData.low24h.toLocaleString()}`}
          icon={<TrendingDown className="h-5 w-5 text-error-500" />}
        />
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickAccessCard
          title="Price Tracking"
          description="View historical price data and set up alerts"
          linkTo="/price-tracker"
          icon={<LineChart className="h-6 w-6" />}
          color="bg-gradient-to-br from-primary-500 to-primary-600"
        />
        <QuickAccessCard
          title="Tax Calculator"
          description="Calculate tax implications for your Bitcoin transactions"
          linkTo="/tax-calculator"
          icon={<Calculator className="h-6 w-6" />}
          color="bg-gradient-to-br from-success-500 to-success-600"
        />
        <QuickAccessCard
          title="ATM Finder"
          description="Locate Bitcoin ATMs near your current location"
          linkTo="/atm-finder"
          icon={<MapPin className="h-6 w-6" />}
          color="bg-gradient-to-br from-warning-500 to-warning-600"
        />
      </div>
    </div>
  );
};

interface QuickAccessCardProps {
  title: string;
  description: string;
  linkTo: string;
  icon: React.ReactNode;
  color: string;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  title,
  description,
  linkTo,
  icon,
  color
}) => {
  return (
    <a href={linkTo} className="card overflow-hidden transform transition-transform hover:scale-105">
      <div className={`${color} p-4 text-white`}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">{title}</h3>
          {icon}
        </div>
      </div>
      <div className="p-4">
        <p className="text-secondary-600 dark:text-secondary-300">{description}</p>
        <div className="mt-3 text-bitcoin-orange font-medium flex items-center">
          Access now
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </div>
      </div>
    </a>
  );
};

export default Dashboard;
