import React, { useState } from 'react';
import { Calculator, HelpCircle, DollarSign, FileText, RefreshCw } from 'lucide-react';

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
  { country: 'Germany', shortTerm: 0, longTerm: 0 },
  { country: 'Australia', shortTerm: 45, longTerm: 22.5 },
  { country: 'Canada', shortTerm: 50, longTerm: 25 },
  { country: 'Japan', shortTerm: 55, longTerm: 20 },
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

    if (isNaN(pp) || isNaN(pa) || isNaN(sp) || isNaN(sa)) {
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Bitcoin Tax Calculator</h1>
        <div className="mt-2 sm:mt-0 inline-flex space-x-2">
          <button onClick={resetCalculator} className="btn btn-secondary flex items-center">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Reset
          </button>
          <a href="#disclaimer" className="btn btn-secondary flex items-center">
            <HelpCircle className="h-4 w-4 mr-1.5" />
            Help
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Calculator Form */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4 flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-bitcoin-orange" />
              Tax Calculation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Country
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="input"
                >
                  {taxRates.map((tr) => (
                    <option key={tr.country} value={tr.country}>
                      {tr.country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="holding-period" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Holding Period
                </label>
                <select
                  id="holding-period"
                  value={holdingPeriod}
                  onChange={(e) => setHoldingPeriod(e.target.value)}
                  className="input"
                >
                  <option value="short">Short Term (&le; 1 year)</option>
                  <option value="long">Long Term (&gt; 1 year)</option>
                </select>
              </div>

              <div>
                <label htmlFor="purchase-price" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Purchase Price (USD)
                </label>
                <input
                  id="purchase-price"
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="e.g., 40000"
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="purchase-amount" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Purchase Amount (BTC)
                </label>
                <input
                  id="purchase-amount"
                  type="number"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  placeholder="e.g., 0.5"
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="sale-price" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Sale Price (USD)
                </label>
                <input
                  id="sale-price"
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="e.g., 60000"
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="sale-amount" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Sale Amount (BTC)
                </label>
                <input
                  id="sale-amount"
                  type="number"
                  value={saleAmount}
                  onChange={(e) => setSaleAmount(e.target.value)}
                  placeholder="e.g., 0.5"
                  className="input"
                />
              </div>

              <div className="md:col-span-2 mt-2">
                <button
                  onClick={calculateTax}
                  disabled={!purchasePrice || !purchaseAmount || !salePrice || !saleAmount}
                  className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Calculate Tax
                </button>
              </div>
            </div>
          </div>

          {/* Tax Results */}
          {result && (
            <div className="card p-6 animate-float">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-bitcoin-orange" />
                Tax Results
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary-100 dark:bg-secondary-800">
                  <div className="text-sm text-secondary-500 dark:text-secondary-400">Purchase Amount</div>
                  <div className="text-xl font-bold text-secondary-900 dark:text-white">
                    ${result.purchaseAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary-100 dark:bg-secondary-800">
                  <div className="text-sm text-secondary-500 dark:text-secondary-400">Sale Amount</div>
                  <div className="text-xl font-bold text-secondary-900 dark:text-white">
                    ${result.saleAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary-100 dark:bg-secondary-800">
                  <div className="text-sm text-secondary-500 dark:text-secondary-400">Capital Gain/Loss</div>
                  <div className={`text-xl font-bold ${result.gain >= 0 ? 'text-success-500' : 'text-error-500'}`}>
                    {result.gain >= 0 ? '+' : ''}${result.gain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary-100 dark:bg-secondary-800">
                  <div className="text-sm text-secondary-500 dark:text-secondary-400">Tax Rate</div>
                  <div className="text-xl font-bold text-secondary-900 dark:text-white">
                    {(holdingPeriod === 'long'
                      ? taxRates.find(tr => tr.country === country)?.longTerm
                      : taxRates.find(tr => tr.country === country)?.shortTerm) || 0}%
                  </div>
                </div>

                <div className="sm:col-span-2 p-4 rounded-lg bg-bitcoin-light dark:bg-bitcoin-dark">
                  <div className="text-sm text-bitcoin-orange">Estimated Tax Owed</div>
                  <div className="text-2xl font-bold text-secondary-900 dark:text-white">
                    ${result.taxOwed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-secondary-600 dark:text-secondary-300 mt-1">
                    Effective Tax Rate: {result.effectiveRate.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tax Info */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">Tax Rates</h2>

            <div className="space-y-4">
              {taxRates.map((tr) => (
                <div key={tr.country} className="p-3 rounded-lg border border-secondary-200 dark:border-secondary-700">
                  <div className="font-medium text-secondary-900 dark:text-white">{tr.country}</div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div className="text-secondary-600 dark:text-secondary-400">Short Term:</div>
                    <div className="text-secondary-900 dark:text-white font-medium">{tr.shortTerm}%</div>
                    <div className="text-secondary-600 dark:text-secondary-400">Long Term:</div>
                    <div className="text-secondary-900 dark:text-white font-medium">{tr.longTerm}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="disclaimer" className="card p-6 bg-secondary-100 dark:bg-secondary-800 border-l-4 border-warning-500">
            <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-2">Disclaimer</h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              This tax calculator provides estimates only and should not be considered as tax, legal, or financial advice.
              Tax laws vary by jurisdiction and can change over time. Please consult with a qualified tax professional for personalized advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;