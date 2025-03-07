import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

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
    { name: 'History', path: '/history' },
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
          className="text-xl font-display font-medium tracking-tight text-primary transition-colors hover:text-primary/80"
        >
          
        NutriPlan
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
          {user ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => signOut()}
              className="ml-4"
            >
              Sign Out
            </Button>
          ) : (
            <>
              <Button asChild variant="outline" size="sm" className="ml-4">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="ml-2">
                <Link to="/login?signup=true">Sign Up</Link>
              </Button>
            </>
          )}
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
            {user ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  signOut();
                  closeMobileMenu();
                }}
                className="mt-4"
              >
                Sign Out
              </Button>
            ) : (
              <div className="flex flex-col gap-4 mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link to="/login" onClick={closeMobileMenu}>Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/login?signup=true" onClick={closeMobileMenu}>Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
