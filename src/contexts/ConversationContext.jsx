import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ConversationContext = createContext();

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};

// AI Personality Types
const AI_PERSONALITIES = {
  adventurous: {
    name: 'Alex (Adventurous)',
    traits: ['outgoing', 'spontaneous', 'travel-loving', 'energetic'],
    responseStyle: 'enthusiastic',
    interests: ['travel', 'hiking', 'trying new foods', 'concerts', 'adventure sports'],
    communicationStyle: 'Uses exclamation points, asks follow-up questions, shares experiences',
    avatar: 'https://ui-avatars.com/api/?name=Alex&background=f59e0b&color=fff'
  },
  reserved: {
    name: 'Jordan (Reserved)',
    traits: ['thoughtful', 'introverted', 'deep', 'careful'],
    responseStyle: 'measured',
    interests: ['reading', 'art', 'quiet cafes', 'documentaries', 'cooking'],
    communicationStyle: 'Thoughtful responses, prefers depth over breadth, takes time to open up',
    avatar: 'https://ui-avatars.com/api/?name=Jordan&background=6366f1&color=fff'
  },
  humorous: {
    name: 'Sam (Humorous)',
    traits: ['witty', 'playful', 'lighthearted', 'creative'],
    responseStyle: 'playful',
    interests: ['comedy shows', 'memes', 'board games', 'movies', 'creative writing'],
    communicationStyle: 'Uses humor, makes jokes, keeps conversations light and fun',
    avatar: 'https://ui-avatars.com/api/?name=Sam&background=10b981&color=fff'
  },
  intellectual: {
    name: 'Morgan (Intellectual)',
    traits: ['analytical', 'curious', 'well-read', 'passionate about ideas'],
    responseStyle: 'thoughtful',
    interests: ['books', 'philosophy', 'science', 'debates', 'learning'],
    communicationStyle: 'Asks thought-provoking questions, enjoys deep discussions',
    avatar: 'https://ui-avatars.com/api/?name=Morgan&background=8b5cf6&color=fff'
  }
};

// Conversation Scenarios
const SCENARIOS = {
  opening_line: {
    name: 'Opening Line After Matching',
    description: 'Practice your first message after getting a match',
    difficulty: 'beginner',
    context: 'You just matched with someone on a dating app. Start the conversation!',
    goals: ['Break the ice', 'Show genuine interest', 'Stand out from other matches']
  },
  asking_date: {
    name: 'Asking Someone Out',
    description: 'Learn to confidently suggest meeting in person',
    difficulty: 'intermediate',
    context: 'You\'ve been chatting for a while and want to suggest meeting up.',
    goals: ['Transition from chat to date', 'Suggest specific plans', 'Handle potential hesitation']
  },
  deep_conversation: {
    name: 'Getting to Know Each Other',
    description: 'Move beyond small talk to meaningful conversation',
    difficulty: 'intermediate',
    context: 'You want to learn more about their values and interests.',
    goals: ['Ask meaningful questions', 'Share authentically', 'Build emotional connection']
  },
  handling_rejection: {
    name: 'Handling Rejection Gracefully',
    description: 'Practice responding maturely when someone isn\'t interested',
    difficulty: 'advanced',
    context: 'They\'ve politely declined your date invitation.',
    goals: ['Respond with grace', 'Maintain dignity', 'Keep doors open for friendship']
  },
  flirting: {
    name: 'Light Flirting',
    description: 'Practice playful, appropriate flirting techniques',
    difficulty: 'intermediate',
    context: 'The conversation is going well and you want to add some playful energy.',
    goals: ['Be playful but respectful', 'Test mutual interest', 'Build romantic tension']
  },
  difficult_topics: {
    name: 'Navigating Difficult Topics',
    description: 'Handle sensitive or controversial subjects diplomatically',
    difficulty: 'advanced',
    context: 'A potentially sensitive topic has come up in conversation.',
    goals: ['Stay respectful', 'Share your perspective', 'Avoid arguments']
  }
};

