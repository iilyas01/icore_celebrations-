import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, ShoppingBag, LayoutDashboard } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_doc-database-hub/artifacts/kq2cvlzy_image.png";

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Themes', path: '/themes' },
    { name: 'Venues', path: '/venues' },
    { name: 'Services', path: '/services' },
    { name: 'Packages', path: '/packages' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-header" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
            <img src={LOGO_URL} alt="iCore Celebrations" className="h-14 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-nunito font-semibold text-base transition-colors ${
                  isActive(link.path)
                    ? 'text-amber-500'
                    : 'text-slate-600 hover:text-amber-500'
                }`}
                data-testid={`nav-${link.name.toLowerCase()}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-plan"
                  className="flex items-center gap-2 text-slate-600 hover:text-amber-500 transition-colors"
                  data-testid="my-plan-link"
                >
                  <ShoppingBag size={20} />
                  <span className="font-nunito font-semibold">My Plan</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-slate-600 hover:text-purple-500 transition-colors"
                    data-testid="admin-link"
                  >
                    <LayoutDashboard size={20} />
                    <span className="font-nunito font-semibold">Admin</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-slate-600 hover:text-amber-500 transition-colors"
                  data-testid="profile-link"
                >
                  <User size={20} />
                  <span className="font-nunito font-semibold">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors"
                  data-testid="logout-btn"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-secondary text-sm px-6 py-2"
                  data-testid="login-link"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-6 py-2"
                  data-testid="register-link"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200" data-testid="mobile-menu">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-nunito font-semibold text-base py-2 ${
                    isActive(link.path) ? 'text-amber-500' : 'text-slate-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-plan"
                    className="font-nunito font-semibold text-base py-2 text-slate-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Plan
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="font-nunito font-semibold text-base py-2 text-purple-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="font-nunito font-semibold text-base py-2 text-slate-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="font-nunito font-semibold text-base py-2 text-red-500 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-4">
                  <Link
                    to="/login"
                    className="btn-secondary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
