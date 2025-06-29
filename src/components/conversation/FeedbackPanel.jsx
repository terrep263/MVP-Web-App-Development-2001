import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheckCircle, FiAlertTriangle, FiInfo, FiTrendingUp, FiMessageCircle, FiHeart } = FiIcons;

const FeedbackPanel = ({ message, sessionMetrics }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Live Feedback</h3>
        <p className="text-sm text-gray-600">Real-time analysis of your messages</p>
      </div>

      {/* Session Metrics */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Session Overview</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiHeart} className="h-4 w-4 text-pink-500" />
              <span className="text-sm text-gray-600">Tone</span>
            </div>
            <span className={`text-sm font-medium ${getScoreColor(sessionMetrics?.toneScore || 0)}`}>
              {sessionMetrics?.toneScore || 0}%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMessageCircle} className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Clarity</span>
            </div>
            <span className={`text-sm font-medium ${getScoreColor(sessionMetrics?.clarityScore || 0)}`}>
              {sessionMetrics?.clarityScore || 0}%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiTrendingUp} className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">Engagement</span>
            </div>
            <span className={`text-sm font-medium ${getScoreColor(sessionMetrics?.engagementScore || 0)}`}>
              {sessionMetrics?.engagementScore || 0}%
            </span>
          </div>
          
          <div className="text-center pt-2 border-t">
            <span className="text-xs text-gray-500">Messages Sent</span>
            <div className="text-lg font-bold text-gray-900">
              {sessionMetrics?.messagesCount || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Latest Message Feedback */}
      <div className="flex-1 overflow-y-auto p-4">
        {message && message.feedback ? (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Latest Message Analysis</h4>
            
            {/* Score Breakdown */}
            <div className="space-y-2">
              {Object.entries(message.feedback.metrics).map(([metric, score]) => (
                <div key={metric} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {metric.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-16 h-2 rounded-full ${getScoreBg(score)}`}>
                      <div
                        className={`h-2 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${getScoreColor(score)}`}>
                      {Math.round(score)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Feedback */}
            <div className="space-y-3">
              {message.feedback.feedback.map((feedback, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${
                    feedback.type === 'success'
                      ? 'bg-green-50 border-green-200'
                      : feedback.type === 'warning'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <SafeIcon
                      icon={
                        feedback.type === 'success'
                          ? FiCheckCircle
                          : feedback.type === 'warning'
                          ? FiAlertTriangle
                          : FiInfo
                      }
                      className={`h-4 w-4 mt-0.5 ${
                        feedback.type === 'success'
                          ? 'text-green-600'
                          : feedback.type === 'warning'
                          ? 'text-red-600'
                          : 'text-blue-600'
                      }`}
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        feedback.type === 'success'
                          ? 'text-green-800'
                          : feedback.type === 'warning'
                          ? 'text-red-800'
                          : 'text-blue-800'
                      }`}>
                        {feedback.message}
                      </p>
                      <p className={`text-xs mt-1 ${
                        feedback.type === 'success'
                          ? 'text-green-700'
                          : feedback.type === 'warning'
                          ? 'text-red-700'
                          : 'text-blue-700'
                      }`}>
                        {feedback.suggestion}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiMessageCircle} className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">
              Send a message to get real-time feedback and tips!
            </p>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <h5 className="font-medium text-gray-900 text-sm mb-2">Quick Tips</h5>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Ask open-ended questions</li>
          <li>• Share personal experiences</li>
          <li>• Keep a positive tone</li>
          <li>• Show genuine interest</li>
        </ul>
      </div>
    </div>
  );
};

export default FeedbackPanel;