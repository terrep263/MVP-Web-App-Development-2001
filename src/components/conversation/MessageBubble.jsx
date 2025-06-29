import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-xs lg:max-w-md ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-900'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {format(new Date(message.timestamp), 'HH:mm')}
        </div>
        
        {/* User Message Feedback Indicators */}
        {isUser && message.feedback && message.feedback.feedback.length > 0 && (
          <div className={`mt-2 flex ${isUser ? 'justify-end' : 'justify-start'} space-x-1`}>
            {message.feedback.feedback.map((feedback, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  feedback.type === 'success'
                    ? 'bg-green-500'
                    : feedback.type === 'warning'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}
                title={feedback.message}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;