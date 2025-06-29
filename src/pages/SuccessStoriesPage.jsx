import React from 'react';
import { motion } from 'framer-motion';
import SuccessStories from '../components/success/SuccessStories';

const SuccessStoriesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SuccessStories />
      </div>
    </div>
  );
};

export default SuccessStoriesPage;