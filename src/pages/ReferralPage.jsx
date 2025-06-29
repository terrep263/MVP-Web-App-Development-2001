import React from 'react';
import { motion } from 'framer-motion';
import ReferralDashboard from '../components/referral/ReferralDashboard';

const ReferralPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReferralDashboard />
      </div>
    </div>
  );
};

export default ReferralPage;