import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { FileText, LogOut } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useStore();
  const toggleTheme = useStore((state) => state.toggleTheme);

  return (
    <nav className="glassmorphism p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <FileText className="text-[#D4AF37] h-8 w-8" />
          <span 
            className="text-2xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent glow-gold"
          >
            Invoice.ai
          </span>
        </Link>
        {isAuthenticated && (
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-[#D4AF37] transition">Upload</Link>
            <Link to="/create" className="text-gray-300 hover:text-[#D4AF37] transition">Invoices</Link>
            <Link to="/history" className="text-gray-300 hover:text-[#D4AF37] transition">History</Link>
            <div className="h-6 w-px bg-gray-700/50"></div>
            <button
              onClick={toggleTheme}
              className="text-gray-400 hover:text-[#D4AF37] transition"
              title="Toggle Theme"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
            <button 
              onClick={logout}
              className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition pl-2"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
