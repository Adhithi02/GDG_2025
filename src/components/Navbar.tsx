import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Civic Rights Portal</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'citizen' ? '/citizen/dashboard' : '/government/dashboard'} 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600">
                  Dashboard
                </Link>
                {user?.role === 'citizen' && (
                  <Link to="/citizen/new-complaint" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600">
                    New Complaint
                  </Link>
                )}
                <div className="px-3 py-2 text-sm font-medium">
                  {user?.name} ({user?.role === 'government' ? user?.department : 'Citizen'})
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700"
                >
                  <LogOut size={16} className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600">
                  Login
                </Link>
                <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-500">
                  Register
                </Link>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700">
            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'citizen' ? '/citizen/dashboard' : '/government/dashboard'} 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600">
                  Dashboard
                </Link>
                {user?.role === 'citizen' && (
                  <Link to="/citizen/new-complaint" 
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600">
                    New Complaint
                  </Link>
                )}
                <div className="block px-3 py-2 text-base font-medium">
                  {user?.name} ({user?.role === 'government' ? user?.department : 'Citizen'})
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700"
                >
                  <LogOut size={16} className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600">
                  Login
                </Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-500">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;