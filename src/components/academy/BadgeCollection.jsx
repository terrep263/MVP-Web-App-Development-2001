import React from 'react';
import { motion } from 'framer-motion';
import { useAcademy } from '../../contexts/AcademyContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiAward, FiLock, FiCalendar } = FiIcons;

const BadgeCollection = () => {
  const { modules, earnedBadges, isModuleCompleted } = useAcademy();

  const allBadges = Object.values(modules).map(module => ({
    ...module.badge,
    moduleId: module.id,
    earned: isModuleCompleted(module.id),
    color: module.color
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Achievement Collection</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Earn badges by completing modules and mastering dating skills. 
          Show off your achievements and track your learning journey!
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Badge Progress</h3>
            <p className="text-purple-100">
              {earnedBadges.length} of {allBadges.length} badges earned
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {Math.round((earnedBadges.length / allBadges.length) * 100)}%
            </div>
            <div className="text-purple-100 text-sm">Complete</div>
          </div>
        </div>
        
        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${(earnedBadges.length / allBadges.length) * 100}%` }}
          />
        </div>
      </motion.div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allBadges.map((badge, index) => (
          <motion.div
            key={badge.moduleId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 text-center transition-all ${
              badge.earned
                ? 'border-yellow-300 shadow-lg'
                : 'border-gray-200 opacity-75'
            }`}
          >
            {/* Badge Icon */}
            <div className={`relative w-20 h-20 mx-auto mb-4 ${
              badge.earned ? '' : 'filter grayscale'
            }`}>
              <div className={`w-full h-full bg-gradient-to-r ${badge.color} rounded-full flex items-center justify-center`}>
                <SafeIcon 
                  icon={badge.earned ? FiAward : FiLock} 
                  className={`h-10 w-10 ${badge.earned ? 'text-white' : 'text-gray-400'}`} 
                />
              </div>
              
              {badge.earned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white"
                >
                  <span className="text-yellow-800 text-xs font-bold">✓</span>
                </motion.div>
              )}
            </div>

            {/* Badge Details */}
            <h3 className={`text-lg font-semibold mb-2 ${
              badge.earned ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {badge.name}
            </h3>
            
            <p className={`text-sm mb-4 ${
              badge.earned ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {badge.description}
            </p>

            {/* Badge Status */}
            {badge.earned ? (
              <div className="bg-green-50 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                <div className="flex items-center justify-center space-x-1">
                  <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                  <span>Earned recently</span>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm">
                Complete module to unlock
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Special Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Special Achievements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quick Learner */}
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">⚡</span>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Quick Learner</h4>
              <p className="text-sm text-blue-700">Complete 5 lessons in one day</p>
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Coming Soon</span>
            </div>
          </div>

          {/* Perfectionist */}
          <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xl">💎</span>
            </div>
            <div>
              <h4 className="font-medium text-purple-900">Perfectionist</h4>
              <p className="text-sm text-purple-700">Score 100% on all quizzes</p>
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">Coming Soon</span>
            </div>
          </div>

          {/* Dedication */}
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">🔥</span>
            </div>
            <div>
              <h4 className="font-medium text-green-900">Dedication</h4>
              <p className="text-sm text-green-700">Study for 7 days straight</p>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">4/7 days</span>
            </div>
          </div>

          {/* Master Graduate */}
          <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">🎓</span>
            </div>
            <div>
              <h4 className="font-medium text-yellow-900">Master Graduate</h4>
              <p className="text-sm text-yellow-700">Complete all 5 academy modules</p>
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                {earnedBadges.length}/5 modules
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Share Achievements */}
      {earnedBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-50 rounded-lg p-6 text-center"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎉 Share Your Success!
          </h3>
          <p className="text-gray-600 mb-4">
            Celebrate your achievements and inspire others on their dating journey.
          </p>
          <div className="flex justify-center space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Share on Social
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Download Certificate
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BadgeCollection;