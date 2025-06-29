import React from 'react';
import { motion } from 'framer-motion';
import { useAcademy } from '../../contexts/AcademyContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiClock, FiTarget, FiAward, FiBookOpen, FiCheck } = FiIcons;

const ProgressDashboard = () => {
  const { 
    modules, 
    getModuleProgress, 
    getOverallProgress, 
    isModuleCompleted, 
    completedLessons,
    earnedBadges 
  } = useAcademy();

  const totalLessons = Object.values(modules).reduce((sum, module) => sum + module.lessons.length, 0);
  const completedCount = completedLessons.length;

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Overall Progress</p>
              <p className="text-2xl font-bold text-blue-600">{getOverallProgress()}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Lessons Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedCount}/{totalLessons}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiBookOpen} className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Badges Earned</p>
              <p className="text-2xl font-bold text-purple-600">{earnedBadges.length}/5</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiAward} className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Study Time</p>
              <p className="text-2xl font-bold text-orange-600">2.5h</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiClock} className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Module Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Module Progress</h3>
        <div className="space-y-4">
          {Object.values(modules).map((module, index) => {
            const progress = getModuleProgress(module.id);
            const completed = isModuleCompleted(module.id);
            const progressPercentage = Math.round((progress / module.lessons.length) * 100);

            return (
              <div key={module.id} className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  completed ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {completed ? (
                    <SafeIcon icon={FiCheck} className="h-5 w-5 text-green-600" />
                  ) : (
                    <span className="text-gray-600 text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{module.title}</h4>
                    <span className="text-sm text-gray-600">
                      {progress}/{module.lessons.length} lessons
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${module.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    completed ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {progressPercentage}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Learning Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white"
      >
        <h3 className="text-lg font-semibold mb-4">🔥 Learning Streak</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">7</div>
            <div className="text-blue-100">Days in a row</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">21</div>
            <div className="text-blue-100">Total study days</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">14</div>
            <div className="text-blue-100">Longest streak</div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {completedLessons.slice(-5).map((lessonKey, index) => {
            const [moduleId, lessonId] = lessonKey.split('-');
            const module = modules[moduleId];
            const lesson = module?.lessons.find(l => l.id === lessonId);
            
            if (!lesson) return null;

            return (
              <div key={lessonKey} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{lesson.title}</p>
                  <p className="text-sm text-gray-600">{module.title}</p>
                </div>
                <span className="text-xs text-gray-500">Just completed</span>
              </div>
            );
          })}
          
          {completedLessons.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <SafeIcon icon={FiBookOpen} className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No completed lessons yet. Start your first module to see progress here!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Next Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">🎯 Next Goals</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiTarget} className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-blue-900">Complete 3 more lessons</p>
              <p className="text-sm text-blue-700">Unlock the "Quick Learner" badge</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiAward} className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-purple-900">Finish your first module</p>
              <p className="text-sm text-purple-700">Earn your first completion badge</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressDashboard;