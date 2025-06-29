import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCoach } from './CoachContext';

const ProgressEmailContext = createContext();

export const useProgressEmail = () => {
  const context = useContext(ProgressEmailContext);
  if (!context) {
    throw new Error('useProgressEmail must be used within a ProgressEmailProvider');
  }
  return context;
};

export const ProgressEmailProvider = ({ children }) => {
  const { user } = useAuth();
  const { progress } = useCoach();
  const [emailHistory, setEmailHistory] = useState([]);
  const [lastProgressCheck, setLastProgressCheck] = useState({});

  useEffect(() => {
    if (user) {
      loadEmailHistory();
      loadLastProgressCheck();
    }
  }, [user]);

  useEffect(() => {
    if (user && progress) {
      checkForProgressMilestones();
    }
  }, [progress, user]);

  const loadEmailHistory = () => {
    const saved = localStorage.getItem(`progress_emails_${user.id}`);
    if (saved) {
      setEmailHistory(JSON.parse(saved));
    }
  };

  const loadLastProgressCheck = () => {
    const saved = localStorage.getItem(`last_progress_${user.id}`);
    if (saved) {
      setLastProgressCheck(JSON.parse(saved));
    }
  };

  const saveEmailHistory = (history) => {
    localStorage.setItem(`progress_emails_${user.id}`, JSON.stringify(history));
    setEmailHistory(history);
  };

  const saveLastProgressCheck = (progressData) => {
    localStorage.setItem(`last_progress_${user.id}`, JSON.stringify(progressData));
    setLastProgressCheck(progressData);
  };

  const checkForProgressMilestones = () => {
    const milestones = [
      {
        type: 'confidence_boost',
        threshold: 20,
        metric: 'confidenceLevel',
        title: 'Confidence Breakthrough! 🚀',
        subject: 'Your confidence score improved by {improvement}%!'
      },
      {
        type: 'profile_improvement',
        threshold: 15,
        metric: 'profileScore',
        title: 'Profile Power-Up! ✨',
        subject: 'Your profile score jumped {improvement} points!'
      },
      {
        type: 'conversation_skills',
        threshold: 25,
        metric: 'conversationSkills',
        title: 'Conversation Master! 💬',
        subject: 'Your conversation skills improved {improvement}%!'
      },
      {
        type: 'task_completion',
        threshold: 5,
        metric: 'completedTasks',
        title: 'Achievement Unlocked! 🎯',
        subject: 'You completed {improvement} coaching tasks!'
      }
    ];

    milestones.forEach(milestone => {
      const currentValue = progress[milestone.metric] || 0;
      const lastValue = lastProgressCheck[milestone.metric] || 0;
      const improvement = currentValue - lastValue;

      if (improvement >= milestone.threshold) {
        sendProgressEmail(milestone, improvement);
      }
    });

    // Update last progress check
    saveLastProgressCheck(progress);
  };

  const sendProgressEmail = async (milestone, improvement) => {
    // Check if we've already sent this type of email recently (within 7 days)
    const recentEmail = emailHistory.find(email => 
      email.type === milestone.type && 
      new Date(email.sentAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    if (recentEmail) return;

    const emailData = {
      id: Date.now(),
      type: milestone.type,
      subject: milestone.subject.replace('{improvement}', improvement),
      title: milestone.title,
      improvement,
      metric: milestone.metric,
      sentAt: new Date().toISOString(),
      read: false
    };

    // Simulate sending email
    await simulateEmailSend(emailData);

    // Add to history
    const updatedHistory = [emailData, ...emailHistory];
    saveEmailHistory(updatedHistory);
  };

  const simulateEmailSend = async (emailData) => {
    // In a real app, this would integrate with an email service
    console.log('📧 Progress email sent:', emailData);
    
    // Store in localStorage for demo
    const emails = JSON.parse(localStorage.getItem('demo_progress_emails') || '[]');
    emails.unshift(emailData);
    localStorage.setItem('demo_progress_emails', JSON.stringify(emails.slice(0, 50))); // Keep last 50
  };

  const generateEmailContent = (emailData) => {
    const templates = {
      confidence_boost: {
        greeting: `Hey ${user.name}! 🎉`,
        body: `
          <p>We have some exciting news to share with you!</p>
          
          <p>Your confidence score has improved by <strong>${emailData.improvement}%</strong> - that's incredible progress! This improvement shows you're really embracing the coaching techniques and building genuine self-assurance.</p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white; text-align: center; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">Confidence Breakthrough!</h3>
            <p style="margin: 0; font-size: 18px;">+${emailData.improvement}% improvement</p>
          </div>
          
          <p><strong>What this means:</strong></p>
          <ul>
            <li>You're becoming more comfortable with dating situations</li>
            <li>Your self-assurance is growing stronger</li>
            <li>You're ready for more challenging scenarios</li>
          </ul>
          
          <p><strong>Keep the momentum going:</strong></p>
          <ul>
            <li>Try our advanced conversation simulator scenarios</li>
            <li>Practice your new confidence in real-world situations</li>
            <li>Share your progress with our community</li>
          </ul>
        `,
        cta: 'Continue Your Journey'
      },
      profile_improvement: {
        greeting: `Amazing progress, ${user.name}! ✨`,
        body: `
          <p>Your dating profile just got a major upgrade!</p>
          
          <p>Your profile score increased by <strong>${emailData.improvement} points</strong> - you're really mastering the art of online attraction!</p>
          
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px; color: white; text-align: center; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">Profile Power-Up!</h3>
            <p style="margin: 0; font-size: 18px;">+${emailData.improvement} points improvement</p>
          </div>
          
          <p><strong>Your improvements are working:</strong></p>
          <ul>
            <li>Better photos that showcase your personality</li>
            <li>A bio that tells your unique story</li>
            <li>Profile elements that attract quality matches</li>
          </ul>
          
          <p><strong>Next steps to maximize your success:</strong></p>
          <ul>
            <li>Test your improved profile in the wild</li>
            <li>Monitor your match quality and quantity</li>
            <li>Continue refining based on results</li>
          </ul>
        `,
        cta: 'Optimize Further'
      },
      conversation_skills: {
        greeting: `You're on fire, ${user.name}! 💬`,
        body: `
          <p>Your conversation skills just leveled up in a big way!</p>
          
          <p>You've improved by <strong>${emailData.improvement}%</strong> in conversation mastery - you're becoming a true communication expert!</p>
          
          <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 10px; color: white; text-align: center; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">Conversation Master!</h3>
            <p style="margin: 0; font-size: 18px;">+${emailData.improvement}% improvement</p>
          </div>
          
          <p><strong>Your conversation superpowers include:</strong></p>
          <ul>
            <li>Natural, engaging dialogue flow</li>
            <li>Asking questions that create connection</li>
            <li>Sharing stories that reveal your personality</li>
          </ul>
          
          <p><strong>Time to put your skills to work:</strong></p>
          <ul>
            <li>Start more meaningful conversations</li>
            <li>Practice your new techniques on dates</li>
            <li>Help others in our community forums</li>
          </ul>
        `,
        cta: 'Practice More'
      },
      task_completion: {
        greeting: `Fantastic work, ${user.name}! 🎯`,
        body: `
          <p>You're absolutely crushing your coaching goals!</p>
          
          <p>You've completed <strong>${emailData.improvement} coaching tasks</strong> - your dedication is paying off in real results!</p>
          
          <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 20px; border-radius: 10px; color: white; text-align: center; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">Achievement Unlocked!</h3>
            <p style="margin: 0; font-size: 18px;">${emailData.improvement} tasks completed</p>
          </div>
          
          <p><strong>Your progress shows:</strong></p>
          <ul>
            <li>Commitment to personal growth</li>
            <li>Willingness to step outside your comfort zone</li>
            <li>Building habits that create lasting change</li>
          </ul>
          
          <p><strong>Ready for the next challenge:</strong></p>
          <ul>
            <li>Take on more advanced coaching modules</li>
            <li>Apply your learnings to real dating situations</li>
            <li>Set new goals for continued growth</li>
          </ul>
        `,
        cta: 'View New Tasks'
      }
    };

    return templates[emailData.type] || templates.confidence_boost;
  };

  const markEmailAsRead = (emailId) => {
    const updatedHistory = emailHistory.map(email => 
      email.id === emailId ? { ...email, read: true } : email
    );
    saveEmailHistory(updatedHistory);
  };

  const getUnreadCount = () => {
    return emailHistory.filter(email => !email.read).length;
  };

  const value = {
    emailHistory,
    generateEmailContent,
    markEmailAsRead,
    getUnreadCount,
    sendProgressEmail
  };

  return (
    <ProgressEmailContext.Provider value={value}>
      {children}
    </ProgressEmailContext.Provider>
  );
};