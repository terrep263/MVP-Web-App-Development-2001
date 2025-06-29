import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiStar, FiQuote, FiCalendar, FiUsers, FiTrendingUp, FiCheck } = FiIcons;

const SuccessStories = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const successStories = [
    {
      id: 1,
      name: 'Sarah M.',
      age: 28,
      location: 'San Francisco, CA',
      category: 'confidence',
      timeframe: '3 months',
      beforeScore: 4,
      afterScore: 9,
      story: "I was incredibly shy and had zero confidence when it came to dating. Spark Coach's conversation simulator helped me practice until I felt natural. Now I've been in a loving relationship for 6 months!",
      achievement: "Went from 2 dates in 2 years to finding my soulmate",
      testimonial: "The academy modules completely transformed how I see myself. I learned that confidence isn't about being perfect - it's about being authentic.",
      avatar: 'https://ui-avatars.com/api/?name=Sarah+M&background=ec4899&color=fff',
      verified: true,
      features: ['Conversation Simulator', 'Academy', 'Confidence Coaching']
    },
    {
      id: 2,
      name: 'Mike R.',
      age: 32,
      location: 'Austin, TX',
      category: 'profile',
      timeframe: '2 months',
      beforeScore: 3,
      afterScore: 8,
      story: "My dating profile was getting zero matches. After using the AI profile review and following the suggestions, my matches increased by 400% in the first month!",
      achievement: "Increased matches from 2 to 40+ per month",
      testimonial: "The profile optimization was a game-changer. I learned what photos work and how to write a bio that actually represents who I am.",
      avatar: 'https://ui-avatars.com/api/?name=Mike+R&background=3b82f6&color=fff',
      verified: true,
      features: ['Profile Review', 'Photo Optimization', 'Bio Writing']
    },
    {
      id: 3,
      name: 'Jessica L.',
      age: 25,
      location: 'New York, NY',
      category: 'conversation',
      timeframe: '4 months',
      beforeScore: 5,
      afterScore: 9,
      story: "I could get matches but conversations always fizzled out. The conversation templates and practice scenarios taught me how to keep meaningful dialogues going.",
      achievement: "From awkward small talk to engaging conversations",
      testimonial: "I never knew what to say beyond 'hey, how's your day?' Now I can start conversations about anything and keep them interesting for hours.",
      avatar: 'https://ui-avatars.com/api/?name=Jessica+L&background=10b981&color=fff',
      verified: true,
      features: ['Message Assistant', 'Conversation Simulator', 'Academy']
    },
    {
      id: 4,
      name: 'David K.',
      age: 35,
      location: 'Seattle, WA',
      category: 'relationship',
      timeframe: '6 months',
      beforeScore: 2,
      afterScore: 10,
      story: "After a tough divorce, I thought I'd never date again. Spark Coach helped me rebuild my confidence and understand what I really wanted in a partner. I'm now engaged!",
      achievement: "Found love again after divorce",
      testimonial: "The emotional support and practical advice helped me heal and grow. I'm not just dating better - I'm a better person.",
      avatar: 'https://ui-avatars.com/api/?name=David+K&background=8b5cf6&color=fff',
      verified: true,
      features: ['Confidence Coaching', 'Academy', 'Personal Growth']
    },
    {
      id: 5,
      name: 'Emma T.',
      age: 29,
      location: 'Miami, FL',
      category: 'confidence',
      timeframe: '5 months',
      beforeScore: 3,
      afterScore: 8,
      story: "Social anxiety made dating feel impossible. The step-by-step modules and practice exercises helped me overcome my fears and build genuine connections.",
      achievement: "Overcame social anxiety to find meaningful relationships",
      testimonial: "I went from canceling dates out of anxiety to actually looking forward to them. The confidence I've gained extends to every area of my life.",
      avatar: 'https://ui-avatars.com/api/?name=Emma+T&background=f59e0b&color=fff',
      verified: true,
      features: ['Anxiety Reduction', 'Confidence Building', 'Social Skills']
    },
    {
      id: 6,
      name: 'Alex P.',
      age: 27,
      location: 'Chicago, IL',
      category: 'profile',
      timeframe: '1 month',
      beforeScore: 4,
      afterScore: 9,
      story: "I was spending hours swiping with no results. The profile audit showed me exactly what was wrong, and within weeks I was getting quality matches with people I actually wanted to meet.",
      achievement: "Quality over quantity - better matches, better dates",
      testimonial: "It's not about getting more matches - it's about getting the RIGHT matches. My dating life completely changed.",
      avatar: 'https://ui-avatars.com/api/?name=Alex+P&background=ef4444&color=fff',
      verified: true,
      features: ['Profile Review', 'Strategy Optimization', 'Match Quality']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Stories', icon: FiUsers },
    { id: 'confidence', label: 'Confidence Building', icon: FiTrendingUp },
    { id: 'profile', label: 'Profile Success', icon: FiStar },
    { id: 'conversation', label: 'Conversation Skills', icon: FiQuote },
    { id: 'relationship', label: 'Found Love', icon: FiHeart }
  ];

  const filteredStories = activeFilter === 'all' 
    ? successStories 
    : successStories.filter(story => story.category === activeFilter);

  const stats = {
    totalStories: successStories.length,
    avgImprovement: Math.round(
      successStories.reduce((sum, story) => sum + (story.afterScore - story.beforeScore), 0) / successStories.length
    ),
    avgTimeframe: '3.5 months',
    successRate: 94
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiHeart} className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real transformations from real people. See how Spark Coach has helped thousands find confidence, improve their dating lives, and discover meaningful connections.
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
        >
          <div className="text-2xl font-bold text-pink-600 mb-1">{stats.totalStories}+</div>
          <div className="text-sm text-gray-600">Success Stories</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
        >
          <div className="text-2xl font-bold text-green-600 mb-1">+{stats.avgImprovement}</div>
          <div className="text-sm text-gray-600">Avg Confidence Boost</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
        >
          <div className="text-2xl font-bold text-blue-600 mb-1">{stats.avgTimeframe}</div>
          <div className="text-sm text-gray-600">Avg Time to Success</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
        >
          <div className="text-2xl font-bold text-purple-600 mb-1">{stats.successRate}%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveFilter(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
              activeFilter === category.id
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-300'
            }`}
          >
            <SafeIcon icon={category.icon} className="h-4 w-4" />
            <span className="text-sm font-medium">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Success Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{story.name}</h3>
                    {story.verified && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <SafeIcon icon={FiCheck} className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{story.age} • {story.location}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <SafeIcon
                        key={i}
                        icon={FiStar}
                        className={`h-4 w-4 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{story.timeframe} journey</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Achievement Badge */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4 border border-green-200">
                <h4 className="font-medium text-green-900 mb-1">🎉 Achievement Unlocked</h4>
                <p className="text-sm text-green-800">{story.achievement}</p>
              </div>

              {/* Confidence Scores */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">{story.beforeScore}/10</div>
                  <div className="text-xs text-gray-600">Before</div>
                </div>
                <div className="text-center">
                  <SafeIcon icon={FiTrendingUp} className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{story.afterScore}/10</div>
                  <div className="text-xs text-gray-600">After</div>
                </div>
              </div>

              {/* Story */}
              <blockquote className="text-gray-700 italic mb-4">
                <SafeIcon icon={FiQuote} className="h-4 w-4 text-gray-400 mb-2" />
                "{story.story}"
              </blockquote>

              {/* Testimonial */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
                <p className="text-blue-800 text-sm font-medium">"{story.testimonial}"</p>
              </div>

              {/* Features Used */}
              <div>
                <p className="text-xs text-gray-600 mb-2">Features that helped:</p>
                <div className="flex flex-wrap gap-1">
                  {story.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg p-8 text-center text-white"
      >
        <h3 className="text-2xl font-bold mb-4">Ready to Write Your Success Story?</h3>
        <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
          Join thousands of users who have transformed their dating lives with personalized coaching, proven strategies, and ongoing support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Your Journey
          </button>
          <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
            Share Your Story
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessStories;