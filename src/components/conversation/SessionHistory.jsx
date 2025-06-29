import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiMessageCircle, FiTrendingUp, FiEye, FiTrash2, FiFilter, FiCalendar } = FiIcons;

const SessionHistory = ({ sessions }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredSessions = sessions
    .filter(session => {
      if (filter === 'all') return true;
      if (filter === 'high') return session.averageScores?.overall >= 80;
      if (filter === 'medium') return session.averageScores?.overall >= 60 && session.averageScores?.overall < 80;
      if (filter === 'low') return session.averageScores?.overall < 60;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.endTime) - new Date(a.endTime);
      if (sortBy === 'oldest') return new Date(a.endTime) - new Date(b.endTime);
      if (sortBy === 'score') return (b.averageScores?.overall || 0) - (a.averageScores?.overall || 0);
      return 0;
    });

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <SafeIcon icon={FiClock} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Practice History</h3>
        <p className="text-gray-600">
          Your conversation practice sessions will appear here once you start practicing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <SafeIcon icon={FiFilter} className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sessions</option>
              <option value="high">High Score (80+)</option>
              <option value="medium">Medium Score (60-79)</option>
              <option value="low">Low Score (&lt;60)</option>
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
              <option value="oldest">Oldest First</option>
              <option value="score">Highest Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Session Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session, index) => (
          <motion.div
            key={session.sessionId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {session.scenario}
                </h3>
                {session.averageScores?.overall && (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(session.averageScores.overall)}`}>
                    {session.averageScores.overall}%
                  </span>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <SafeIcon icon={FiCalendar} className="h-3 w-3 mr-1" />
                {format(new Date(session.endTime), 'MMM dd, yyyy')}
              </div>
            </div>

            {/* Personality & Stats */}
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">AI</span>
                </div>
                <span className="text-sm text-gray-600">{session.personality}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs mb-4">
                <div>
                  <SafeIcon icon={FiClock} className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                  <div className="font-medium text-gray-900">{session.duration}m</div>
                  <div className="text-gray-500">Duration</div>
                </div>
                <div>
                  <SafeIcon icon={FiMessageCircle} className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                  <div className="font-medium text-gray-900">{session.messageCount}</div>
                  <div className="text-gray-500">Messages</div>
                </div>
                <div>
                  <SafeIcon icon={FiTrendingUp} className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                  <div className="font-medium text-gray-900">{session.feedbackCounts?.successes || 0}</div>
                  <div className="text-gray-500">Successes</div>
                </div>
              </div>

              {/* Score Breakdown */}
              {session.averageScores && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Tone</span>
                    <span className={`text-xs font-medium ${session.averageScores.tone >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {session.averageScores.tone}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Engagement</span>
                    <span className={`text-xs font-medium ${session.averageScores.engagement >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {session.averageScores.engagement}%
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors">
                  <SafeIcon icon={FiEye} className="h-3 w-3 mr-1" />
                  View Details
                </button>
                <button className="px-3 py-2 text-red-600 border border-red-600 text-xs rounded-md hover:bg-red-50 transition-colors">
                  <SafeIcon icon={FiTrash2} className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      {sessions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sessions.length}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(sessions.reduce((sum, s) => sum + (s.averageScores?.overall || 0), 0) / sessions.length) || 0}%
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {sessions.reduce((sum, s) => sum + s.messageCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length) || 0}m
              </div>
              <div className="text-sm text-gray-600">Avg Duration</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionHistory;