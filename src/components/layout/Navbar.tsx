import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, BookOpen, Award, ChevronDown } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { progress } = useProgress();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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

        <SignedIn>
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
        </SignedIn>

        <div className="hidden md:flex items-center gap-4">
          <SignedIn>
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
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          
          <SignedOut>
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
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
            <SignedIn>
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
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            
            <SignedOut>
              <div className="flex flex-col gap-2">
                <SignInButton mode="modal">
                  <button className="w-full px-4 py-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-left">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-left">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;