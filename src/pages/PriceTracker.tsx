import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Bell, Share2, Info, AlertTriangle, Check } from 'lucide-react';
import PriceChart from '../components/PriceChart';
import { fetchBitcoinData } from '../services/cryptoService';

interface PriceAlert {
  id: number;
  price: number;
  type: 'above' | 'below';
  active: boolean;
}

const PriceTracker: React.FC = () => {
  const [timeframe, setTimeframe] = useState<string>('1d');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    { id: 1, price: 65000, type: 'above', active: true },
    { id: 2, price: 50000, type: 'below', active: true },
  ]);
  const [newAlertPrice, setNewAlertPrice] = useState<string>('');
  const [newAlertType, setNewAlertType] = useState<'above' | 'below'>('above');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const data = await fetchBitcoinData();
        setCurrentPrice(data.currentPrice);
      } catch (error) {
        console.error('Failed to fetch current price:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAddAlert = () => {
    const price = parseFloat(newAlertPrice);
    if (isNaN(price) || price <= 0) return;

    const newAlert: PriceAlert = {
      id: Date.now(),
      price,
      type: newAlertType,
      active: true,
    };

    setAlerts([...alerts, newAlert]);
    setNewAlertPrice('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const toggleAlert = (id: number) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, active: !alert.active } : alert
      )
    );
  };

  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Price Tracker</h1>
        <div className="flex mt-3 sm:mt-0 space-x-2">
          <button className="btn btn-secondary flex items-center">
            <Share2 className="h-4 w-4 mr-1.5" />
            Share
          </button>
          <button className="btn btn-primary flex items-center">
            <Bell className="h-4 w-4 mr-1.5" />
            Set Alert
          </button>
        </div>
      </div>

      {/* Price Overview */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Current Price</h2>
              <div className="ml-2 px-2 py-0.5 rounded bg-bitcoin-light dark:bg-bitcoin-dark text-xs font-medium text-bitcoin-orange">
                LIVE
              </div>
            </div>
            <div className="mt-1">
              {loading ? (
                <div className="h-8 w-32 animate-pulse bg-secondary-200 dark:bg-secondary-700 rounded"></div>
              ) : (
                <span className="text-3xl font-bold text-secondary-900 dark:text-white">
                  ${currentPrice?.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 sm:mt-0 inline-flex bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
            {['1d', '7d', '30d', '90d', '1y', 'All'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  timeframe === period
                    ? 'bg-white dark:bg-secondary-700 text-bitcoin-orange shadow-sm'
                    : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <PriceChart />
        </div>

        <div className="mt-4 text-xs text-secondary-500 dark:text-secondary-400 flex items-center justify-end">
          <Info className="h-3 w-3 mr-1" />
          Data provided by CoinGecko API
        </div>
      </div>

      {/* Price Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">Your Price Alerts</h2>
          
          {alerts.length === 0 ? (
            <div className="text-center p-6 border border-dashed border-secondary-300 dark:border-secondary-700 rounded-lg">
              <AlertTriangle className="h-10 w-10 mx-auto text-secondary-400 dark:text-secondary-600" />
              <p className="mt-2 text-secondary-600 dark:text-secondary-400">You don't have any price alerts yet</p>
              <p className="text-secondary-500 dark:text-secondary-500 text-sm mt-1">
                Set up alerts to be notified when Bitcoin price changes
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-secondary-200 dark:border-secondary-700"
                >
                  <div className="flex items-center">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        alert.type === 'above'
                          ? 'bg-success-500 bg-opacity-10 text-success-500'
                          : 'bg-error-500 bg-opacity-10 text-error-500'
                      }`}
                    >
                      <ArrowUpRight
                        className={`h-5 w-5 ${alert.type === 'below' ? 'transform rotate-90' : ''}`}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-secondary-900 dark:text-white">
                        When price goes {alert.type} ${alert.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        {alert.active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`p-2 rounded-md ${
                        alert.active
                          ? 'text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-700'
                          : 'text-bitcoin-orange hover:bg-bitcoin-light dark:hover:bg-bitcoin-dark'
                      }`}
                    >
                      {alert.active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 text-error-500 hover:bg-error-500 hover:bg-opacity-10 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">Add New Alert</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="alert-price" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Price Threshold (USD)
              </label>
              <input
                id="alert-price"
                type="number"
                value={newAlertPrice}
                onChange={(e) => setNewAlertPrice(e.target.value)}
                placeholder="Enter price"
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Alert Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setNewAlertType('above')}
                  className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                    newAlertType === 'above'
                      ? 'border-bitcoin-orange bg-bitcoin-light dark:bg-bitcoin-dark text-bitcoin-orange'
                      : 'border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300'
                  }`}
                >
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Above
                </button>
                <button
                  onClick={() => setNewAlertType('below')}
                  className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                    newAlertType === 'below'
                      ? 'border-bitcoin-orange bg-bitcoin-light dark:bg-bitcoin-dark text-bitcoin-orange'
                      : 'border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300'
                  }`}
                >
                  <ArrowUpRight className="h-4 w-4 mr-1 transform rotate-90" />
                  Below
                </button>
              </div>
            </div>
            
            <button
              onClick={handleAddAlert}
              disabled={!newAlertPrice || isNaN(parseFloat(newAlertPrice)) || parseFloat(newAlertPrice) <= 0}
              className="w-full btn btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Alert
            </button>
            
            {showSuccess && (
              <div className="mt-2 p-2 bg-success-500 bg-opacity-10 text-success-500 rounded-md flex items-center">
                <Check className="h-4 w-4 mr-1.5" />
                Alert created successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTracker;