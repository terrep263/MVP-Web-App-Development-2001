import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversation } from '../contexts/ConversationContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import ScenarioSelector from '../components/conversation/ScenarioSelector';
import ChatInterface from '../components/conversation/ChatInterface';
import SessionSummary from '../components/conversation/SessionSummary';
import SessionHistory from '../components/conversation/SessionHistory';
import SubscriptionGate from '../components/subscription/SubscriptionGate';
import UsageIndicator from '../components/subscription/UsageIndicator';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageCircle, FiPlay, FiBarChart, FiClock } = FiIcons;

const ConversationSimulatorPage = () => {
  const { currentSession, sessionHistory } = useConversation();
  const { canUseFeature, trackUsage } = useSubscription();
  const [activeTab, setActiveTab] = useState('practice');
  const [sessionSummary, setSessionSummary] = useState(null);

  const tabs = [
    { id: 'practice', label: 'Practice', icon: FiPlay },
    { id: 'history', label: 'History', icon: FiClock },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart }
  ];

  const handleSessionStart = () => {
    trackUsage('simulatorSessions');
  };

  const handleSessionEnd = (summary) => {
    setSessionSummary(summary);
    setActiveTab('analytics');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiMessageCircle} className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conversation Simulator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Practice your dating conversations with AI partners that adapt to different 
            personality types. Get real-time feedback and improve your communication skills.
          </p>

          {/* Usage Indicator */}
          <div className="max-w-md mx-auto">
            <UsageIndicator feature="simulator" />
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={tab.id === 'analytics' && !sessionSummary}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
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
            {activeTab === 'practice' && (
              <SubscriptionGate 
                feature="simulator"
                title="Conversation Simulator"
                description="Practice dating conversations with AI partners"
              >
                {!currentSession ? (
                  <ScenarioSelector onSessionStart={handleSessionStart} />
                ) : (
                  <ChatInterface onSessionEnd={handleSessionEnd} />
                )}
              </SubscriptionGate>
            )}

            {activeTab === 'history' && (
              <SessionHistory sessions={sessionHistory} />
            )}

            {activeTab === 'analytics' && sessionSummary && (
              <SessionSummary summary={sessionSummary} />
            )}

            {activeTab === 'analytics' && !sessionSummary && (
              <div className="text-center py-12">
                <SafeIcon icon={FiBarChart} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Session Data
                </h3>
                <p className="text-gray-600">
                  Complete a conversation practice session to see your analytics.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConversationSimulatorPage;