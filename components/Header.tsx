import React, { useState, useEffect } from 'react';
import { LockClosedIcon } from './icons/LockIcon';
import { LogoIcon } from './icons/LogoIcon';

interface HeaderProps {
  onLoginClick: () => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onLogoClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button onClick={onLogoClick} className="flex items-center gap-3 text-2xl font-bold text-horizon-blue-primary cursor-pointer">
          <LogoIcon className="w-9 h-9" />
          <span>Banque Populaire</span>
        </button>

        <div className="flex items-center gap-4">
          <button className="hidden md:block bg-horizon-blue-secondary text-horizon-blue-primary px-4 py-2 rounded-full font-semibold text-sm hover:bg-opacity-80 transition-colors">
            Trouver une agence
          </button>
          <button 
            onClick={onLoginClick}
            className="bg-horizon-blue-primary text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-opacity-90 transition-transform hover:scale-105"
          >
            <LockClosedIcon className="w-4 h-4" />
            Espace Client
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
