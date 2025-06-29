import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiTarget, FiDollarSign, FiUsers } = FiIcons;

const ConversionAnalytics = ({ analytics, detailed = false }) => {
  const { conversionMetrics } = analytics;

  const conversionData = [
    { name: 'Freemium → Standard', rate: conversionMetrics.freemiumToStandard, color: '#3B82F6' },
    { name: 'Freemium → Premium', rate: conversionMetrics.freemiumToPremium, color: '#8B5CF6' },
    { name: 'Standard → Premium', rate: conversionMetrics.standardToPremium, color: '#10B981' },
    { name: 'Trial → Paid', rate: conversionMetrics.trialConversion, color: '#F59E0B' }
  ];

  const funnelData = [
    { stage: 'Visitors', count: 15420, conversion: 100 },
    { stage: 'Signups', count: 2847, conversion: 18.5 },
    { stage: 'Active Users', count: 1923, conversion: 67.5 },
    { stage: 'Trial Started', count: 487, conversion: 25.3 },
    { stage: 'Paid Conversion', count: 328, conversion: 67.3 }
  ];

  if (detailed) {
    return (
      <div className="space-y-6">
        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h3>
          <div className="space-y-4">
            {funnelData.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">{stage.count.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 ml-2">({stage.conversion}%)</span>
                  </div>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' :
                      index === 3 ? 'bg-orange-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${stage.conversion}%` }}
                  />
                </div>
                {index < funnelData.length - 1 && (
                  <div className="absolute right-0 top-8 text-xs text-gray-500">
                    ↓ {Math.round((funnelData[index + 1].conversion / stage.conversion) * 100)}% convert
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Conversion Rates Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rates by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Conversion Rate']}
              />
              <Bar dataKey="rate" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {conversionData.map((conversion, index) => (
            <div key={conversion.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${
                  index === 0 ? 'bg-blue-100' :
                  index === 1 ? 'bg-purple-100' :
                  index === 2 ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <SafeIcon icon={FiTrendingUp} className={`h-6 w-6 ${
                    index === 0 ? 'text-blue-600' :
                    index === 1 ? 'text-purple-600' :
                    index === 2 ? 'text-green-600' : 'text-yellow-600'
                  }`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{conversion.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{conversion.rate}%</p>
                  <p className="text-xs text-green-600 mt-1">
                    +{(Math.random() * 3 + 1).toFixed(1)}% vs last month
                  </p>
                </div>
              </div>
            </div>
          ))}
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
        <h3 className="text-lg font-semibold text-gray-900">Conversion Rates</h3>
        <SafeIcon icon={FiTarget} className="h-5 w-5 text-green-600" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Trial → Paid</p>
          <p className="text-2xl font-bold text-green-600">{conversionMetrics.trialConversion}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Freemium → Premium</p>
          <p className="text-2xl font-bold text-purple-600">{conversionMetrics.freemiumToPremium}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Freemium → Standard</p>
          <p className="text-2xl font-bold text-blue-600">{conversionMetrics.freemiumToStandard}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Standard → Premium</p>
          <p className="text-2xl font-bold text-orange-600">{conversionMetrics.standardToPremium}%</p>
        </div>
      </div>

      {/* Mini pie chart */}
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={conversionData}
              cx="50%"
              cy="50%"
              outerRadius={50}
              dataKey="rate"
            >
              {conversionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ConversionAnalytics;