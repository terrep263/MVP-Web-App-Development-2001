import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiClock, FiMessageCircle, FiTarget, FiCheckCircle, FiAlertTriangle, FiInfo, FiArrowRight } = FiIcons;

const SessionSummary = ({ summary }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const CircularProgress = ({ score, size = 120, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <SafeIcon icon={FiTrendingUp} className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Complete!</h1>
        <p className="text-gray-600">
          You practiced <strong>{summary.scenario}</strong> with <strong>{summary.personality}</strong>
        </p>
      </motion.div>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Overall Performance</h2>
        <div className="flex justify-center mb-6">
          <CircularProgress score={summary.averageScores.overall} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(summary.averageScores.tone)}`}>
              {summary.averageScores.tone}%
            </div>
            <div className="text-sm text-gray-600">Tone</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(summary.averageScores.clarity)}`}>
              {summary.averageScores.clarity}%
            </div>
            <div className="text-sm text-gray-600">Clarity</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(summary.averageScores.engagement)}`}>
              {summary.averageScores.engagement}%
            </div>
            <div className="text-sm text-gray-600">Engagement</div>
          </div>
        </div>
      </motion.div>

      {/* Session Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <SafeIcon icon={FiClock} className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{summary.duration}</div>
          <div className="text-sm text-gray-600">Minutes</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <SafeIcon icon={FiMessageCircle} className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{summary.messageCount}</div>
          <div className="text-sm text-gray-600">Messages</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <SafeIcon icon={FiCheckCircle} className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{summary.feedbackCounts.successes}</div>
          <div className="text-sm text-gray-600">Successes</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <SafeIcon icon={FiTarget} className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{summary.feedbackCounts.tips}</div>
          <div className="text-sm text-gray-600">Tips Given</div>
        </div>
      </motion.div>

      {/* Strengths and Improvements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Strengths */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <SafeIcon icon={FiCheckCircle} className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Your Strengths</h3>
          </div>
          {summary.strengths.length > 0 ? (
            <ul className="space-y-2">
              {summary.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Keep practicing to develop your strengths!</p>
          )}
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <SafeIcon icon={FiTrendingUp} className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Areas to Improve</h3>
          </div>
          {summary.improvements.length > 0 ? (
            <ul className="space-y-2">
              {summary.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Great job! No major areas for improvement identified.</p>
          )}
        </div>
      </motion.div>

      {/* Recommended Next Steps */}
      {summary.recommendedScenarios && summary.recommendedScenarios.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Practice Scenarios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summary.recommendedScenarios.map((scenario, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <SafeIcon icon={FiArrowRight} className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{scenario.name}</p>
                  <p className="text-sm text-gray-600">{scenario.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex justify-center space-x-4"
      >
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Practice Again
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Save Report
        </button>
      </motion.div>
    </div>
  );
};

export default SessionSummary;