import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiClock, FiActivity, FiTrendingUp } = FiIcons;

const UserMetricsCard = ({ analytics, detailed = false }) => {
  const { userMetrics, sessionMetrics, kpiData } = analytics;

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (detailed) {
    return (
      <div className="space-y-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={kpiData.sessionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [value, name === 'sessions' ? 'Sessions' : 'Avg Length (min)']}
              />
              <Line 
                type="monotone" 
                dataKey="sessions" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Session Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Analytics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kpiData.sessionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [
                  name === 'avgLength' ? `${value} min` : value,
                  name === 'avgLength' ? 'Avg Session Length' : 'Total Sessions'
                ]}
              />
              <Bar dataKey="sessions" fill="#3B82F6" />
              <Bar dataKey="avgLength" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SafeIcon icon={FiUsers} className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{userMetrics.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+{userMetrics.newUsers} this month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <SafeIcon icon={FiActivity} className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Active</p>
                <p className="text-2xl font-bold text-gray-900">{userMetrics.mau.toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-1">{Math.round((userMetrics.mau / userMetrics.totalUsers) * 100)}% of total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <SafeIcon icon={FiClock} className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Session</p>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(sessionMetrics.averageSessionLength)}</p>
                <p className="text-xs text-green-600 mt-1">+2.3 min vs last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <SafeIcon icon={FiTrendingUp} className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(sessionMetrics.bounceRate * 100)}%</p>
                <p className="text-xs text-red-600 mt-1">-5% improvement</p>
              </div>
            </div>
          </div>
        </div>
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
        <h3 className="text-lg font-semibold text-gray-900">User Metrics</h3>
        <SafeIcon icon={FiUsers} className="h-5 w-5 text-blue-600" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Daily Active Users</p>
          <p className="text-2xl font-bold text-blue-600">{userMetrics.dau.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Monthly Active Users</p>
          <p className="text-2xl font-bold text-green-600">{userMetrics.mau.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Avg Session Length</p>
          <p className="text-2xl font-bold text-purple-600">{formatDuration(sessionMetrics.averageSessionLength)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Sessions</p>
          <p className="text-2xl font-bold text-orange-600">{sessionMetrics.totalSessions.toLocaleString()}</p>
        </div>
      </div>

      {/* Mini chart */}
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={kpiData.sessionData.slice(-7)}>
            <Line 
              type="monotone" 
              dataKey="sessions" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={false}
            />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value) => [value, 'Sessions']}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default UserMetricsCard;