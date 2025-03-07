import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-medium">
            NutriPlan
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link to="/analysis" className="text-sm text-muted-foreground hover:text-foreground">
              Analysis
            </Link>
            <Link to="/meal-plan" className="text-sm text-muted-foreground hover:text-foreground">
              Meal Plan
            </Link>
            {user ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 