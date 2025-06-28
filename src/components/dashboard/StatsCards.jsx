import React from 'react';
import { motion } from 'framer-motion';
import { useCoach } from '../../contexts/CoachContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiHeart, FiTarget, FiStar } = FiIcons;

const StatsCards = () => {
  const { progress } = useCoach();

  const cards = [
    {
      title: 'Profile Score',
      value: `${progress.profileScore}%`,
      icon: FiStar,
      color: 'pink',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      textColor: 'text-pink-600'
    },
    {
      title: 'Confidence Level',
      value: `${progress.confidenceLevel}%`,
      icon: FiTrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-600'
    },
    {
      title: 'Conversation Skills',
      value: `${progress.conversationSkills}%`,
      icon: FiHeart,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Tasks Completed',
      value: `${progress.completedTasks}/${progress.totalTasks}`,
      icon: FiTarget,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${card.bgColor}`}>
              <SafeIcon icon={card.icon} className={`h-6 w-6 ${card.iconColor}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;