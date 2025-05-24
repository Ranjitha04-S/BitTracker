import React from 'react';
import { Link } from 'react-router-dom';
import { Bitcoin, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-secondary-800 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Bitcoin className="h-8 w-8 text-bitcoin-orange" />
              <span className="ml-2 text-xl font-bold text-secondary-900 dark:text-white">BitTrack</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/price-tracker">Price Tracker</NavLink>
            <NavLink to="/tax-calculator">Tax Calculator</NavLink>
            <NavLink to="/atm-finder">ATM Finder</NavLink>
            
            {children}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {children}
            
            <button
              onClick={toggleMobileMenu}
              className="ml-2 p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            <MobileNavLink to="/" onClick={toggleMobileMenu}>Dashboard</MobileNavLink>
            <MobileNavLink to="/price-tracker" onClick={toggleMobileMenu}>Price Tracker</MobileNavLink>
            <MobileNavLink to="/tax-calculator" onClick={toggleMobileMenu}>Tax Calculator</MobileNavLink>
            <MobileNavLink to="/atm-finder" onClick={toggleMobileMenu}>ATM Finder</MobileNavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="px-3 py-2 rounded-md text-sm font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:text-white dark:hover:bg-secondary-700 transition-colors"
    >
      {children}
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, onClick, children }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-2 rounded-md text-base font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:text-white dark:hover:bg-secondary-700 transition-colors"
    >
      {children}
    </Link>
  );
};

export default Navbar;