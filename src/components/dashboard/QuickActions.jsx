import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProgressEmail } from '../../contexts/ProgressEmailContext';
import FeedbackWidget from '../feedback/FeedbackWidget';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMessageCircle, FiBookOpen, FiCamera, FiUsers, FiStar, FiMail } = FiIcons;

const QuickActions = () => {
  const { getUnreadCount } = useProgressEmail();
  const unreadEmails = getUnreadCount();

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
      href: '/conversation-simulator'
    },
    {
      title: 'Dating Academy',
      description: 'Learn from expert dating courses',
      icon: FiBookOpen,
      color: 'from-blue-500 to-cyan-500',
      href: '/academy'
    },
    {
      title: 'Refer Friends',
      description: 'Earn Premium days by referring friends',
      icon: FiUsers,
      color: 'from-green-500 to-emerald-500',
      href: '/referral'
    },
    {
      title: 'Success Stories',
      description: 'Get inspired by others\' journeys',
      icon: FiStar,
      color: 'from-yellow-500 to-orange-500',
      href: '/success-stories'
    },
    {
      title: 'Progress Updates',
      description: `View your achievement emails${unreadEmails > 0 ? ` (${unreadEmails} new)` : ''}`,
      icon: FiMail,
      color: 'from-indigo-500 to-purple-500',
      href: '/progress-emails',
      badge: unreadEmails
    }
  ];

  const handleFeedbackSubmit = (feedbackData) => {
    console.log('Dashboard feedback:', feedbackData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        
        {/* Dashboard Feedback Widget */}
        <FeedbackWidget
          trigger={
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <SafeIcon icon={FiMessageCircle} className="h-5 w-5" />
            </button>
          }
          feature="Dashboard"
          onSubmit={handleFeedbackSubmit}
          customQuestions={[
            {
              id: 'layout',
              text: 'How intuitive is the dashboard layout?',
              type: 'rating',
              scale: 5
            },
            {
              id: 'usefulness',
              text: 'Are the quick actions helpful for your workflow?',
              type: 'sentiment'
            }
          ]}
        />
      </div>

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
              className="flex items-center p-4 rounded-lg bg-gradient-to-r hover:shadow-lg transition-all duration-300 group relative"
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
              {action.badge && action.badge > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {action.badge}
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Feedback prompt */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 How can we improve your dashboard experience? 
          <FeedbackWidget
            trigger={
              <button className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                Share feedback
              </button>
            }
            feature="Dashboard Experience"
            onSubmit={handleFeedbackSubmit}
          />
        </p>
      </div>
    </motion.div>
  );
};

export default QuickActions;