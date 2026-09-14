import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavourites } from '../context/FavouritesContext';
import { useDiagnostics } from '../context/DiagnosticsContext';
import {
  Home,
  Building2,
  KeyRound,
  BarChart3,
  Heart,
  Activity,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { favourites } = useFavourites();
  const { setIsOpen: setOpenDiagnostics, logs } = useDiagnostics();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Browse', path: '/listings', icon: Building2 },
    { name: 'Rentals', path: '/rentals', icon: KeyRound },
    { name: 'Projects', path: '/projects', icon: Home },
    { name: 'Insights', path: '/insights', icon: BarChart3 },
    ...(isAuthenticated ? [{ name: 'Saved', path: '/saved', icon: Heart, badge: favourites.length }] : [])
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  Ivy Homes
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200/60">
                    Bangalore
                  </span>
                </span>
                <span className="block text-[11px] text-slate-500 font-medium -mt-1">
                  Verified Property Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex ml-10 space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                      active
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                    {link.name}
                    {link.badge > 0 && (
                      <span className="ml-2 px-1.5 py-0.2 bg-emerald-600 text-white text-[11px] font-bold rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Live API Diagnostics Button */}
            <button
              onClick={() => setOpenDiagnostics(prev => !prev)}
              title="Open Developer API Observability Trace"
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 mr-1.5 text-emerald-600 animate-pulse" />
              API Logs
              {logs.length > 0 && (
                <span className="ml-1.5 text-[10px] font-semibold text-slate-500">
                  ({logs.length})
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
                <div className="flex items-center space-x-2 text-sm text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/70">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium text-xs text-slate-700 truncate max-w-[140px]">
                    {user?.email}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu trigger button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={() => setOpenDiagnostics(prev => !prev)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              title="API Diagnostics"
            >
              <Activity className="w-5 h-5 text-emerald-600" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {isAuthenticated && (
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'Demo User'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
          )}

          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center">
                  <Icon className={`w-4 h-4 mr-3 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {link.name}
                </div>
                {link.badge > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {isAuthenticated ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-3"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm mt-3"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
