import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useRole } from '../contexts/RoleContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiUser, FiLogOut, FiMenu, FiX, FiCamera, FiMessageCircle, FiBookOpen, FiCreditCard, FiBarChart, FiUsers, FiStar, FiShield } = FiIcons;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { currentPlan, isTrialActive, getTrialDaysLeft } = useSubscription();
  const { hasPermission } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = user ? [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/profile-review', label: 'Profile Review' },
    { path: '/conversation-simulator', label: 'Practice' },
    { path: '/academy', label: 'Academy' },
    { path: '/referral', label: 'Referral' },
    { path: '/billing', label: 'Billing' },
    // Admin links - only show if user has permissions
    ...(hasPermission('view_analytics') ? [{ path: '/admin', label: 'Admin' }] : []),
    ...(hasPermission('manage_users') ? [{ path: '/users', label: 'Users' }] : []),
    { path: '/profile', label: 'Profile' }
  ] : [
    { path: '/success-stories', label: 'Success Stories' },
    { path: '/login', label: 'Login' },
    { path: '/register', label: 'Sign Up' }
  ];

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      editor: 'bg-green-100 text-green-800',
      viewer: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || colors.viewer;
  };

  const getRoleIcon = (role) => {
    const icons = {
      admin: FiShield,
      manager: FiUsers,
      editor: FiUser,
      viewer: FiUser
    };
    return icons[role] || FiUser;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <SafeIcon icon={FiHeart} className="h-8 w-8 text-pink-600" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Spark Coach
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <div className="flex items-center space-x-4">
                {/* Role Badge */}
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getRoleColor(user.role)}`}>
                    <SafeIcon icon={getRoleIcon(user.role)} className="h-3 w-3" />
                    <span>{user.role}</span>
                  </span>
                </div>

                {/* Subscription Badge */}
                {currentPlan && (
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      currentPlan.id === 'premium'
                        ? 'bg-purple-100 text-purple-800'
                        : currentPlan.id === 'standard'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {currentPlan.name}
                      {isTrialActive() && ` (Trial: ${getTrialDaysLeft()}d)`}
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <SafeIcon icon={FiLogOut} className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <SafeIcon icon={mobileMenuOpen ? FiX : FiMenu} className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-pink-600 bg-pink-50'
                      : 'text-gray-600 hover:text-pink-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user && (
                <div className="pt-2 border-t border-gray-200">
                  {/* Mobile Role Badge */}
                  <div className="px-3 py-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 w-fit ${getRoleColor(user.role)}`}>
                      <SafeIcon icon={getRoleIcon(user.role)} className="h-3 w-3" />
                      <span>{user.role}</span>
                    </span>
                  </div>

                  {/* Mobile Subscription Badge */}
                  {currentPlan && (
                    <div className="px-3 py-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        currentPlan.id === 'premium'
                          ? 'bg-purple-100 text-purple-800'
                          : currentPlan.id === 'standard'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {currentPlan.name}
                        {isTrialActive() && ` (Trial: ${getTrialDaysLeft()}d)`}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 px-3 py-2">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors w-full text-left"
                  >
                    <SafeIcon icon={FiLogOut} className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;