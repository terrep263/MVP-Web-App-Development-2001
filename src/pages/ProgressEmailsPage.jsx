import React from 'react';
import { motion } from 'framer-motion';
import ProgressEmailInbox from '../components/progress/ProgressEmailInbox';

const ProgressEmailsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressEmailInbox />
      </div>
    </div>
  );
};

export default ProgressEmailsPage;