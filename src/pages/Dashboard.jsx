import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useCoach } from '../contexts/CoachContext';
import StatsCards from '../components/dashboard/StatsCards';
import TaskList from '../components/dashboard/TaskList';
import QuickActions from '../components/dashboard/QuickActions';
import ProgressChart from '../components/dashboard/ProgressChart';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiCheckSquare, FiTarget } = FiIcons;

const Dashboard = () => {
  const { user } = useAuth();
  const { progress, tasks } = useCoach();

  const getPersonaGreeting = () => {
    const persona = user.onboardingData?.persona;
    switch (persona) {
      case 'hesitant-professional':
        return {
          title: `Welcome back, ${user.name}!`,
          subtitle: "Let's build your dating confidence step by step"
        };
      case 'app-fatigued':
        return {
          title: `Ready for a fresh approach, ${user.name}?`,
          subtitle: "Let's optimize your dating strategy for better results"
        };
      case 'recently-single':
        return {
          title: `Your fresh start begins now, ${user.name}!`,
          subtitle: "Let's create your new authentic dating identity"
        };
      default:
        return {
          title: `Welcome back, ${user.name}!`,
          subtitle: "Let's continue your dating transformation"
        };
    }
  };

  const greeting = getPersonaGreeting();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {greeting.title}
            </h1>
            <p className="text-gray-600">
              {greeting.subtitle}
            </p>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Progress & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
                <SafeIcon icon={FiTrendingUp} className="h-5 w-5 text-pink-600" />
              </div>
              <ProgressChart />
            </motion.div>

            {/* Quick Actions */}
            <QuickActions />
          </div>

          {/* Right Column - Tasks & Activities */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheckSquare} className="h-5 w-5 text-pink-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Your Coaching Tasks ({tasks.filter(t => t.status === 'pending').length} pending)
                    </h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <TaskList />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;