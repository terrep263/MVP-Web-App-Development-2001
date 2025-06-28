import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useCoach } from '../contexts/CoachContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiUser, FiSettings, FiCreditCard, FiAward, FiCalendar, FiMail, FiHeart } = FiIcons;

const ProfilePage = () => {
  const { user, updateSubscription } = useAuth();
  const { achievements } = useCoach();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'subscription', label: 'Subscription', icon: FiCreditCard },
    { id: 'achievements', label: 'Achievements', icon: FiAward }
  ];

  const subscriptionPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic profile review',
        '5 conversation starters',
        'Basic progress tracking',
        'Limited practice scenarios'
      ],
      current: user.subscription === 'free'
    },
    {
      name: 'Premium',
      price: '$19',
      period: 'month',
      features: [
        'Unlimited profile reviews',
        'Personalized conversation templates',
        'Advanced analytics',
        'Unlimited practice scenarios',
        'Priority support',
        'Weekly coaching calls'
      ],
      current: user.subscription === 'premium',
      popular: true
    },
    {
      name: 'Pro',
      price: '$39',
      period: 'month',
      features: [
        'Everything in Premium',
        '1-on-1 coaching sessions',
        'Custom dating strategy',
        'Photo optimization service',
        'Success guarantee',
        '24/7 support'
      ],
      current: user.subscription === 'pro'
    }
  ];

  const handleSubscriptionChange = (plan) => {
    updateSubscription(plan);
    toast.success(`Subscription updated to ${plan}!`);
  };

  const getPersonaDescription = () => {
    const persona = user.onboardingData?.persona;
    switch (persona) {
      case 'hesitant-professional':
        return 'Hesitant Professional - Building confidence while balancing career success';
      case 'app-fatigued':
        return 'App-Fatigued Swiper - Optimizing strategy for better quality connections';
      case 'recently-single':
        return 'Recently Single - Creating an authentic new dating identity';
      default:
        return 'Dating Enthusiast - Improving overall dating skills';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-pink-200"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
            <p className="text-gray-600">{getPersonaDescription()}</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-600'
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user.name}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <SafeIcon icon={FiMail} className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <SafeIcon icon={FiCalendar} className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">
                        {new Date(user.joinedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dating Goals
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <SafeIcon icon={FiHeart} className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900 capitalize">
                        {user.onboardingData?.goals?.replace('-', ' ') || 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'subscription' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Subscription Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative rounded-lg border-2 p-6 ${
                      plan.current
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 bg-white'
                    } ${plan.popular ? 'ring-2 ring-pink-500' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-pink-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-600">/{plan.period}</span>
                      </div>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      {plan.current ? (
                        <button className="w-full py-2 px-4 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
                          Current Plan
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSubscriptionChange(plan.name.toLowerCase())}
                          className="w-full py-2 px-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all"
                        >
                          Upgrade to {plan.name}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Achievements</h3>
              {achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                        <SafeIcon icon={FiAward} className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <SafeIcon icon={FiAward} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h4>
                  <p className="text-gray-600">
                    Complete tasks and reach milestones to unlock achievements!
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;