export const ConversationProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (user) {
      const savedHistory = localStorage.getItem(`conversation_history_${user.id}`);
      if (savedHistory) {
        setSessionHistory(JSON.parse(savedHistory));
      }
    }
  }, [user]);

  const saveSession = (session) => {
    if (user) {
      const updatedHistory = [session, ...sessionHistory.slice(0, 9)]; // Keep last 10 sessions
      setSessionHistory(updatedHistory);
      localStorage.setItem(`conversation_history_${user.id}`, JSON.stringify(updatedHistory));
    }
  };

  const startSession = (scenarioId, personalityId) => {
    const scenario = SCENARIOS[scenarioId];
    const personality = AI_PERSONALITIES[personalityId];
    
    const session = {
      id: Date.now(),
      scenario,
      personality,
      messages: [],
      feedback: [],
      startTime: new Date().toISOString(),
      metrics: {
        messagesCount: 0,
        averageResponseTime: 0,
        engagementScore: 0,
        toneScore: 0,
        clarityScore: 0
      }
    };

    setCurrentSession(session);
    
    // Add initial AI message
    setTimeout(() => {
      const initialMessage = generateInitialMessage(scenario, personality);
      addAIMessage(initialMessage);
    }, 1000);
  };

  const generateInitialMessage = (scenario, personality) => {
    const messages = {
      opening_line: {
        adventurous: "Hey! I saw you love hiking too! That photo from your last mountain trip looks amazing. Where was that taken? 🏔️",
        reserved: "Hi there. I noticed we both enjoy quiet coffee shops. Do you have a favorite spot in the city?",
        humorous: "Well hello there! I have to ask - is that really you in the photo with the inflatable unicorn, or did you borrow someone else's fun personality? 😄",
        intellectual: "Hello! I was intrigued by the book in your photo. What did you think of that author's latest work?"
      },
      asking_date: {
        adventurous: "This has been such a fun conversation! I'd love to continue it over coffee or maybe something more adventurous? What do you think?",
        reserved: "I've really enjoyed our chats. Would you be interested in meeting for coffee sometime? No pressure at all.",
        humorous: "So... crazy idea here... what if we continued this riveting conversation in person? I promise I'm at least 73% as funny in real life! ☕",
        intellectual: "I've been thinking it would be wonderful to continue our discussions in person. Would you be interested in meeting at that bookstore café you mentioned?"
      }
    };

    const personalityKey = Object.keys(AI_PERSONALITIES).find(key => 
      AI_PERSONALITIES[key].name === personality.name
    );
    
    return messages[scenario.name.toLowerCase().replace(/\s+/g, '_')]?.[personalityKey] || 
           "Hi there! Looking forward to our conversation!";
  };

  const addUserMessage = (content) => {
    if (!currentSession) return;

    const message = {
      id: Date.now(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      feedback: analyzeMessage(content, currentSession.scenario, currentSession.personality)
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, message],
      metrics: updateMetrics(currentSession.metrics, message)
    };

    setCurrentSession(updatedSession);

    // Generate AI response
    setTimeout(() => {
      generateAIResponse(updatedSession);
    }, Math.random() * 2000 + 1000); // 1-3 second delay
  };

  const addAIMessage = (content) => {
    if (!currentSession) return;

    const message = {
      id: Date.now(),
      content,
      sender: 'ai',
      timestamp: new Date().toISOString()
    };

    setCurrentSession(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  };

  const generateAIResponse = (session) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const lastUserMessage = session.messages[session.messages.length - 1];
      const response = createPersonalityBasedResponse(
        lastUserMessage.content,
        session.personality,
        session.scenario,
        session.messages.length
      );
      
      addAIMessage(response);
      setIsTyping(false);
    }, 2000);
  };

  const createPersonalityBasedResponse = (userMessage, personality, scenario, messageCount) => {
    const personalityKey = Object.keys(AI_PERSONALITIES).find(key => 
      AI_PERSONALITIES[key].name === personality.name
    );

    // Response templates based on personality and message analysis
    const responses = {
      adventurous: [
        "That sounds amazing! I love that you're so spontaneous. What's the most adventurous thing you've done recently?",
        "Ooh, I'm definitely intrigued! I'm always up for trying new things. What did you have in mind?",
        "Yes! I love your energy. Life's too short to play it safe, right? 🌟"
      ],
      reserved: [
        "That's really thoughtful of you. I appreciate how considerate you are.",
        "I like that approach. It's nice to take things at a comfortable pace.",
        "That's an interesting perspective. I'd love to hear more about your thoughts on that."
      ],
      humorous: [
        "Haha, okay you got me there! I didn't expect that response. You're keeping me on my toes! 😄",
        "Well that's one way to put it! I like how you think. Are you always this entertaining?",
        "LOL! Okay, I officially declare you funnier than my last three dates combined. That's not a high bar, but still... 😂"
      ],
      intellectual: [
        "That's a fascinating way to look at it. Have you always been interested in that perspective?",
        "I appreciate the depth of your thinking. It's refreshing to meet someone who considers these things.",
        "That raises some interesting questions. What led you to that conclusion?"
      ]
    };

    const personalityResponses = responses[personalityKey] || responses.adventurous;
    return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
  };

  const analyzeMessage = (content, scenario, personality) => {
    const feedback = [];
    const metrics = {
      tone: 0,
      clarity: 0,
      engagement: 0,
      appropriateness: 0
    };

    // Analyze message length
    if (content.length < 10) {
      feedback.push({
        type: 'warning',
        category: 'engagement',
        message: 'Message too short',
        suggestion: 'Try adding more detail or asking a follow-up question to keep the conversation flowing.'
      });
      metrics.engagement -= 20;
    } else if (content.length > 200) {
      feedback.push({
        type: 'tip',
        category: 'clarity',
        message: 'Message might be too long',
        suggestion: 'Consider breaking this into smaller messages to make it easier to respond to.'
      });
      metrics.clarity -= 10;
    } else {
      metrics.engagement += 20;
      metrics.clarity += 20;
    }

    // Analyze question types
    const hasOpenQuestion = /\b(what|how|why|where|when|which|tell me about|describe|explain)\b/i.test(content);
    const hasClosedQuestion = /\b(do you|are you|did you|will you|can you|is it|have you)\b.*\?/i.test(content);

    if (hasOpenQuestion) {
      feedback.push({
        type: 'success',
        category: 'engagement',
        message: 'Great use of open-ended questions!',
        suggestion: 'Open questions encourage longer, more engaging responses.'
      });
      metrics.engagement += 30;
    } else if (hasClosedQuestion && !hasOpenQuestion) {
      feedback.push({
        type: 'tip',
        category: 'engagement',
        message: 'Consider open-ended questions',
        suggestion: 'Try "What inspired your trip to Spain?" instead of "Did you like Spain?"'
      });
      metrics.engagement -= 10;
    }

    // Analyze tone indicators
    const positiveWords = ['love', 'amazing', 'awesome', 'great', 'wonderful', 'excited', 'fun', 'interesting'];
    const negativeWords = ['hate', 'awful', 'terrible', 'boring', 'stupid', 'annoying'];
    
    const positiveCount = positiveWords.filter(word => content.toLowerCase().includes(word)).length;
    const negativeCount = negativeWords.filter(word => content.toLowerCase().includes(word)).length;

    if (positiveCount > negativeCount) {
      metrics.tone += 25;
      if (positiveCount > 2) {
        feedback.push({
          type: 'success',
          category: 'tone',
          message: 'Positive and enthusiastic tone!',
          suggestion: 'Your enthusiasm comes through clearly and creates good energy.'
        });
      }
    } else if (negativeCount > 0) {
      metrics.tone -= 20;
      feedback.push({
        type: 'warning',
        category: 'tone',
        message: 'Watch your tone',
        suggestion: 'Try to keep the conversation positive, especially early on.'
      });
    }

    // Check for personal sharing
    const personalIndicators = ['i', 'my', 'me', 'myself'];
    const personalCount = personalIndicators.filter(word => 
      content.toLowerCase().split(/\s+/).includes(word)
    ).length;

    if (personalCount > 0) {
      metrics.engagement += 15;
      feedback.push({
        type: 'success',
        category: 'engagement',
        message: 'Nice personal sharing!',
        suggestion: 'Sharing about yourself helps build connection.'
      });
    }

    // Check for emojis (positive for most personalities except reserved)
    const emojiCount = (content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []).length;
    
    if (emojiCount > 0) {
      if (personality.name.includes('Reserved')) {
        feedback.push({
          type: 'tip',
          category: 'appropriateness',
          message: 'Consider your audience',
          suggestion: 'This person seems more reserved - maybe use fewer emojis initially.'
        });
        metrics.appropriateness -= 5;
      } else {
        metrics.tone += 10;
        metrics.appropriateness += 10;
      }
    }

    // Normalize metrics to 0-100 scale
    Object.keys(metrics).forEach(key => {
      metrics[key] = Math.max(0, Math.min(100, metrics[key] + 50));
    });

    return { feedback, metrics };
  };

  const updateMetrics = (currentMetrics, message) => {
    const newMetrics = { ...currentMetrics };
    
    newMetrics.messagesCount += 1;
    
    if (message.feedback && message.feedback.metrics) {
      const { metrics } = message.feedback;
      newMetrics.toneScore = Math.round((newMetrics.toneScore + metrics.tone) / 2);
      newMetrics.clarityScore = Math.round((newMetrics.clarityScore + metrics.clarity) / 2);
      newMetrics.engagementScore = Math.round((newMetrics.engagementScore + metrics.engagement) / 2);
    }

    return newMetrics;
  };

  const endSession = () => {
    if (!currentSession) return null;

    const finalSession = {
      ...currentSession,
      endTime: new Date().toISOString(),
      duration: Date.now() - new Date(currentSession.startTime).getTime()
    };

    saveSession(finalSession);
    setCurrentSession(null);
    
    return generateSessionSummary(finalSession);
  };

  const generateSessionSummary = (session) => {
    const userMessages = session.messages.filter(m => m.sender === 'user');
    const totalFeedback = userMessages.flatMap(m => m.feedback?.feedback || []);
    
    const successCount = totalFeedback.filter(f => f.type === 'success').length;
    const warningCount = totalFeedback.filter(f => f.type === 'warning').length;
    const tipCount = totalFeedback.filter(f => f.type === 'tip').length;

    const avgTone = Math.round(userMessages.reduce((sum, m) => sum + (m.feedback?.metrics?.tone || 0), 0) / userMessages.length) || 0;
    const avgClarity = Math.round(userMessages.reduce((sum, m) => sum + (m.feedback?.metrics?.clarity || 0), 0) / userMessages.length) || 0;
    const avgEngagement = Math.round(userMessages.reduce((sum, m) => sum + (m.feedback?.metrics?.engagement || 0), 0) / userMessages.length) || 0;

    const improvements = [];
    const strengths = [];

    if (avgTone < 60) {
      improvements.push('Work on maintaining a more positive tone throughout the conversation');
    } else {
      strengths.push('Great positive energy and enthusiasm');
    }

    if (avgEngagement < 60) {
      improvements.push('Ask more open-ended questions to encourage deeper responses');
    } else {
      strengths.push('Excellent at keeping the conversation engaging');
    }

    if (avgClarity < 60) {
      improvements.push('Try to be more clear and concise in your messages');
    } else {
      strengths.push('Clear and easy to understand communication');
    }

    return {
      sessionId: session.id,
      scenario: session.scenario.name,
      personality: session.personality.name,
      duration: Math.round(session.duration / 1000 / 60), // minutes
      messageCount: userMessages.length,
      averageScores: {
        tone: avgTone,
        clarity: avgClarity,
        engagement: avgEngagement,
        overall: Math.round((avgTone + avgClarity + avgEngagement) / 3)
      },
      feedbackCounts: {
        successes: successCount,
        warnings: warningCount,
        tips: tipCount
      },
      strengths,
      improvements,
      recommendedScenarios: getRecommendedScenarios(session.scenario, avgEngagement, avgTone)
    };
  };

  const getRecommendedScenarios = (currentScenario, engagement, tone) => {
    const recommendations = [];
    
    if (engagement < 60) {
      recommendations.push('deep_conversation');
    }
    
    if (tone > 80 && currentScenario.name !== 'Light Flirting') {
      recommendations.push('flirting');
    }
    
    if (currentScenario.name === 'Opening Line After Matching') {
      recommendations.push('asking_date');
    }

    return recommendations.map(id => SCENARIOS[id]).filter(Boolean);
  };

  const value = {
    scenarios: SCENARIOS,
    personalities: AI_PERSONALITIES,
    currentSession,
    sessionHistory,
    isTyping,
    startSession,
    addUserMessage,
    endSession
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};