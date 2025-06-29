import React from 'react';
import { motion } from 'framer-motion';
import { useAcademy } from '../../contexts/AcademyContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiCamera, FiMessageCircle, FiMapPin, FiSmartphone, FiPlay, FiCheck, FiLock, FiClock, FiAward } = FiIcons;

const ModuleOverview = ({ restricted = false }) => {
  const { modules, getModuleProgress, isModuleCompleted, setCurrentModule, getPersonalizedTips } = useAcademy();
  const { currentPlan, canUseFeature } = useSubscription();

  const getModuleIcon = (iconName) => {
    const icons = {
      FiHeart,
      FiCamera,
      FiMessageCircle,
      FiMapPin,
      FiSmartphone
    };
    return icons[iconName] || FiHeart;
  };

  const tips = getPersonalizedTips();
  const hasFullAccess = canUseFeature('academyModule');

  // Filter modules based on subscription
  const availableModules = Object.values(modules).map((module, index) => {
    let isAccessible = true;
    let lockReason = null;

    if (!hasFullAccess) {
      // Freemium users only get the first module
      if (index > 0) {
        isAccessible = false;
        lockReason = currentPlan?.id === 'freemium' ? 'Upgrade to access all modules' : 'Subscription required';
      }
    }

    return {
      ...module,
      isAccessible,
      lockReason
    };
  });

  return (
    <div className="space-y-8">
      {/* Personalized Tips */}
      {tips.length > 0 && hasFullAccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-lg p-6 border border-blue-200"
        >
          <h3 className="font-semibold text-blue-900 mb-3">💡 Personalized Tips</h3>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="text-blue-800 text-sm">
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Subscription Notice for Freemium Users */}
      {!hasFullAccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white"
        >
          <div className="flex items-center space-x-3 mb-3">
            <SafeIcon icon={FiLock} className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Unlock All Academy Modules</h3>
          </div>
          <p className="text-purple-100 mb-4">
            You have access to Module 1: Foundations of Confidence. 
            Upgrade to unlock all 5 comprehensive dating modules and transform your dating life!
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <span>✓ All 5 Academy Modules</span>
            <span>✓ Interactive Exercises</span>
            <span>✓ Downloadable Worksheets</span>
            <span>✓ Achievement Badges</span>
          </div>
        </motion.div>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableModules.map((module, index) => {
          const progress = getModuleProgress(module.id);
          const completed = isModuleCompleted(module.id);
          const progressPercentage = Math.round((progress / module.lessons.length) * 100);
          
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                !module.isAccessible ? 'opacity-75' : ''
              }`}
            >
              {/* Module Header */}
              <div className={`bg-gradient-to-r ${module.color} p-6 text-white relative`}>
                {!module.isAccessible && (
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiLock} className="h-4 w-4" />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <SafeIcon icon={getModuleIcon(module.icon)} className="h-8 w-8" />
                  {completed && module.isAccessible && (
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiCheck} className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                <p className="text-white text-opacity-90 text-sm">{module.description}</p>
              </div>

              {/* Module Content */}
              <div className="p-6">
                {/* Lock Notice */}
                {!module.isAccessible && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiLock} className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{module.lockReason}</span>
                    </div>
                  </div>
                )}

                {/* Module Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiClock} className="h-4 w-4" />
                      <span>{module.estimatedTime}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      module.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {module.difficulty}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                {module.isAccessible && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{progress}/{module.lessons.length} lessons</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${module.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Lessons List */}
                <div className="space-y-2 mb-6">
                  {module.lessons.slice(0, 3).map((lesson, lessonIndex) => {
                    const isCompleted = false; // Will be implemented with actual progress tracking
                    return (
                      <div key={lesson.id} className="flex items-center space-x-3 text-sm">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          module.isAccessible && isCompleted ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {module.isAccessible && isCompleted ? (
                            <SafeIcon icon={FiCheck} className="h-3 w-3 text-green-600" />
                          ) : (
                            <span className="text-gray-500 text-xs">{lessonIndex + 1}</span>
                          )}
                        </div>
                        <span className={`${
                          module.isAccessible && isCompleted ? 'text-gray-900' : 'text-gray-600'
                        } ${!module.isAccessible ? 'text-gray-400' : ''}`}>
                          {lesson.title}
                        </span>
                      </div>
                    );
                  })}
                  {module.lessons.length > 3 && (
                    <div className="text-xs text-gray-500 ml-8">
                      +{module.lessons.length - 3} more lessons
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => module.isAccessible && setCurrentModule(module)}
                  disabled={!module.isAccessible}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                    !module.isAccessible
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : completed
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : progress > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <SafeIcon icon={
                    !module.isAccessible ? FiLock :
                    completed ? FiAward : FiPlay
                  } className="h-5 w-5" />
                  <span>
                    {!module.isAccessible ? 'Locked' :
                     completed ? 'View Certificate' : 
                     progress > 0 ? 'Continue' : 'Start Module'}
                  </span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Getting Started Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Getting Started</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recommended Learning Path</h4>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Start with <strong>Foundations of Confidence</strong></li>
              {hasFullAccess ? (
                <>
                  <li>2. Perfect your profile with <strong>Perfect Profile</strong></li>
                  <li>3. Master conversations with <strong>Art of Conversation</strong></li>
                  <li>4. Plan amazing dates with <strong>First Dates</strong></li>
                  <li>5. Navigate apps with <strong>Digital Navigation</strong></li>
                </>
              ) : (
                <li className="text-purple-600">2-5. <strong>Upgrade to unlock all modules</strong></li>
              )}
            </ol>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Study Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Complete lessons in order for best results</li>
              <li>• Practice exercises immediately after watching videos</li>
              <li>• Download worksheets for offline reference</li>
              <li>• {hasFullAccess ? 'Award yourself after completing each module' : 'Upgrade for achievement badges'}</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ModuleOverview;