import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AcademyContext = createContext();

export const useAcademy = () => {
  const context = useContext(AcademyContext);
  if (!context) {
    throw new Error('useAcademy must be used within an AcademyProvider');
  }
  return context;
};

// Academy Modules Structure
const ACADEMY_MODULES = {
  foundations: {
    id: 'foundations',
    title: 'Foundations of Confidence',
    description: 'Build unshakeable dating confidence from the ground up',
    icon: 'FiHeart',
    color: 'from-pink-500 to-rose-500',
    estimatedTime: '45 minutes',
    difficulty: 'Beginner',
    lessons: [
      {
        id: 'self-assessment',
        title: 'Dating Confidence Self-Assessment',
        type: 'quiz',
        duration: '10 min',
        description: 'Discover your confidence baseline and growth areas'
      },
      {
        id: 'anxiety-reduction',
        title: 'Anxiety Reduction Techniques',
        type: 'video',
        duration: '15 min',
        description: 'Proven methods to calm pre-date nerves'
      },
      {
        id: 'confidence-building',
        title: 'Daily Confidence Exercises',
        type: 'interactive',
        duration: '20 min',
        description: 'Practical exercises to boost your dating confidence'
      }
    ],
    badge: {
      name: 'Confidence Builder',
      description: 'Mastered the foundations of dating confidence'
    }
  },
  perfect_profile: {
    id: 'perfect_profile',
    title: 'Perfect Profile',
    description: 'Master the psychology of attraction in your dating profile',
    icon: 'FiCamera',
    color: 'from-purple-500 to-indigo-500',
    estimatedTime: '60 minutes',
    difficulty: 'Intermediate',
    lessons: [
      {
        id: 'photo-psychology',
        title: 'Photo Psychology Masterclass',
        type: 'video',
        duration: '20 min',
        description: 'Understanding what makes photos attractive'
      },
      {
        id: 'bio-optimization',
        title: 'Bio A/B Testing Lab',
        type: 'interactive',
        duration: '25 min',
        description: 'Test different bio versions for maximum impact'
      },
      {
        id: 'profile-audit',
        title: 'Complete Profile Audit',
        type: 'worksheet',
        duration: '15 min',
        description: 'Comprehensive profile optimization checklist'
      }
    ],
    badge: {
      name: 'Profile Master',
      description: 'Created an irresistible dating profile'
    }
  },
  art_of_conversation: {
    id: 'art_of_conversation',
    title: 'Art of Conversation',
    description: 'Master the skills that turn matches into meaningful connections',
    icon: 'FiMessageCircle',
    color: 'from-blue-500 to-cyan-500',
    estimatedTime: '50 minutes',
    difficulty: 'Intermediate',
    lessons: [
      {
        id: 'opening-lines',
        title: 'Opening Line Generator Workshop',
        type: 'interactive',
        duration: '20 min',
        description: 'Create personalized, engaging conversation starters'
      },
      {
        id: 'humor-calibration',
        title: 'Humor Calibration Drills',
        type: 'video',
        duration: '15 min',
        description: 'Learn to use humor appropriately in dating'
      },
      {
        id: 'conversation-flow',
        title: 'Conversation Flow Mastery',
        type: 'interactive',
        duration: '15 min',
        description: 'Keep conversations engaging and natural'
      }
    ],
    badge: {
      name: 'Conversation Artist',
      description: 'Mastered the art of engaging conversation'
    }
  },
  first_dates: {
    id: 'first_dates',
    title: 'First Dates',
    description: 'Plan memorable first dates and spot red flags early',
    icon: 'FiMapPin',
    color: 'from-green-500 to-emerald-500',
    estimatedTime: '40 minutes',
    difficulty: 'Beginner',
    lessons: [
      {
        id: 'venue-selection',
        title: 'Smart Venue Recommender',
        type: 'interactive',
        duration: '15 min',
        description: 'Find the perfect first date location'
      },
      {
        id: 'red-flags',
        title: 'Red Flag Identifier Training',
        type: 'video',
        duration: '15 min',
        description: 'Recognize warning signs early'
      },
      {
        id: 'date-planning',
        title: 'Perfect Date Planning Guide',
        type: 'worksheet',
        duration: '10 min',
        description: 'Step-by-step date planning checklist'
      }
    ],
    badge: {
      name: 'Date Master',
      description: 'Expert at planning and executing great first dates'
    }
  },
  digital_navigation: {
    id: 'digital_navigation',
    title: 'Digital Navigation',
    description: 'Master dating apps and maintain healthy digital habits',
    icon: 'FiSmartphone',
    color: 'from-yellow-500 to-orange-500',
    estimatedTime: '55 minutes',
    difficulty: 'Advanced',
    lessons: [
      {
        id: 'algorithm-mastery',
        title: 'Dating App Algorithm Explained',
        type: 'video',
        duration: '20 min',
        description: 'Understand how app algorithms work'
      },
      {
        id: 'burnout-prevention',
        title: 'Burnout Prevention Strategies',
        type: 'interactive',
        duration: '20 min',
        description: 'Maintain healthy app usage habits'
      },
      {
        id: 'digital-strategy',
        title: 'Digital Dating Strategy Guide',
        type: 'worksheet',
        duration: '15 min',
        description: 'Create your personalized app strategy'
      }
    ],
    badge: {
      name: 'Digital Navigator',
      description: 'Mastered the digital dating landscape'
    }
  }
};

