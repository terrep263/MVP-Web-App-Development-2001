import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMessageCircle, FiBookOpen, FiCamera } = FiIcons;

const QuickActions = () => {
  const actions = [
    {
      title: 'Profile Review',
      description: 'Get AI feedback on your dating profile',
      icon: FiCamera,
      color: 'from-pink-500 to-rose-500',
      href: '/profile-review'
    },
    {
      title: 'Conversation Simulator',
      description: 'Practice your conversation skills',
      icon: FiMessageCircle,
      color: 'from-purple-500 to-indigo-500',
      href: '#'
    },
    {
      title: 'Dating Academy',
      description: 'Learn from expert dating advice',
      icon: FiBookOpen,
      color: 'from-blue-500 to-cyan-500',
      href: '#'
    },
    {
      title: 'Profile Optimization',
      description: 'Improve your dating photos',
      icon: FiUser,
      color: 'from-green-500 to-emerald-500',
      href: '#'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
          >
            <Link
              to={action.href}
              className="flex items-center p-4 rounded-lg bg-gradient-to-r hover:shadow-lg transition-all duration-300 group"
              style={{
                background: `linear-gradient(135deg, ${action.color.split(' ')[1]} 0%, ${action.color.split(' ')[2]} 100%)`,
                backgroundSize: '200% 200%',
                backgroundPosition: '100% 100%'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundPosition = '0% 0%';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundPosition = '100% 100%';
              }}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                <SafeIcon icon={action.icon} className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white group-hover:text-opacity-90">
                  {action.title}
                </h4>
                <p className="text-sm text-white text-opacity-80">
                  {action.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;