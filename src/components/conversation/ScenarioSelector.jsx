import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useConversation } from '../../contexts/ConversationContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiUsers, FiHeart, FiMessageCircle, FiTarget, FiTrendingUp, FiAlertCircle } = FiIcons;

const ScenarioSelector = () => {
  const { scenarios, personalities, startSession } = useConversation();
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedPersonality, setSelectedPersonality] = useState(null);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return FiPlay;
      case 'intermediate': return FiTarget;
      case 'advanced': return FiTrendingUp;
      default: return FiPlay;
    }
  };

  const getPersonalityIcon = (personalityKey) => {
    switch (personalityKey) {
      case 'adventurous': return FiTrendingUp;
      case 'reserved': return FiUsers;
      case 'humorous': return FiMessageCircle;
      case 'intellectual': return FiTarget;
      default: return FiHeart;
    }
  };

  const handleStartSession = () => {
    if (selectedScenario && selectedPersonality) {
      startSession(selectedScenario, selectedPersonality);
    }
  };

  return (
    <div className="space-y-8">
      {/* Scenario Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Scenario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(scenarios).map(([id, scenario]) => (
            <motion.button
              key={id}
              onClick={() => setSelectedScenario(id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-lg border-2 text-left transition-all ${
                selectedScenario === id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {scenario.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {scenario.description}
                  </p>
                </div>
                <SafeIcon 
                  icon={getDifficultyIcon(scenario.difficulty)} 
                  className="h-6 w-6 text-blue-600 ml-4" 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                  {scenario.difficulty}
                </span>
                {selectedScenario === id && (
                  <SafeIcon icon={FiPlay} className="h-5 w-5 text-blue-600" />
                )}
              </div>

              {selectedScenario === id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-blue-200"
                >
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Context:</strong> {scenario.context}
                  </p>
                  <div className="text-sm text-gray-700">
                    <strong>Goals:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {scenario.goals.map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Personality Selection */}
      {selectedScenario && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Chat Partner</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(personalities).map(([id, personality]) => (
              <motion.button
                key={id}
                onClick={() => setSelectedPersonality(id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-lg border-2 text-left transition-all ${
                  selectedPersonality === id
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={personality.avatar}
                    alt={personality.name}
                    className="w-16 h-16 rounded-full border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {personality.name}
                      </h3>
                      <SafeIcon 
                        icon={getPersonalityIcon(id)} 
                        className="h-5 w-5 text-purple-600" 
                      />
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {personality.communicationStyle}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {personality.traits.slice(0, 3).map((trait, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedPersonality === id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-purple-200"
                  >
                    <div className="text-sm text-gray-700">
                      <p className="mb-2">
                        <strong>Interests:</strong> {personality.interests.join(', ')}
                      </p>
                      <p>
                        <strong>Response Style:</strong> {personality.responseStyle}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Start Button */}
      {selectedScenario && selectedPersonality && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={handleStartSession}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-lg shadow-lg hover:shadow-xl"
          >
            <SafeIcon icon={FiPlay} className="h-5 w-5 mr-2" />
            Start Conversation
          </button>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <SafeIcon icon={FiAlertCircle} className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h4 className="font-medium text-blue-900">Ready to Practice?</h4>
                <p className="text-sm text-blue-700 mt-1">
                  You'll chat with <strong>{personalities[selectedPersonality].name}</strong> in the 
                  "<strong>{scenarios[selectedScenario].name}</strong>" scenario. 
                  Get real-time feedback on your messages and improve your conversation skills!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ScenarioSelector;