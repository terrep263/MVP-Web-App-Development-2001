import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageSquare, FiStar, FiThumbsUp, FiThumbsDown, FiFilter } = FiIcons;

const FeedbackSummary = ({ analytics, detailed = false }) => {
  const { userFeedback } = analytics;
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return FiThumbsUp;
      case 'negative': return FiThumbsDown;
      default: return FiMessageSquare;
    }
  };

  const filteredFeedback = userFeedback
    .filter(feedback => {
      if (filter === 'all') return true;
      return feedback.sentiment === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.user.localeCompare(b.user);
    });

  const averageRating = userFeedback.reduce((sum, f) => sum + f.rating, 0) / userFeedback.length;
  const sentimentCounts = {
    positive: userFeedback.filter(f => f.sentiment === 'positive').length,
    negative: userFeedback.filter(f => f.sentiment === 'negative').length,
    neutral: userFeedback.filter(f => f.sentiment === 'neutral').length
  };

  if (detailed) {
    return (
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <SafeIcon icon={FiStar} className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <SafeIcon 
                      key={i} 
                      icon={FiStar} 
                      className={`h-3 w-3 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <SafeIcon icon={FiThumbsUp} className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Positive</p>
                <p className="text-2xl font-bold text-green-600">{sentimentCounts.positive}</p>
                <p className="text-xs text-gray-500">
                  {Math.round((sentimentCounts.positive / userFeedback.length) * 100)}%
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <SafeIcon icon={FiThumbsDown} className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Negative</p>
                <p className="text-2xl font-bold text-red-600">{sentimentCounts.negative}</p>
                <p className="text-xs text-gray-500">
                  {Math.round((sentimentCounts.negative / userFeedback.length) * 100)}%
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SafeIcon icon={FiMessageSquare} className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold text-blue-600">{userFeedback.length}</p>
                <p className="text-xs text-green-600">+23% this month</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <SafeIcon icon={FiFilter} className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Feedback</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rating</option>
                <option value="user">User Name</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Feedback List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Feedback</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredFeedback.map((feedback) => (
              <div key={feedback.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-medium text-gray-900">{feedback.user}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <SafeIcon 
                            key={i} 
                            icon={FiStar} 
                            className={`h-4 w-4 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getSentimentColor(feedback.sentiment)}`}>
                        {feedback.sentiment}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{feedback.comment}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Feature: {feedback.feature}</span>
                      <span>Date: {format(new Date(feedback.date), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  <SafeIcon 
                    icon={getSentimentIcon(feedback.sentiment)} 
                    className={`h-5 w-5 ${
                      feedback.sentiment === 'positive' ? 'text-green-500' : 
                      feedback.sentiment === 'negative' ? 'text-red-500' : 'text-gray-500'
                    }`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">User Feedback</h3>
        <SafeIcon icon={FiMessageSquare} className="h-5 w-5 text-blue-600" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Average Rating</p>
          <div className="flex items-center space-x-2">
            <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <SafeIcon 
                  key={i} 
                  icon={FiStar} 
                  className={`h-4 w-4 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Feedback</p>
          <p className="text-2xl font-bold text-blue-600">{userFeedback.length}</p>
        </div>
      </div>

      {/* Recent feedback preview */}
      <div className="space-y-3">
        {userFeedback.slice(0, 3).map((feedback) => (
          <div key={feedback.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-900">{feedback.user}</span>
              <div className="flex items-center">
                {[...Array(feedback.rating)].map((_, i) => (
                  <SafeIcon key={i} icon={FiStar} className="h-3 w-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{feedback.comment}</p>
            <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getSentimentColor(feedback.sentiment)}`}>
              {feedback.sentiment}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeedbackSummary;