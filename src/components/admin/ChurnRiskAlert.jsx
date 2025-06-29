import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiAlertTriangle, FiMail, FiPhone, FiUser, FiCalendar, FiTrendingDown } = FiIcons;

const ChurnRiskAlert = ({ analytics }) => {
  const { churnRisk } = analytics;
  const [selectedUsers, setSelectedUsers] = useState([]);

  const getRiskColor = (score) => {
    if (score >= 80) return 'bg-red-100 text-red-800 border-red-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getRiskIcon = (score) => {
    if (score >= 80) return FiAlertTriangle;
    if (score >= 60) return FiTrendingDown;
    return FiUser;
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }

    switch (action) {
      case 'email':
        toast.success(`Retention email sent to ${selectedUsers.length} users`);
        break;
      case 'call':
        toast.success(`Call scheduled for ${selectedUsers.length} users`);
        break;
      case 'discount':
        toast.success(`Discount offer sent to ${selectedUsers.length} users`);
        break;
    }
    setSelectedUsers([]);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <SafeIcon icon={FiAlertTriangle} className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Risk Users</p>
              <p className="text-2xl font-bold text-red-600">
                {churnRisk.filter(u => u.riskScore >= 80).length}
              </p>
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
            <div className="p-2 bg-yellow-100 rounded-lg">
              <SafeIcon icon={FiTrendingDown} className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Medium Risk Users</p>
              <p className="text-2xl font-bold text-yellow-600">
                {churnRisk.filter(u => u.riskScore >= 60 && u.riskScore < 80).length}
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
            <div className="p-2 bg-green-100 rounded-lg">
              <SafeIcon icon={FiUser} className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Risk Score</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(churnRisk.reduce((sum, u) => sum + u.riskScore, 0) / churnRisk.length)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('email')}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                <SafeIcon icon={FiMail} className="h-4 w-4" />
                <span>Send Email</span>
              </button>
              <button
                onClick={() => handleBulkAction('call')}
                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                <SafeIcon icon={FiPhone} className="h-4 w-4" />
                <span>Schedule Call</span>
              </button>
              <button
                onClick={() => handleBulkAction('discount')}
                className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
              >
                <span>💰</span>
                <span>Offer Discount</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Churn Risk Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Users at Risk of Churning</h3>
          <p className="text-gray-600 mt-1">
            Proactively engage with these users to improve retention
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(churnRisk.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Factors</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {churnRisk.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelect(user.id)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <SafeIcon icon={getRiskIcon(user.riskScore)} className="h-4 w-4 mr-2" />
                      <span className={`px-2 py-1 text-xs rounded-full border ${getRiskColor(user.riskScore)}`}>
                        {user.riskScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.subscription === 'premium' ? 'bg-purple-100 text-purple-800' :
                      user.subscription === 'standard' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.subscription}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <SafeIcon icon={FiCalendar} className="h-4 w-4 mr-1" />
                      {format(new Date(user.lastActive), 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.reasons.map((reason, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded border border-red-200"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBulkAction('email')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Send retention email"
                      >
                        <SafeIcon icon={FiMail} className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleBulkAction('call')}
                        className="text-green-600 hover:text-green-900"
                        title="Schedule call"
                      >
                        <SafeIcon icon={FiPhone} className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Retention Strategies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Retention Strategies</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">📧 Email Campaign</h4>
            <p className="text-sm text-blue-700">
              Send personalized retention emails with usage tips and success stories
            </p>
            <button className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
              Launch Campaign
            </button>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">💰 Special Offers</h4>
            <p className="text-sm text-green-700">
              Provide limited-time discounts or feature upgrades to re-engage users
            </p>
            <button className="mt-2 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors">
              Create Offers
            </button>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">🎯 Personal Outreach</h4>
            <p className="text-sm text-purple-700">
              Schedule one-on-one calls with high-value customers to understand concerns
            </p>
            <button className="mt-2 text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors">
              Schedule Calls
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChurnRiskAlert;