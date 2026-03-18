import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, Bell, Share2, Info, AlertTriangle, Check, Trash2, BellOff } from 'lucide-react';
import PriceChart from '../components/PriceChart';
import { fetchBitcoinData } from '../services/cryptoService';

interface PriceAlert {
  id: number;
  price: number;
  type: 'above' | 'below';
  active: boolean;
  triggered?: boolean; // Resume point: To track if user was notified
}

const PriceTracker: React.FC = () => {
  const [timeframe, setTimeframe] = useState<string>('1d');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Persistence Logic: Load from localStorage
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('btc_alerts');
    return saved ? JSON.parse(saved) : [
      { id: 1, price: 65000, type: 'above', active: true },
      { id: 2, price: 50000, type: 'below', active: true },
    ];
  });

  const [newAlertPrice, setNewAlertPrice] = useState<string>('');
  const [newAlertType, setNewAlertType] = useState<'above' | 'below'>('above');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Resume Logic: Alert Trigger Engine
  const checkAlerts = useCallback((price: number) => {
    setAlerts(prev => prev.map(alert => {
      if (!alert.active) return alert;
      
      const isTriggered = alert.type === 'above' 
        ? price >= alert.price 
        : price <= alert.price;

      if (isTriggered && !alert.triggered) {
        // Mock browser notification
        console.log(`%c ALERT: BTC hit $${price}!`, 'background: #f7931a; color: white; padding: 5px;');
        return { ...alert, triggered: true, active: false }; // Auto-disable after trigger
      }
      return alert;
    }));
  }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const data = await fetchBitcoinData();
        setCurrentPrice(data.currentPrice);
        checkAlerts(data.currentPrice);
      } catch (error) {
        console.error('Price sync failed');
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, [checkAlerts]);

  // Save alerts to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('btc_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const handleAddAlert = () => {
    const price = parseFloat(newAlertPrice);
    if (isNaN(price) || price <= 0) return;

    const newAlert: PriceAlert = {
      id: Date.now(),
      price,
      type: newAlertType,
      active: true,
      triggered: false
    };

    setAlerts([newAlert, ...alerts]);
    setNewAlertPrice('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-secondary-900 dark:text-white tracking-tight">Price Tracker</h1>
          <p className="text-sm text-secondary-500">Monitor trends and set automated triggers.</p>
        </div>
        <div className="flex mt-3 sm:mt-0 space-x-2">
          <button className="flex items-center px-4 py-2 bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-white rounded-lg text-sm font-bold hover:bg-secondary-200 transition-colors">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </button>
        </div>
      </div>

      {/* Hero Price Section */}
      <div className="card p-6 border-none shadow-xl bg-gradient-to-r from-white to-secondary-50 dark:from-secondary-800 dark:to-secondary-900">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
              </span>
              <h2 className="text-sm font-bold text-secondary-500 uppercase tracking-widest">Live Market Price</h2>
            </div>
            
            {loading && !currentPrice ? (
              <div className="h-12 w-48 animate-pulse bg-secondary-200 dark:bg-secondary-700 rounded-lg"></div>
            ) : (
              <div className="text-5xl font-black text-secondary-900 dark:text-white">
                ${currentPrice?.toLocaleString()}
                <span className="text-lg text-secondary-400 ml-2 font-medium underline decoration-bitcoin-orange/30">USD</span>
              </div>
            )}
          </div>

          <div className="inline-flex bg-secondary-200/50 dark:bg-secondary-700/50 rounded-xl p-1 h-fit self-center">
            {['1d', '7d', '30d', '1y', 'All'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${
                  timeframe === period
                    ? 'bg-white dark:bg-secondary-600 text-bitcoin-orange shadow-md'
                    : 'text-secondary-500 hover:text-secondary-900'
                }`}
              >
                {period.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80 mt-8">
          <PriceChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Active Automations</h2>
            <span className="text-xs font-bold px-2 py-1 bg-secondary-100 dark:bg-secondary-800 rounded text-secondary-500">
              {alerts.filter(a => a.active).length} Running
            </span>
          </div>
          
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
                alert.active 
                  ? 'bg-white dark:bg-secondary-800 border-secondary-100 dark:border-secondary-700 shadow-sm' 
                  : 'bg-secondary-50 dark:bg-secondary-900/50 border-transparent opacity-60'
              }`}>
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    alert.type === 'above' ? 'bg-success-100 text-success-600' : 'bg-error-100 text-error-600'
                  }`}>
                    <ArrowUpRight className={`h-6 w-6 ${alert.type === 'below' ? 'rotate-90' : ''}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-bold text-secondary-500 uppercase">Target Price</p>
                    <p className="text-lg font-black text-secondary-900 dark:text-white">
                      {alert.type === 'above' ? '≥' : '≤'} ${alert.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setAlerts(alerts.map(a => a.id === alert.id ? {...a, active: !a.active} : a))}
                    className={`p-2 rounded-lg transition-colors ${alert.active ? 'text-secondary-400 hover:bg-secondary-100' : 'text-bitcoin-orange hover:bg-bitcoin-light'}`}
                  >
                    {alert.active ? <BellOff size={20}/> : <Bell size={20}/>}
                  </button>
                  <button 
                    onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
                    className="p-2 text-secondary-400 hover:text-error-500 hover:bg-error-50 transition-all rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Alert Form */}
        <div className="card p-6 h-fit sticky top-6">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">Create New Trigger</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-secondary-500 uppercase tracking-tighter">Threshold (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 font-bold">$</span>
                <input
                  type="number"
                  value={newAlertPrice}
                  onChange={(e) => setNewAlertPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 outline-none focus:ring-2 focus:ring-bitcoin-orange transition-all font-bold"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-secondary-100 dark:bg-secondary-900 rounded-xl">
              <button
                onClick={() => setNewAlertType('above')}
                className={`py-2 rounded-lg text-sm font-bold transition-all ${newAlertType === 'above' ? 'bg-white dark:bg-secondary-700 text-bitcoin-orange shadow-sm' : 'text-secondary-500'}`}
              >
                Price Goes Above
              </button>
              <button
                onClick={() => setNewAlertType('below')}
                className={`py-2 rounded-lg text-sm font-bold transition-all ${newAlertType === 'below' ? 'bg-white dark:bg-secondary-700 text-bitcoin-orange shadow-sm' : 'text-secondary-500'}`}
              >
                Price Goes Below
              </button>
            </div>

            <button
              onClick={handleAddAlert}
              disabled={!newAlertPrice}
              className="w-full py-4 bg-bitcoin-orange text-white rounded-xl font-black shadow-lg shadow-bitcoin-orange/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              DEPLOY ALERT
            </button>

            {showSuccess && (
              <div className="flex items-center justify-center p-3 bg-success-50 text-success-600 rounded-lg font-bold text-sm animate-bounce">
                <Check className="h-4 w-4 mr-2" /> Alert is now live!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTracker;