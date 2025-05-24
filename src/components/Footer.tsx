import React from 'react';
import { Bitcoin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <Bitcoin className="h-5 w-5 text-bitcoin-orange" />
            <span className="ml-2 text-sm font-medium text-secondary-600 dark:text-secondary-300">
              BitTrack
            </span>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-secondary-500 dark:text-secondary-400">
            <div className="flex items-center justify-center md:justify-end">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-error-500" />
              <span>for the Bitcoin community</span>
            </div>
            <div className="text-center md:text-right mt-1">
              Data provided by CoinGecko and CoinMap APIs
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;