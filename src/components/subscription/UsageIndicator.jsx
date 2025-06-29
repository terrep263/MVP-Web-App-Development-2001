import React from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBarChart, FiAlertCircle } = FiIcons;

const UsageIndicator = ({ feature, className = "" }) => {
  const { usage, currentPlan, getRemainingUsage } = useSubscription();
  
  if (!currentPlan || currentPlan.id === 'freemium') return null;

  const getUsageInfo = () => {
    switch (feature) {
      case 'profileReview':
        const reviewsUsed = usage.profileReviews || 0;
        const reviewsLimit = currentPlan.limits.profileReviews;
        const reviewsRemaining = getRemainingUsage('profileReview');
        
        return {
          used: reviewsUsed,
          limit: reviewsLimit,
          remaining: reviewsRemaining,
          label: 'Profile Reviews',
          isUnlimited: reviewsLimit >= 999
        };
        
      case 'simulator':
        const sessionsUsed = usage.simulatorSessions || 0;
        const sessionsLimit = currentPlan.limits.simulatorSessions;
        const sessionsRemaining = getRemainingUsage('simulator');
        
        return {
          used: sessionsUsed,
          limit: sessionsLimit,
          remaining: sessionsRemaining,
          label: 'Simulator Sessions',
          isUnlimited: sessionsLimit >= 999
        };
        
      default:
        return null;
    }
  };

  const usageInfo = getUsageInfo();
  if (!usageInfo) return null;

  const { used, limit, remaining, label, isUnlimited } = usageInfo;
  const percentage = isUnlimited ? 0 : Math.min(100, (used / limit) * 100);
  const isNearLimit = percentage >= 80 && !isUnlimited;
  const isAtLimit = remaining === 0 && !isUnlimited;

  if (isUnlimited) {
    return (
      <div className={`flex items-center space-x-2 text-sm text-green-600 ${className}`}>
        <SafeIcon icon={FiBarChart} className="h-4 w-4" />
        <span>Unlimited {label.toLowerCase()}</span>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className={`font-medium ${
          isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-gray-900'
        }`}>
          {used}/{limit}
        </span>
      </div>
      
      <div className="bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {isNearLimit && (
        <div className="flex items-center space-x-1 mt-1">
          <SafeIcon icon={FiAlertCircle} className="h-3 w-3 text-yellow-600" />
          <span className="text-xs text-yellow-600">
            {remaining} remaining this month
          </span>
        </div>
      )}
      
      {isAtLimit && (
        <div className="flex items-center space-x-1 mt-1">
          <SafeIcon icon={FiAlertCircle} className="h-3 w-3 text-red-600" />
          <span className="text-xs text-red-600">
            Monthly limit reached
          </span>
        </div>
      )}
    </div>
  );
};

export default UsageIndicator;