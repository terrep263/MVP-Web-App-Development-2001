import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversation } from '../../contexts/ConversationContext';
import MessageBubble from './MessageBubble';
import FeedbackPanel from './FeedbackPanel';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiSend, FiX, FiBarChart, FiMoreHorizontal } = FiIcons;

const ChatInterface = ({ onSessionEnd }) => {
  const { currentSession, addUserMessage, endSession, isTyping } = useConversation();
  const [message, setMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, isTyping]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (message.trim() && currentSession) {
      addUserMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEndSession = () => {
    const summary = endSession();
    if (summary) {
      onSessionEnd(summary);
      toast.success('Session completed! Check your analytics.');
    }
  };

  if (!currentSession) return null;

  const lastUserMessage = currentSession.messages
    .filter(m => m.sender === 'user')
    .slice(-1)[0];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[80vh]">
      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={currentSession.personality.avatar}
              alt={currentSession.personality.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                {currentSession.personality.name}
              </h3>
              <p className="text-sm text-gray-600">
                {currentSession.scenario.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFeedback(!showFeedback)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Toggle feedback panel"
            >
              <SafeIcon icon={FiBarChart} className="h-5 w-5" />
            </button>
            <button
              onClick={handleEndSession}
              className="p-2 text-red-400 hover:text-red-600 transition-colors"
              title="End session"
            >
              <SafeIcon icon={FiX} className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {currentSession.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-2"
            >
              <img
                src={currentSession.personality.avatar}
                alt="Typing"
                className="w-8 h-8 rounded-full"
              />
              <div className="bg-gray-200 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="2"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <SafeIcon icon={FiSend} className="h-5 w-5" />
            </button>
          </div>
          
          {/* Quick Tips */}
          <div className="mt-2 text-xs text-gray-500">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>

      {/* Feedback Panel */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="w-full lg:w-80 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <FeedbackPanel 
            message={lastUserMessage}
            sessionMetrics={currentSession.metrics}
          />
        </motion.div>
      )}
    </div>
  );
};

export default ChatInterface;