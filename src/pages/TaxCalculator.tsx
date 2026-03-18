import React, { useState } from 'react';
import { Calculator, HelpCircle, DollarSign, FileText, RefreshCw, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface TaxRate {
  country: string;
  shortTerm: number;
  longTerm: number;
}

interface TaxResult {
  purchaseAmount: number;
  saleAmount: number;
  gain: number;
  taxOwed: number;
  effectiveRate: number;
}

const taxRates: TaxRate[] = [
  { country: 'United States', shortTerm: 37, longTerm: 20 },
  { country: 'United Kingdom', shortTerm: 20, longTerm: 20 },
  { country: 'Germany', shortTerm: 25, longTerm: 0 }, // Germany has 1-year rule
  { country: 'Australia', shortTerm: 45, longTerm: 22.5 },
  { country: 'Canada', shortTerm: 50, longTerm: 25 },
  { country: 'India', shortTerm: 30, longTerm: 30 }, // Fixed 30% for India
];

const TaxCalculator: React.FC = () => {
  const [country, setCountry] = useState<string>('United States');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [purchaseAmount, setPurchaseAmount] = useState<string>('');
  const [salePrice, setSalePrice] = useState<string>('');
  const [saleAmount, setSaleAmount] = useState<string>('');
  const [holdingPeriod, setHoldingPeriod] = useState<string>('short');
  const [result, setResult] = useState<TaxResult | null>(null);

  const calculateTax = () => {
    const pp = parseFloat(purchasePrice);
    const pa = parseFloat(purchaseAmount);
    const sp = parseFloat(salePrice);
    const sa = parseFloat(saleAmount);

    if (isNaN(pp) || isNaN(pa) || isNaN(sp) || isNaN(sa) || pp < 0 || pa < 0 || sp < 0 || sa < 0) {
      alert("Please enter valid positive numbers for all fields.");
      return;
    }

    const purchaseTotal = pp * pa;
    const saleTotal = sp * sa;
    const gain = saleTotal - purchaseTotal;

    const taxRate = taxRates.find(tr => tr.country === country);
    if (!taxRate) return;

    const rate = holdingPeriod === 'long' ? taxRate.longTerm : taxRate.shortTerm;
    const taxOwed = gain > 0 ? (gain * rate) / 100 : 0;

    setResult({
      purchaseAmount: purchaseTotal,
      saleAmount: saleTotal,
      gain: gain,
      taxOwed: taxOwed,
      effectiveRate: gain > 0 ? (taxOwed / gain) * 100 : 0,
    });
  };

  const resetCalculator = () => {
    setPurchasePrice('');
    setPurchaseAmount('');
    setSalePrice('');
    setSaleAmount('');
    setHoldingPeriod('short');
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-secondary-900 dark:text-white tracking-tight">Tax Estimator</h1>
          <p className="text-sm text-secondary-500">Calculate capital gains tax based on regional regulations.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button onClick={resetCalculator} className="px-4 py-2 bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-white rounded-lg text-sm font-bold hover:bg-secondary-200 transition-all flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Input Form */}
          <div className="card p-8 border-none shadow-xl bg-white dark:bg-secondary-800 rounded-3xl">
            <h2 className="text-lg font-bold text-secondary-900 dark:text-white mb-6 flex items-center">
              <Calculator className="h-5 w-5 mr-3 text-bitcoin-orange" />
              Transaction Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-secondary-400 uppercase tracking-widest">Tax Jurisdiction</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full p-3 bg-secondary-50 dark:bg-secondary-900 border-none rounded-xl focus:ring-2 focus:ring-bitcoin-orange transition-all font-bold outline-none">
                  {taxRates.map((tr) => <option key={tr.country} value={tr.country}>{tr.country}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-secondary-400 uppercase tracking-widest">Holding Strategy</label>
                <select value={holdingPeriod} onChange={(e) => setHoldingPeriod(e.target.value)} className="w-full p-3 bg-secondary-50 dark:bg-secondary-900 border-none rounded-xl focus:ring-2 focus:ring-bitcoin-orange transition-all font-bold outline-none">
                  <option value="short">Short Term (&le; 1 Year)</option>
                  <option value="long">Long Term (&gt; 1 Year)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-secondary-400 uppercase tracking-widest">Buy Price (USD)</label>
                <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className="w-full p-3 bg-secondary-50 dark:bg-secondary-900 border-none rounded-xl focus:ring-2 focus:ring-bitcoin-orange outline-none font-bold" placeholder="0.00" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-secondary-400 uppercase tracking-widest">Buy Qty (BTC)</label>
                <input type="number" value={purchaseAmount} onChange={(e) => setPurchaseAmount(e.target.value)} className="w-full p-3 bg-secondary-50 dark:bg-secondary-900 border-none rounded-xl focus:ring-2 focus:ring-bitcoin-orange outline-none font-bold" placeholder="0.0000" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-secondary-400 uppercase tracking-widest">Sell Price (USD)</label>
                <input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="w-full p-3 bg-secondary-50 dark:bg-secondary-900 border-none rounded-xl focus:ring-2 focus:ring-bitcoin-orange outline-none font-bold" placeholder="0.00" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-secondary-400 uppercase tracking-widest">Sell Qty (BTC)</label>
                <input type="number" value={saleAmount} onChange={(e) => setSaleAmount(e.target.value)} className="w-full p-3 bg-secondary-50 dark:bg-secondary-900 border-none rounded-xl focus:ring-2 focus:ring-bitcoin-orange outline-none font-bold" placeholder="0.0000" />
              </div>

              <button
                onClick={calculateTax}
                disabled={!purchasePrice || !purchaseAmount || !salePrice || !saleAmount}
                className="md:col-span-2 py-4 bg-bitcoin-orange text-white rounded-xl font-black shadow-lg shadow-bitcoin-orange/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                EXECUTE CALCULATION
              </button>
            </div>
          </div>

          {/* Results Display */}
          {result && (
            <div className="card p-8 border-none shadow-2xl bg-secondary-900 text-white rounded-3xl animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center">
                  <FileText className="h-6 w-6 mr-3 text-bitcoin-orange" /> Tax Liability Report
                </h2>
                <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${result.gain >= 0 ? 'bg-success-500/20 text-success-400' : 'bg-error-500/20 text-error-400'}`}>
                  {result.gain >= 0 ? 'Capital Gain' : 'Capital Loss'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-secondary-400 text-xs font-bold uppercase">Net Profit/Loss</p>
                  <p className={`text-2xl font-black ${result.gain >= 0 ? 'text-success-400' : 'text-error-400'}`}>
                    ${result.gain.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="space-y-1 border-l border-white/10 pl-6">
                  <p className="text-secondary-400 text-xs font-bold uppercase">Effective Rate</p>
                  <p className="text-2xl font-black">{result.effectiveRate.toFixed(2)}%</p>
                </div>
                <div className="bg-bitcoin-orange p-6 rounded-2xl md:-mt-4 md:-mb-4 shadow-xl shadow-bitcoin-orange/30">
                  <p className="text-white/80 text-xs font-bold uppercase mb-1">Tax Payable</p>
                  <p className="text-3xl font-black">${result.taxOwed.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Knowledge Base Sidebar */}
        <div className="space-y-6">
          <div className="card p-6 border-none shadow-lg bg-white dark:bg-secondary-800 rounded-2xl">
            <h3 className="text-sm font-black text-secondary-400 uppercase mb-4 tracking-tighter">Regional Tax Rates</h3>
            <div className="space-y-3">
              {taxRates.map((tr) => (
                <div key={tr.country} className="flex justify-between items-center p-3 hover:bg-secondary-50 dark:hover:bg-secondary-900 rounded-xl transition-colors">
                  <span className="text-sm font-bold text-secondary-700 dark:text-white">{tr.country}</span>
                  <div className="text-right">
                    <p className="text-xs font-black text-bitcoin-orange">{tr.shortTerm}% Short</p>
                    <p className="text-[10px] text-secondary-400 font-bold">{tr.longTerm}% Long</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-center text-amber-600 mb-2">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="font-bold text-sm">Regulatory Notice</span>
            </div>
            <p className="text-xs text-amber-700/80 dark:text-amber-400 leading-relaxed font-medium">
              Tax estimations are based on current year bracket data. Crypto taxation varies wildly. Always confirm with a local advisor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;