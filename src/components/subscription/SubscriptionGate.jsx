import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSubscription } from '../../contexts/SubscriptionContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiLock, FiStar, FiZap, FiCrown, FiX, FiCheck } = FiIcons;

const SubscriptionGate = ({ feature, children, fallback = null, showUpgrade = true, title, description }) => {
  const { canUseFeature, getRemainingUsage, currentPlan, plans, startTrial, createStripeSession, isTrialActive, trackUsage } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasAccess = canUseFeature(feature);
  const remainingUsage = getRemainingUsage(feature);

  // Move useEffect to top level - always call hooks in same order
  useEffect(() => {
    if (hasAccess && (feature === 'profileReview' || feature === 'simulator')) {
      trackUsage(feature === 'profileReview' ? 'profileReviews' : 'simulatorSessions');
    }
  }, [hasAccess, feature, trackUsage]);

  const handleUpgrade = async (planId) => {
    setIsLoading(true);
    try {
      if (planId === 'trial' && currentPlan?.id === 'freemium') {
        await startTrial();
        toast.success('7-day Premium trial started!');
        setShowUpgradeModal(false);
      } else {
        await createStripeSession(planId);
        toast.success('Redirecting to payment...');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to upgrade');
    } finally {
      setIsLoading(false);
    }
  };

  const getFeatureRequirements = () => {
    const requirements = {
      profileReview: {
        title: 'Profile Review',
        description: 'Get AI-powered feedback on your dating profile',
        freemium: '1 review',
        standard: 'Unlimited reviews',
        premium: 'Unlimited reviews + advanced insights'
      },
      simulator: {
        title: 'Conversation Simulator',
        description: 'Practice dating conversations with AI partners',
        freemium: 'Not available',
        standard: '10 sessions per month',
        premium: 'Unlimited sessions'
      },
      academyModule: {
        title: 'Academy Modules',
        description: 'Access comprehensive dating courses',
        freemium: 'Module 1 only',
        standard: 'All 5 modules',
        premium: 'All modules + bonus content'
      },
      messageAssistant: {
        title: 'Message Assistant',
        description: 'AI-powered message suggestions and optimization',
        freemium: 'Not available',
        standard: 'Not available',
        premium: 'Full access'
      }
    };

    return requirements[feature] || {
      title: title || 'Premium Feature',
      description: description || 'This feature requires a subscription',
      freemium: 'Limited access',
      standard: 'Full access',
      premium: 'Full access + extras'
    };
  };

  if (hasAccess) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  const featureInfo = getFeatureRequirements();

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <SafeIcon icon={FiLock} className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {featureInfo.title}
        </h3>
        <p className="text-gray-600 mb-6">
          {featureInfo.description}
        </p>

        {remainingUsage === 0 && currentPlan?.id !== 'freemium' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              You've reached your monthly limit. Upgrade to get unlimited access.
            </p>
          </div>
        )}

        {showUpgrade && (
          <div className="space-y-4">
            {/* Plan Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.values(plans).map((plan) => {
                const isCurrentPlan = currentPlan?.id === plan.id;
                const featureAccess = featureInfo[plan.id] || 'Available';

                return (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-lg border-2 ${
                      isCurrentPlan ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                      {plan.popular && (
                        <SafeIcon icon={FiStar} className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ${plan.price}
                      <span className="text-sm text-gray-600">/{plan.period}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{featureAccess}</p>
                    {!isCurrentPlan && (
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={isLoading}
                        className={`w-full mt-3 py-2 px-4 rounded-lg font-medium transition-all ${
                          plan.id === 'premium'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        } disabled:opacity-50`}
                      >
                        {isLoading ? 'Processing...' : `Upgrade to ${plan.name}`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Trial Offer */}
            {currentPlan?.id === 'freemium' && !isTrialActive() && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
                <div className="flex items-center space-x-3 mb-3">
                  <SafeIcon icon={FiZap} className="h-6 w-6" />
                  <h4 className="text-lg font-semibold">Try Premium Free for 7 Days!</h4>
                </div>
                <p className="text-purple-100 mb-4">
                  Get unlimited access to all features with our risk-free trial.
                </p>
                <button
                  onClick={() => handleUpgrade('trial')}
                  disabled={isLoading}
                  className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Starting Trial...' : 'Start Free Trial'}
                </button>
              </div>
            )}

            <button
              onClick={() => setShowUpgradeModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Compare all plans →
            </button>
          </div>
        )}
      </div>

      {/* Full Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Choose Your Plan</h3>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.values(plans).map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative rounded-lg border-2 p-6 ${
                      plan.popular ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-200'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="text-center">
                      <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                      <div className="mt-2">
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-600">/{plan.period}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
                    </div>

                    <ul className="mt-6 space-y-3">
                      {Object.entries(plan.features).map(([feature, value]) => (
                        <li key={feature} className="flex items-center text-sm">
                          <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 mr-2" />
                          <span className="capitalize">
                            {feature.replace(/([A-Z])/g, ' $1').trim()}:
                            {typeof value === 'boolean' ? (value ? 'Included' : 'Not included') : value}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {currentPlan?.id !== plan.id && (
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={isLoading}
                        className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-all ${
                          plan.id === 'premium'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                            : plan.id === 'standard'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        } disabled:opacity-50`}
                      >
                        {isLoading ? 'Processing...' : `Choose ${plan.name}`}
                      </button>
                    )}

                    {currentPlan?.id === plan.id && (
                      <div className="w-full mt-6 py-3 px-4 bg-green-100 text-green-800 rounded-lg text-center font-medium">
                        Current Plan
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Trial Offer */}
              {currentPlan?.id === 'freemium' && !isTrialActive() && (
                <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white text-center">
                  <SafeIcon icon={FiCrown} className="h-12 w-12 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">Try Premium Free for 7 Days!</h4>
                  <p className="text-purple-100 mb-4">
                    Experience all premium features with no commitment. Cancel anytime.
                  </p>
                  <button
                    onClick={() => handleUpgrade('trial')}
                    disabled={isLoading}
                    className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Starting Trial...' : 'Start Free Trial'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default SubscriptionGate;