// Sample content for lessons
const LESSON_CONTENT = {
  'self-assessment': {
    type: 'quiz',
    questions: [
      {
        id: 1,
        question: 'How confident do you feel when approaching someone you\'re interested in?',
        options: [
          { value: 1, text: 'Very anxious and avoid it' },
          { value: 2, text: 'Nervous but I try sometimes' },
          { value: 3, text: 'Somewhat confident' },
          { value: 4, text: 'Very confident' }
        ]
      },
      {
        id: 2,
        question: 'How do you handle rejection in dating?',
        options: [
          { value: 1, text: 'It devastates me for weeks' },
          { value: 2, text: 'It hurts but I recover' },
          { value: 3, text: 'I take it in stride' },
          { value: 4, text: 'It doesn\'t affect me much' }
        ]
      },
      {
        id: 3,
        question: 'How comfortable are you with your dating profile?',
        options: [
          { value: 1, text: 'I hate how I look in photos' },
          { value: 2, text: 'I\'m unsure if it represents me well' },
          { value: 3, text: 'I think it\'s pretty good' },
          { value: 4, text: 'I\'m very happy with it' }
        ]
      }
    ]
  },
  'anxiety-reduction': {
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    transcript: 'Learn powerful breathing techniques and mindfulness exercises...',
    keyPoints: [
      'Box breathing technique for instant calm',
      'Progressive muscle relaxation',
      'Positive visualization exercises',
      'Grounding techniques for anxiety'
    ]
  },
  'opening-lines': {
    type: 'interactive',
    generator: {
      categories: ['Humor', 'Thoughtful', 'Playful', 'Direct'],
      templates: {
        humor: [
          'I have to ask - is that really you with the {activity} or did you borrow someone else\'s adventures?',
          'Your {interest} game is strong! I\'m officially intimidated and impressed.'
        ],
        thoughtful: [
          'I noticed you mentioned {interest}. What drew you to that?',
          'Your perspective on {topic} in your bio really resonated with me.'
        ]
      }
    }
  }
};

