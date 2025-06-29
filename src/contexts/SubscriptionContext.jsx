import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

// Subscription Plans Configuration
const SUBSCRIPTION_PLANS = {
  freemium: {
    id: 'freemium',
    name: 'Freemium',
    price: 0,
    period: 'forever',
    stripeId: null,
    features: {
      profileReviews: 1,
      academyModules: ['foundations'],
      simulatorSessions: 0,
      messageAssistant: false,
      prioritySupport: false,
      advancedAnalytics: false
    },
    limits: {
      profileReviews: 1,
      simulatorSessions: 0,
      academyAccess: 'limited'
    },
    description: 'Perfect for getting started'
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    price: 19.99,
    period: 'month',
    stripeId: 'price_standard_monthly', // Replace with actual Stripe price ID
    features: {
      profileReviews: 'unlimited',
      academyModules: 'all',
      simulatorSessions: 10,
      messageAssistant: false,
      prioritySupport: true,
      advancedAnalytics: true
    },
    limits: {
      profileReviews: 999,
      simulatorSessions: 10,
      academyAccess: 'full'
    },
    description: 'Most popular choice for serious daters',
    popular: true
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 49.99,
    period: 'month',
    stripeId: 'price_premium_monthly', // Replace with actual Stripe price ID
    features: {
      profileReviews: 'unlimited',
      academyModules: 'all',
      simulatorSessions: 'unlimited',
      messageAssistant: true,
      prioritySupport: true,
      advancedAnalytics: true,
      personalCoaching: true,
      customStrategies: true
    },
    limits: {
      profileReviews: 999,
      simulatorSessions: 999,
      academyAccess: 'full'
    },
    description: 'Complete dating transformation package',
    trial: {
      enabled: true,
      days: 7
    }
  }
};

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState({
    profileReviews: 0,
    simulatorSessions: 0,
    lastReset: new Date().toISOString()
  });
  const [billingHistory, setBillingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadSubscriptionData();
      loadUsageData();
      loadBillingHistory();
    }
  }, [user]);

  const loadSubscriptionData = () => {
    const savedSubscription = localStorage.getItem(`subscription_${user.id}`);
    if (savedSubscription) {
      setSubscription(JSON.parse(savedSubscription));
    } else {
      // Default to freemium
      const defaultSubscription = {
        plan: 'freemium',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: null,
        stripeSubscriptionId: null,
        trialEnd: null,
        cancelAtPeriodEnd: false
      };
      setSubscription(defaultSubscription);
      localStorage.setItem(`subscription_${user.id}`, JSON.stringify(defaultSubscription));
    }
  };

  const loadUsageData = () => {
    const savedUsage = localStorage.getItem(`usage_${user.id}`);
    if (savedUsage) {
      const parsedUsage = JSON.parse(savedUsage);
      
      // Reset usage if it's a new month
      const lastReset = new Date(parsedUsage.lastReset);
      const now = new Date();
      if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
        const resetUsage = {
          profileReviews: 0,
          simulatorSessions: 0,
          lastReset: now.toISOString()
        };
        setUsage(resetUsage);
        localStorage.setItem(`usage_${user.id}`, JSON.stringify(resetUsage));
      } else {
        setUsage(parsedUsage);
      }
    }
  };

  const loadBillingHistory = () => {
    const savedHistory = localStorage.getItem(`billing_${user.id}`);
    if (savedHistory) {
      setBillingHistory(JSON.parse(savedHistory));
    }
  };

  const saveSubscriptionData = (newSubscription) => {
    localStorage.setItem(`subscription_${user.id}`, JSON.stringify(newSubscription));
    setSubscription(newSubscription);
  };

  const saveUsageData = (newUsage) => {
    localStorage.setItem(`usage_${user.id}`, JSON.stringify(newUsage));
    setUsage(newUsage);
  };

  const saveBillingHistory = (newHistory) => {
    localStorage.setItem(`billing_${user.id}`, JSON.stringify(newHistory));
    setBillingHistory(newHistory);
  };

  // Simulated Stripe integration
  const createStripeSession = async (planId, isUpgrade = false) => {
    setIsLoading(true);
    
    try {
      // Simulate API call to create Stripe checkout session
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const plan = SUBSCRIPTION_PLANS[planId];
      const sessionData = {
        id: `cs_${Date.now()}`,
        url: `https://checkout.stripe.com/pay/${Date.now()}`,
        planId,
        amount: plan.price * 100, // Stripe uses cents
        currency: 'usd'
      };
      
      // In a real app, redirect to Stripe checkout
      // window.location.href = sessionData.url;
      
      // For demo, simulate successful payment
      setTimeout(() => {
        handleSuccessfulPayment(planId, sessionData.id);
      }, 2000);
      
      return sessionData;
    } catch (error) {
      console.error('Failed to create Stripe session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulPayment = (planId, paymentIntentId) => {
    const plan = SUBSCRIPTION_PLANS[planId];
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const newSubscription = {
      plan: planId,
      status: 'active',
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      stripeSubscriptionId: `sub_${Date.now()}`,
      trialEnd: plan.trial?.enabled ? new Date(now.getTime() + plan.trial.days * 24 * 60 * 60 * 1000).toISOString() : null,
      cancelAtPeriodEnd: false
    };

    saveSubscriptionData(newSubscription);

    // Add to billing history
    const newBillingItem = {
      id: Date.now(),
      date: now.toISOString(),
      description: `${plan.name} Plan - Monthly`,
      amount: plan.price,
      status: 'paid',
      paymentIntentId,
      period: {
        start: now.toISOString(),
        end: endDate.toISOString()
      }
    };

    const updatedHistory = [newBillingItem, ...billingHistory];
    saveBillingHistory(updatedHistory);

    // Send confirmation email (simulated)
    sendSubscriptionEmail('subscription_confirmed', { plan: plan.name });
  };

  const cancelSubscription = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to cancel Stripe subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSubscription = {
        ...subscription,
        cancelAtPeriodEnd: true,
        status: 'canceling'
      };
      
      saveSubscriptionData(updatedSubscription);
      sendSubscriptionEmail('subscription_canceled', { 
        plan: SUBSCRIPTION_PLANS[subscription.plan].name,
        endDate: subscription.endDate 
      });
      
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const reactivateSubscription = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to reactivate Stripe subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSubscription = {
        ...subscription,
        cancelAtPeriodEnd: false,
        status: 'active'
      };
      
      saveSubscriptionData(updatedSubscription);
      sendSubscriptionEmail('subscription_reactivated', { 
        plan: SUBSCRIPTION_PLANS[subscription.plan].name 
      });
      
    } catch (error) {
      console.error('Failed to reactivate subscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeSubscription = async (newPlanId) => {
    const currentPlan = SUBSCRIPTION_PLANS[subscription.plan];
    const newPlan = SUBSCRIPTION_PLANS[newPlanId];
    
    if (newPlan.price <= currentPlan.price) {
      throw new Error('Cannot upgrade to a lower-priced plan');
    }

    return createStripeSession(newPlanId, true);
  };

  const downgradeSubscription = async (newPlanId) => {
    setIsLoading(true);
    
    try {
      // Simulate API call to schedule downgrade at period end
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSubscription = {
        ...subscription,
        pendingDowngrade: newPlanId,
        status: 'active'
      };
      
      saveSubscriptionData(updatedSubscription);
      sendSubscriptionEmail('subscription_downgrade_scheduled', { 
        currentPlan: SUBSCRIPTION_PLANS[subscription.plan].name,
        newPlan: SUBSCRIPTION_PLANS[newPlanId].name,
        effectiveDate: subscription.endDate
      });
      
    } catch (error) {
      console.error('Failed to schedule downgrade:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendSubscriptionEmail = (type, data) => {
    // Simulate email sending
    console.log(`📧 Sending ${type} email:`, data);
    
    const emails = {
      subscription_confirmed: `Welcome to ${data.plan}! Your subscription is now active.`,
      subscription_canceled: `Your ${data.plan} subscription will end on ${new Date(data.endDate).toLocaleDateString()}.`,
      subscription_reactivated: `Great! Your ${data.plan} subscription has been reactivated.`,
      subscription_downgrade_scheduled: `Your plan will change from ${data.currentPlan} to ${data.newPlan} on ${new Date(data.effectiveDate).toLocaleDateString()}.`,
      trial_ending: `Your 7-day trial ends in ${data.daysLeft} days. Upgrade to continue enjoying premium features.`,
      payment_failed: `We couldn't process your payment. Please update your payment method to avoid service interruption.`
    };

    // In a real app, this would trigger an email service
    console.log('Email content:', emails[type]);
  };

  const trackUsage = (type) => {
    const newUsage = { ...usage };
    newUsage[type] = (newUsage[type] || 0) + 1;
    saveUsageData(newUsage);
  };

  const canUseFeature = (feature) => {
    if (!subscription) return false;
    
    const plan = SUBSCRIPTION_PLANS[subscription.plan];
    const limits = plan.limits;
    
    switch (feature) {
      case 'profileReview':
        return usage.profileReviews < limits.profileReviews;
      case 'simulator':
        return usage.simulatorSessions < limits.simulatorSessions;
      case 'academyModule':
        return limits.academyAccess === 'full';
      case 'messageAssistant':
        return plan.features.messageAssistant;
      default:
        return false;
    }
  };

  const getRemainingUsage = (feature) => {
    if (!subscription) return 0;
    
    const plan = SUBSCRIPTION_PLANS[subscription.plan];
    const limits = plan.limits;
    
    switch (feature) {
      case 'profileReview':
        return Math.max(0, limits.profileReviews - usage.profileReviews);
      case 'simulator':
        return Math.max(0, limits.simulatorSessions - usage.simulatorSessions);
      default:
        return 0;
    }
  };

  const isTrialActive = () => {
    if (!subscription?.trialEnd) return false;
    return new Date(subscription.trialEnd) > new Date();
  };

  const getTrialDaysLeft = () => {
    if (!isTrialActive()) return 0;
    const trialEnd = new Date(subscription.trialEnd);
    const now = new Date();
    const diffTime = trialEnd - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const startTrial = async () => {
    if (subscription.plan !== 'freemium') {
      throw new Error('Trial only available for freemium users');
    }

    setIsLoading(true);
    
    try {
      const now = new Date();
      const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const trialSubscription = {
        plan: 'premium',
        status: 'trialing',
        startDate: now.toISOString(),
        endDate: trialEnd.toISOString(),
        stripeSubscriptionId: null,
        trialEnd: trialEnd.toISOString(),
        cancelAtPeriodEnd: false
      };
      
      saveSubscriptionData(trialSubscription);
      sendSubscriptionEmail('trial_started', { daysLeft: 7 });
      
    } catch (error) {
      console.error('Failed to start trial:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    subscription,
    usage,
    billingHistory,
    plans: SUBSCRIPTION_PLANS,
    isLoading,
    
    // Actions
    createStripeSession,
    cancelSubscription,
    reactivateSubscription,
    upgradeSubscription,
    downgradeSubscription,
    startTrial,
    
    // Utilities
    trackUsage,
    canUseFeature,
    getRemainingUsage,
    isTrialActive,
    getTrialDaysLeft,
    
    // Current plan info
    currentPlan: subscription ? SUBSCRIPTION_PLANS[subscription.plan] : null
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};