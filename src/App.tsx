import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import PriceTracker from './pages/PriceTracker';
import TaxCalculator from './pages/TaxCalculator';
import AtmFinder from './pages/AtmFinder';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Check for user's preferred color scheme or saved preference
  useEffect(() => {
    if (
      localStorage.getItem('darkMode') === 'true' ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches &&
        localStorage.getItem('darkMode') !== 'false')
    ) {
      setDarkMode(true);
    }
  }, []);

  // Update dark mode class and save preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-secondary-300" />
          ) : (
            <Moon className="w-5 h-5 text-secondary-600" />
          )}
        </button>
      </Navbar>
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/price-tracker" element={<PriceTracker />} />
            <Route path="/tax-calculator" element={<TaxCalculator />} />
            <Route path="/atm-finder" element={<AtmFinder />} />
          </Routes>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;