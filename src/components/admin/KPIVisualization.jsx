import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiHeart, FiDollarSign, FiTrendingUp } = FiIcons;

const KPIVisualization = ({ analytics }) => {
  const { kpiData } = analytics;
  const [activeChart, setActiveChart] = useState('dates');

  const chartTypes = [
    { id: 'dates', label: 'Dates per Month', icon: FiCalendar },
    { id: 'confidence', label: 'Confidence Scores', icon: FiHeart },
    { id: 'revenue', label: 'Revenue Growth', icon: FiDollarSign }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateGrowth = (data, key) => {
    if (data.length < 2) return 0;
    const latest = data[data.length - 1][key];
    const previous = data[data.length - 2][key];
    return ((latest - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Dates</p>
              <p className="text-3xl font-bold text-blue-600">
                {kpiData.datesPerMonth.reduce((sum, day) => sum + day.count, 0).toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{calculateGrowth(kpiData.datesPerMonth, 'count')}% vs last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <SafeIcon icon={FiCalendar} className="h-8 w-8 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p className="text-3xl font-bold text-pink-600">
                {Math.round(kpiData.confidenceScores.reduce((sum, day) => sum + day.avgScore, 0) / kpiData.confidenceScores.length)}%
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{calculateGrowth(kpiData.confidenceScores, 'avgScore')}% improvement
              </p>
            </div>
            <div className="p-3 bg-pink-100 rounded-full">
              <SafeIcon icon={FiHeart} className="h-8 w-8 text-pink-600" />
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
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(kpiData.revenue[kpiData.revenue.length - 1]?.cumulative || 0)}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{calculateGrowth(kpiData.revenue, 'daily')}% daily growth
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <SafeIcon icon={FiDollarSign} className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-4 mb-6">
          {chartTypes.map((chart) => (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeChart === chart.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SafeIcon icon={chart.icon} className="h-4 w-4" />
              <span className="text-sm font-medium">{chart.label}</span>
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="h-80">
          {activeChart === 'dates' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiData.datesPerMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={formatDate}
                  formatter={(value, name) => [
                    value,
                    name === 'count' ? 'Total Dates' : 'Successful Dates'
                  ]}
                />
                <Bar dataKey="count" fill="#3B82F6" name="count" />
                <Bar dataKey="successful" fill="#10B981" name="successful" />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChart === 'confidence' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpiData.confidenceScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={formatDate}
                  formatter={(value, name) => [
                    name === 'avgScore' ? `${value}%` : value,
                    name === 'avgScore' ? 'Average Score' : 'Users Tracked'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="avgScore" 
                  stroke="#EC4899" 
                  fill="#EC4899" 
                  fillOpacity={0.3}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeChart === 'revenue' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kpiData.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip 
                  labelFormatter={formatDate}
                  formatter={(value, name) => [
                    formatCurrency(value),
                    name === 'daily' ? 'Daily Revenue' : 'Cumulative Revenue'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="daily" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="daily"
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="cumulative"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* Detailed Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Success Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dating Success Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-semibold text-green-600">
                {Math.round((kpiData.datesPerMonth.reduce((sum, day) => sum + day.successful, 0) / 
                  kpiData.datesPerMonth.reduce((sum, day) => sum + day.count, 0)) * 100)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Dates per User</span>
              <span className="font-semibold text-blue-600">
                {(kpiData.datesPerMonth.reduce((sum, day) => sum + day.count, 0) / analytics.userMetrics.activeUsers).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User Confidence Growth</span>
              <span className="font-semibold text-purple-600">
                +{calculateGrowth(kpiData.confidenceScores, 'avgScore')}%
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Daily Average</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(kpiData.revenue.reduce((sum, day) => sum + day.daily, 0) / kpiData.revenue.length)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Growth Rate</span>
              <span className="font-semibold text-blue-600">
                +{calculateGrowth(kpiData.revenue, 'daily')}% daily
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Target</span>
              <span className="font-semibold text-purple-600">
                {formatCurrency(200000)} (85% achieved)
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default KPIVisualization;