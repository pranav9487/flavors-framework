import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Food Analysis', path: '/analysis' },
    { name: 'Meal Planning', path: '/meal-plan' },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6',
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-display font-medium tracking-tight text-primary transition-colors hover:text-primary/80"
        >
          <i className="bi bi-flower3 text-2xl"></i>
          <span>NutriPlan</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                'text-sm font-medium transition-all hover:text-primary',
                location.pathname === item.path 
                  ? 'text-primary'
                  : 'text-foreground/70'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-foreground/80 hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-background animate-fade-in">
          <nav className="flex flex-col items-center justify-center h-full space-y-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'text-lg font-medium transition-all hover:text-primary animate-fade-up',
                  location.pathname === item.path 
                    ? 'text-primary'
                    : 'text-foreground/70'
                )}
                style={{ animationDelay: `${navigation.indexOf(item) * 0.1}s` }}
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
