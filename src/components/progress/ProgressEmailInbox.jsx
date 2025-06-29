import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgressEmail } from '../../contexts/ProgressEmailContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiMailOpen, FiTrendingUp, FiAward, FiCalendar, FiUser } = FiIcons;

const ProgressEmailInbox = () => {
  const { emailHistory, generateEmailContent, markEmailAsRead } = useProgressEmail();
  const [selectedEmail, setSelectedEmail] = useState(null);

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    if (!email.read) {
      markEmailAsRead(email.id);
    }
  };

  const getEmailIcon = (type) => {
    const icons = {
      confidence_boost: FiTrendingUp,
      profile_improvement: FiUser,
      conversation_skills: FiMail,
      task_completion: FiAward
    };
    return icons[type] || FiMail;
  };

  const getEmailColor = (type) => {
    const colors = {
      confidence_boost: 'from-purple-500 to-indigo-500',
      profile_improvement: 'from-pink-500 to-red-500',
      conversation_skills: 'from-blue-500 to-cyan-500',
      task_completion: 'from-green-500 to-emerald-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  if (selectedEmail) {
    const content = generateEmailContent(selectedEmail);
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        {/* Email Header */}
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => setSelectedEmail(null)}
            className="text-blue-600 hover:text-blue-700 text-sm mb-4"
          >
            ← Back to inbox
          </button>
          
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${getEmailColor(selectedEmail.type)} rounded-full flex items-center justify-center`}>
              <SafeIcon icon={getEmailIcon(selectedEmail.type)} className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedEmail.subject}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>From: Spark Coach Team</span>
                <span>{new Date(selectedEmail.sentAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className="p-6">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-900 mb-4">{content.greeting}</p>
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content.body }}
            />
            
            <div className="mt-8 text-center">
              <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all">
                {content.cta}
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>You're receiving this email because you're making great progress with Spark Coach. Keep up the amazing work!</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Progress Updates</h1>
        <p className="text-gray-600">
          Celebrating your dating journey milestones and achievements
        </p>
      </div>

      {/* Email List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Achievement Emails</h3>
        </div>

        {emailHistory.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {emailHistory.map((email, index) => (
              <motion.button
                key={email.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleEmailClick(email)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 bg-gradient-to-r ${getEmailColor(email.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <SafeIcon icon={getEmailIcon(email.type)} className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <SafeIcon 
                        icon={email.read ? FiMailOpen : FiMail} 
                        className={`h-4 w-4 ${email.read ? 'text-gray-400' : 'text-blue-600'}`} 
                      />
                      <h4 className={`font-medium truncate ${email.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {email.subject}
                      </h4>
                      {!email.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>{email.title}</span>
                      <SafeIcon icon={FiCalendar} className="h-3 w-3" />
                      <span>{new Date(email.sentAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getEmailColor(email.type).includes('purple') ? 'text-purple-600' : 'text-blue-600'}`}>
                      +{email.improvement}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {email.type.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <SafeIcon icon={FiMail} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No progress emails yet</h4>
            <p className="text-gray-500">
              Keep working on your goals and we'll celebrate your milestones with you!
            </p>
          </div>
        )}
      </div>

      {/* Email Types Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📧 What emails will you receive?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Confidence Boosts</h4>
              <p className="text-sm text-gray-600">When your confidence improves by 20%+</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUser} className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Profile Improvements</h4>
              <p className="text-sm text-gray-600">When your profile score jumps 15+ points</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiMail} className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Conversation Skills</h4>
              <p className="text-sm text-gray-600">When you master new communication techniques</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiAward} className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Achievement Unlocks</h4>
              <p className="text-sm text-gray-600">When you complete major milestones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressEmailInbox;