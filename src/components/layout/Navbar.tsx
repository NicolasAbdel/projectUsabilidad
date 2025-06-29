import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Heart, BookOpen, Award, LogOut, ChevronDown } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useProgress } from '../../context/ProgressContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useUser();
  const { progress } = useProgress();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSignOut = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <BookOpen className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-purple-700">Quizzbe</span>
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1">
              <Heart className="text-red-500" size={18} />
              <span className="font-semibold">{progress.lives}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="text-yellow-500" size={18} />
              <span className="font-semibold">{progress.points}</span>
            </div>
          </div>
        )}

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                }`}
              >
                Lessons
              </Link>
              <Link 
                to="/profile" 
                className={`px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/profile' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                }`}
              >
                Profile
              </Link>
              
              {/* User Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                    <User className="text-purple-700" size={16} />
                  </div>
                  <ChevronDown className="text-gray-600" size={16} />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link 
              to="/profile" 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        <button 
          className="md:hidden text-gray-700"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-2">
            <Link 
              to="/" 
              className={`px-4 py-3 rounded-lg ${
                location.pathname === '/' ? 'bg-purple-100 text-purple-700' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Lessons
            </Link>
            <Link 
              to="/profile" 
              className={`px-4 py-3 rounded-lg ${
                location.pathname === '/profile' ? 'bg-purple-100 text-purple-700' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            
            {user && (
              <>
                <div className="flex items-center justify-between mt-2 pt-3 border-t">
                  <div className="flex items-center gap-1">
                    <Heart className="text-red-500" size={18} />
                    <span className="font-semibold">{progress.lives}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="text-yellow-500" size={18} />
                    <span className="font-semibold">{progress.points}</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="px-4 py-2 mb-2">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Overlay to close dropdown when clicking outside */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;