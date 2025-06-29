import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '../contexts/SubscriptionContext';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { 
  FiCreditCard, 
  FiCalendar, 
  FiDownload, 
  FiAlertCircle, 
  FiCheck, 
  FiX,
  FiTrendingUp,
  FiDollarSign,
  FiClock,
  FiSettings
} = FiIcons;

const BillingPage = () => {
  const {
    subscription,
    billingHistory,
    currentPlan,
    plans,
    isLoading,
    cancelSubscription,
    reactivateSubscription,
    upgradeSubscription,
    downgradeSubscription,
    createStripeSession,
    isTrialActive,
    getTrialDaysLeft
  } = useSubscription();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription();
      toast.success('Subscription canceled successfully');
      setShowCancelModal(false);
    } catch (error) {
      toast.error('Failed to cancel subscription');
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivateSubscription();
      toast.success('Subscription reactivated!');
    } catch (error) {
      toast.error('Failed to reactivate subscription');
    }
  };

  const handlePlanChange = async (planId) => {
    try {
      const newPlan = plans[planId];
      const isUpgrade = newPlan.price > currentPlan.price;
      
      if (isUpgrade) {
        await upgradeSubscription(planId);
        toast.success('Redirecting to payment...');
      } else {
        await downgradeSubscription(planId);
        toast.success('Downgrade scheduled for next billing cycle');
      }
      setShowUpgradeModal(false);
    } catch (error) {
      toast.error(error.message || 'Failed to change plan');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'trialing': return 'text-blue-600 bg-blue-100';
      case 'canceling': return 'text-yellow-600 bg-yellow-100';
      case 'canceled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const PlanCard = ({ plan, isCurrent, isRecommended }) => (
    <div className={`relative rounded-lg border-2 p-6 ${
      isCurrent 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    } ${isRecommended ? 'ring-2 ring-green-500' : ''}`}>
      
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-500 text-white px-3 py-1 text-sm font-medium rounded-full">
            Recommended
          </span>
        </div>
      )}
      
      {isCurrent && (
        <div className="absolute -top-3 right-4">
          <span className="bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-full">
            Current Plan
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <div className="mt-2">
          <span className="text-4xl font-bold text-gray-900">
            ${plan.price}
          </span>
          <span className="text-gray-600">/{plan.period}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
      </div>

      <ul className="mt-6 space-y-3">
        {Object.entries(plan.features).map(([feature, value]) => (
          <li key={feature} className="flex items-center text-sm">
            <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 mr-2" />
            <span className="capitalize">
              {feature.replace(/([A-Z])/g, ' $1').trim()}: {
                typeof value === 'boolean' 
                  ? (value ? 'Included' : 'Not included')
                  : value
              }
            </span>
          </li>
        ))}
      </ul>

      {!isCurrent && (
        <button
          onClick={() => {
            setSelectedPlan(plan.id);
            setShowUpgradeModal(true);
          }}
          disabled={isLoading}
          className="w-full mt-6 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
        >
          {plan.price > currentPlan?.price ? 'Upgrade' : 'Downgrade'}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
          <p className="text-gray-600">Manage your subscription and billing preferences</p>
        </motion.div>

        {/* Current Subscription Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Current Subscription</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription?.status)}`}>
              {subscription?.status || 'Unknown'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiCreditCard} className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Plan</p>
                <p className="font-semibold text-gray-900">{currentPlan?.name || 'Freemium'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiDollarSign} className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Cost</p>
                <p className="font-semibold text-gray-900">${currentPlan?.price || 0}/month</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiCalendar} className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {isTrialActive() ? 'Trial Ends' : 'Next Billing'}
                </p>
                <p className="font-semibold text-gray-900">
                  {subscription?.endDate 
                    ? format(new Date(subscription.endDate), 'MMM dd, yyyy')
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Trial Warning */}
          {isTrialActive() && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiClock} className="h-5 w-5 text-blue-600" />
                <p className="text-blue-800 font-medium">
                  Trial ends in {getTrialDaysLeft()} days
                </p>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                Upgrade now to continue enjoying premium features without interruption.
              </p>
            </div>
          )}

          {/* Cancellation Warning */}
          {subscription?.cancelAtPeriodEnd && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiAlertCircle} className="h-5 w-5 text-yellow-600" />
                  <p className="text-yellow-800 font-medium">
                    Subscription will cancel on {format(new Date(subscription.endDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <button
                  onClick={handleReactivate}
                  disabled={isLoading}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                >
                  Reactivate
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-3">
            {currentPlan?.id !== 'freemium' && !subscription?.cancelAtPeriodEnd && (
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={isLoading}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel Subscription
              </button>
            )}
            <button
              onClick={() => setShowUpgradeModal(true)}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Change Plan
            </button>
          </div>
        </motion.div>

        {/* Available Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(plans).map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrent={currentPlan?.id === plan.id}
                isRecommended={plan.popular}
              />
            ))}
          </div>
        </motion.div>

        {/* Billing History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
          </div>
          
          <div className="overflow-x-auto">
            {billingHistory.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {billingHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(item.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status === 'paid' ? 'bg-green-100 text-green-800' : 
                          item.status === 'failed' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                          <SafeIcon icon={FiDownload} className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <SafeIcon icon={FiCreditCard} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No billing history</h3>
                <p className="text-gray-500">Your billing history will appear here once you make a purchase.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Cancel Subscription Modal */}
        <AnimatePresence>
          {showCancelModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiAlertCircle} className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to cancel your subscription? You'll lose access to premium features 
                  at the end of your current billing period.
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Keep Subscription
                  </button>
                  <button
                    onClick={handleCancelSubscription}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Canceling...' : 'Cancel'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Plan Change Modal */}
        <AnimatePresence>
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
                    <h3 className="text-xl font-semibold text-gray-900">Change Plan</h3>
                    <button
                      onClick={() => setShowUpgradeModal(false)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <SafeIcon icon={FiX} className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.values(plans).map((plan) => (
                      <div
                        key={plan.id}
                        className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                          selectedPlan === plan.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {currentPlan?.id === plan.id && (
                          <div className="absolute -top-2 -right-2">
                            <span className="bg-green-500 text-white px-2 py-1 text-xs rounded-full">
                              Current
                            </span>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                          <div className="text-2xl font-bold text-gray-900 mt-2">
                            ${plan.price}
                            <span className="text-sm text-gray-600">/{plan.period}</span>
                          </div>
                        </div>
                        
                        <ul className="mt-4 space-y-2">
                          {Object.entries(plan.features).slice(0, 3).map(([feature, value]) => (
                            <li key={feature} className="flex items-center text-xs">
                              <SafeIcon icon={FiCheck} className="h-3 w-3 text-green-500 mr-1" />
                              <span className="capitalize">
                                {feature.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowUpgradeModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handlePlanChange(selectedPlan)}
                      disabled={!selectedPlan || selectedPlan === currentPlan?.id || isLoading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Processing...' : 'Change Plan'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BillingPage;