export const AcademyProvider = ({ children }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({});
  const [completedLessons, setCompletedLessons] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    if (user) {
      const savedProgress = localStorage.getItem(`academy_progress_${user.id}`);
      const savedLessons = localStorage.getItem(`academy_lessons_${user.id}`);
      const savedBadges = localStorage.getItem(`academy_badges_${user.id}`);

      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
      if (savedLessons) {
        setCompletedLessons(JSON.parse(savedLessons));
      }
      if (savedBadges) {
        setEarnedBadges(JSON.parse(savedBadges));
      }
    }
  }, [user]);

  const saveProgress = (newProgress) => {
    if (user) {
      localStorage.setItem(`academy_progress_${user.id}`, JSON.stringify(newProgress));
    }
  };

  const completeLesson = (moduleId, lessonId, score = null) => {
    const lessonKey = `${moduleId}-${lessonId}`;
    
    if (!completedLessons.includes(lessonKey)) {
      const updatedLessons = [...completedLessons, lessonKey];
      setCompletedLessons(updatedLessons);
      localStorage.setItem(`academy_lessons_${user.id}`, JSON.stringify(updatedLessons));

      // Update module progress
      const moduleProgress = getModuleProgress(moduleId);
      const newProgress = {
        ...progress,
        [moduleId]: {
          ...progress[moduleId],
          completedLessons: (progress[moduleId]?.completedLessons || 0) + 1,
          score: score || progress[moduleId]?.score
        }
      };
      setProgress(newProgress);
      saveProgress(newProgress);

      // Check if module is completed
      const module = ACADEMY_MODULES[moduleId];
      if (moduleProgress + 1 >= module.lessons.length) {
        awardBadge(module.badge);
      }
    }
  };

  const awardBadge = (badge) => {
    const badgeExists = earnedBadges.some(b => b.name === badge.name);
    if (!badgeExists) {
      const newBadge = {
        ...badge,
        earnedAt: new Date().toISOString()
      };
      const updatedBadges = [...earnedBadges, newBadge];
      setEarnedBadges(updatedBadges);
      localStorage.setItem(`academy_badges_${user.id}`, JSON.stringify(updatedBadges));
    }
  };

  const getModuleProgress = (moduleId) => {
    const module = ACADEMY_MODULES[moduleId];
    const completedCount = completedLessons.filter(lesson => 
      lesson.startsWith(`${moduleId}-`)
    ).length;
    return completedCount;
  };

  const getOverallProgress = () => {
    const totalLessons = Object.values(ACADEMY_MODULES).reduce(
      (sum, module) => sum + module.lessons.length, 0
    );
    return Math.round((completedLessons.length / totalLessons) * 100);
  };

  const isModuleCompleted = (moduleId) => {
    const module = ACADEMY_MODULES[moduleId];
    return getModuleProgress(moduleId) >= module.lessons.length;
  };

  const getPersonalizedTips = () => {
    const tips = [];
    
    // Based on completed modules
    if (isModuleCompleted('foundations')) {
      tips.push('Great confidence foundation! Ready to optimize your profile?');
    }
    
    if (completedLessons.length === 0) {
      tips.push('Start with Foundations of Confidence for the best results!');
    }

    if (completedLessons.length > 5) {
      tips.push('You\'re making excellent progress! Keep up the momentum.');
    }

    return tips;
  };

  const generateCertificate = (moduleId) => {
    const module = ACADEMY_MODULES[moduleId];
    return {
      recipientName: user.name,
      moduleName: module.title,
      completionDate: new Date().toLocaleDateString(),
      certificateId: `SC-${moduleId.toUpperCase()}-${Date.now()}`
    };
  };

  const value = {
    modules: ACADEMY_MODULES,
    lessonContent: LESSON_CONTENT,
    progress,
    completedLessons,
    earnedBadges,
    currentModule,
    currentLesson,
    setCurrentModule,
    setCurrentLesson,
    completeLesson,
    getModuleProgress,
    getOverallProgress,
    isModuleCompleted,
    getPersonalizedTips,
    generateCertificate
  };

  return (
    <AcademyContext.Provider value={value}>
      {children}
    </AcademyContext.Provider>
  );
};