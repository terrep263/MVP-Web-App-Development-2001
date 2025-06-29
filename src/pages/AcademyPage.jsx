import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAcademy } from '../contexts/AcademyContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import ModuleOverview from '../components/academy/ModuleOverview';
import LessonViewer from '../components/academy/LessonViewer';
import ProgressDashboard from '../components/academy/ProgressDashboard';
import BadgeCollection from '../components/academy/BadgeCollection';
import SubscriptionGate from '../components/subscription/SubscriptionGate';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBookOpen, FiTrendingUp, FiAward, FiPlay } = FiIcons;

const AcademyPage = () => {
  const { currentModule, currentLesson, getOverallProgress } = useAcademy();
  const { canUseFeature } = useSubscription();
  const [activeTab, setActiveTab] = useState('modules');

  const tabs = [
    { id: 'modules', label: 'Academy Modules', icon: FiBookOpen },
    { id: 'progress', label: 'My Progress', icon: FiTrendingUp },
    { id: 'badges', label: 'Achievements', icon: FiAward }
  ];

  // Check if user can access academy modules
  const hasAcademyAccess = canUseFeature('academyModule');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiBookOpen} className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dating Academy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Master the art of modern dating with our comprehensive video courses, 
            interactive exercises, and personalized coaching modules.
          </p>
          
          {/* Overall Progress Bar */}
          {hasAcademyAccess && (
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span>{getOverallProgress()}% Complete</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getOverallProgress()}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Show lesson viewer if lesson is selected */}
        {currentLesson ? (
          <LessonViewer />
        ) : (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8 justify-center">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'modules' && (
                  <SubscriptionGate 
                    feature="academyModule"
                    title="Dating Academy Modules"
                    description="Access comprehensive dating courses and interactive lessons"
                    fallback={<ModuleOverview restricted={true} />}
                  >
                    <ModuleOverview />
                  </SubscriptionGate>
                )}

                {activeTab === 'progress' && hasAcademyAccess && <ProgressDashboard />}
                {activeTab === 'badges' && hasAcademyAccess && <BadgeCollection />}

                {(activeTab === 'progress' || activeTab === 'badges') && !hasAcademyAccess && (
                  <SubscriptionGate 
                    feature="academyModule"
                    title="Academy Progress & Achievements"
                    description="Track your learning progress and earn achievement badges"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default AcademyPage;