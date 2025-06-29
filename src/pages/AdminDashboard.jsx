import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useRole } from '../contexts/RoleContext';
import UserMetricsCard from '../components/admin/UserMetricsCard';
import ConversionAnalytics from '../components/admin/ConversionAnalytics';
import ChurnRiskAlert from '../components/admin/ChurnRiskAlert';
import FeedbackSummary from '../components/admin/FeedbackSummary';
import KPIVisualization from '../components/admin/KPIVisualization';
import FeatureAdoptionChart from '../components/admin/FeatureAdoptionChart';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiBarChart, 
  FiUsers, 
  FiTrendingUp, 
  FiAlertTriangle, 
  FiMessageSquare,
  FiRefreshCw,
  FiDownload,
  FiCalendar,
  FiDollarSign
} = FiIcons;

const AdminDashboard = () => {
  const { analytics, isLoading, refreshAnalytics } = useAnalytics();
  const { hasPermission } = useRole();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart },
    { id: 'users', label: 'User Analytics', icon: FiUsers },
    { id: 'conversion', label: 'Conversions', icon: FiTrendingUp },
    { id: 'churn', label: 'Churn Risk', icon: FiAlertTriangle },
    { id: 'feedback', label: 'Feedback', icon: FiMessageSquare },
    { id: 'kpis', label: 'KPIs', icon: FiDollarSign }
  ];

  if (!hasPermission('view_analytics')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiAlertTriangle} className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view analytics.</p>
        </div>
      </div>
    );
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analytics_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Analytics</h2>
          <p className="text-gray-600">Fetching the latest data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Real-time analytics and insights for Spark Coach
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={refreshAnalytics}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SafeIcon icon={FiRefreshCw} className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleExportData}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SafeIcon icon={FiUsers} className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Daily Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.userMetrics.dau.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +12% from yesterday
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <SafeIcon icon={FiTrendingUp} className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.conversionMetrics.trialConversion}%
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +3.2% this month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <SafeIcon icon={FiDollarSign} className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(analytics.kpiData.revenue.reduce((sum, day) => sum + day.daily, 0) || 0).toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +18% vs last month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <SafeIcon icon={FiAlertTriangle} className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Churn Risk</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.churnRisk.length}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  High risk users
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <UserMetricsCard analytics={analytics} />
                <FeatureAdoptionChart analytics={analytics} />
                <ConversionAnalytics analytics={analytics} />
                <FeedbackSummary analytics={analytics} />
              </div>
            )}

            {activeTab === 'users' && (
              <UserMetricsCard analytics={analytics} detailed />
            )}

            {activeTab === 'conversion' && (
              <ConversionAnalytics analytics={analytics} detailed />
            )}

            {activeTab === 'churn' && (
              <ChurnRiskAlert analytics={analytics} />
            )}

            {activeTab === 'feedback' && (
              <FeedbackSummary analytics={analytics} detailed />
            )}

            {activeTab === 'kpis' && (
              <KPIVisualization analytics={analytics} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;