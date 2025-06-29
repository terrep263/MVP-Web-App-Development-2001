import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSubscription } from './SubscriptionContext';

const ReferralContext = createContext();

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
};

export const ReferralProvider = ({ children }) => {
  const { user } = useAuth();
  const { trackUsage } = useSubscription();
  const [referralData, setReferralData] = useState({
    referralCode: '',
    referrals: [],
    totalEarned: 0,
    pendingRewards: 0,
    stats: {
      totalReferrals: 0,
      successfulReferrals: 0,
      pendingReferrals: 0,
      totalRewards: 0
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  const loadReferralData = () => {
    const savedData = localStorage.getItem(`referral_data_${user.id}`);
    if (savedData) {
      setReferralData(JSON.parse(savedData));
    } else {
      // Generate referral code
      const code = generateReferralCode(user.name);
      const initialData = {
        referralCode: code,
        referrals: [],
        totalEarned: 0,
        pendingRewards: 0,
        stats: {
          totalReferrals: 0,
          successfulReferrals: 0,
          pendingReferrals: 0,
          totalRewards: 0
        }
      };
      setReferralData(initialData);
      saveReferralData(initialData);
    }
  };

  const generateReferralCode = (name) => {
    const prefix = name.substring(0, 3).toUpperCase();
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${suffix}`;
  };

  const saveReferralData = (data) => {
    localStorage.setItem(`referral_data_${user.id}`, JSON.stringify(data));
  };

  const sendReferral = async (email, personalMessage = '') => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newReferral = {
        id: Date.now(),
        email,
        personalMessage,
        status: 'pending',
        sentAt: new Date().toISOString(),
        referralCode: referralData.referralCode,
        reward: 30 // 30 days Premium
      };

      const updatedReferrals = [...referralData.referrals, newReferral];
      const updatedData = {
        ...referralData,
        referrals: updatedReferrals,
        stats: {
          ...referralData.stats,
          totalReferrals: updatedReferrals.length,
          pendingReferrals: updatedReferrals.filter(r => r.status === 'pending').length
        }
      };

      setReferralData(updatedData);
      saveReferralData(updatedData);

      // Track referral event
      trackReferralEvent('referral_sent', { email, code: referralData.referralCode });

      return newReferral;
    } catch (error) {
      throw new Error('Failed to send referral');
    } finally {
      setIsLoading(false);
    }
  };

  const processReferralSignup = (referralCode, newUserId) => {
    // This would be called when someone signs up with a referral code
    const referral = referralData.referrals.find(r => 
      r.referralCode === referralCode && r.status === 'pending'
    );

    if (referral) {
      const updatedReferral = {
        ...referral,
        status: 'signed_up',
        signedUpAt: new Date().toISOString(),
        newUserId
      };

      const updatedReferrals = referralData.referrals.map(r => 
        r.id === referral.id ? updatedReferral : r
      );

      const updatedData = {
        ...referralData,
        referrals: updatedReferrals,
        pendingRewards: referralData.pendingRewards + referral.reward,
        stats: {
          ...referralData.stats,
          pendingReferrals: updatedReferrals.filter(r => r.status === 'pending').length
        }
      };

      setReferralData(updatedData);
      saveReferralData(updatedData);

      trackReferralEvent('referral_signup', { referralCode, newUserId });
    }
  };

  const processReferralConversion = (referralCode) => {
    // Called when referred user subscribes to Premium
    const referral = referralData.referrals.find(r => 
      r.referralCode === referralCode && r.status === 'signed_up'
    );

    if (referral) {
      const updatedReferral = {
        ...referral,
        status: 'converted',
        convertedAt: new Date().toISOString()
      };

      const updatedReferrals = referralData.referrals.map(r => 
        r.id === referral.id ? updatedReferral : r
      );

      const updatedData = {
        ...referralData,
        referrals: updatedReferrals,
        totalEarned: referralData.totalEarned + referral.reward,
        pendingRewards: referralData.pendingRewards - referral.reward,
        stats: {
          ...referralData.stats,
          successfulReferrals: updatedReferrals.filter(r => r.status === 'converted').length,
          totalRewards: referralData.totalEarned + referral.reward
        }
      };

      setReferralData(updatedData);
      saveReferralData(updatedData);

      // Grant Premium days
      grantPremiumDays(referral.reward);

      trackReferralEvent('referral_converted', { referralCode, reward: referral.reward });

      return referral.reward;
    }
    return 0;
  };

  const grantPremiumDays = (days) => {
    // This would integrate with the subscription system
    console.log(`Granting ${days} days of Premium access`);
    // Implementation would extend current subscription or start trial
  };

  const trackReferralEvent = (event, data) => {
    // Track referral events for analytics
    console.log('Referral Event:', event, data);
  };

  const getReferralLink = () => {
    return `${window.location.origin}?ref=${referralData.referralCode}`;
  };

  const getShareMessage = () => {
    return `Hey! I've been using Spark Coach to improve my dating confidence and it's amazing! Use my referral code ${referralData.referralCode} to get started: ${getReferralLink()}`;
  };

  const value = {
    referralData,
    isLoading,
    sendReferral,
    processReferralSignup,
    processReferralConversion,
    getReferralLink,
    getShareMessage,
    trackReferralEvent
  };

  return (
    <ReferralContext.Provider value={value}>
      {children}
    </ReferralContext.Provider>
  );
};