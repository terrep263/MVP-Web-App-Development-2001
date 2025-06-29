import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTarget, FiCamera, FiMessageCircle, FiBookOpen, FiMail } = FiIcons;

const FeatureAdoptionChart = ({ analytics }) => {
  const { featureAdoption } = analytics;

  const adoptionData = [
    { 
      name: 'Profile Review', 
      users: featureAdoption.profileReview, 
      icon: FiCamera,
      color: '#3B82F6',
      percentage: Math.round((featureAdoption.profileReview / analytics.userMetrics.totalUsers) * 100)
    },
    { 
      name: 'Academy', 
      users: featureAdoption.academy, 
      icon: FiBookOpen,
      color: '#10B981',
      percentage: Math.round((featureAdoption.academy / analytics.userMetrics.totalUsers) * 100)
    },
    { 
      name: 'Simulator', 
      users: featureAdoption.conversationSimulator, 
      icon: FiMessageCircle,
      color: '#8B5CF6',
      percentage: Math.round((featureAdoption.conversationSimulator / analytics.userMetrics.totalUsers) * 100)
    },
    { 
      name: 'Message Assistant', 
      users: featureAdoption.messageAssistant, 
      icon: FiMail,
      color: '#F59E0B',
      percentage: Math.round((featureAdoption.messageAssistant / analytics.userMetrics.totalUsers) * 100)
    }
  ];

  const pieData = adoptionData.map(feature => ({
    name: feature.name,
    value: feature.users,
    color: feature.color
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Feature Adoption</h3>
        <SafeIcon icon={FiTarget} className="h-5 w-5 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Users by Feature</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={adoptionData}>
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
                formatter={(value, name) => [value.toLocaleString(), 'Users']}
              />
              <Bar dataKey="users" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Adoption Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Stats */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {adoptionData.map((feature) => (
          <div key={feature.name} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <SafeIcon icon={feature.icon} className="h-6 w-6" style={{ color: feature.color }} />
            </div>
            <p className="text-sm font-medium text-gray-900">{feature.name}</p>
            <p className="text-lg font-bold" style={{ color: feature.color }}>
              {feature.users.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">{feature.percentage}% adoption</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeatureAdoptionChart;