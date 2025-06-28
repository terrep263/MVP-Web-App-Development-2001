import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

// Dating personas and their characteristics
const PERSONAS = {
  hesitant_professional: {
    name: 'The Hesitant Professional',
    description: 'Career-focused individual looking to balance professional success with meaningful relationships',
    challenges: ['Time management', 'Work-life balance', 'Confidence in dating'],
    goals: ['Find serious relationship', 'Improve dating confidence', 'Better time management'],
    recommendations: {
      profile: 'Showcase your ambition while highlighting your softer side',
      messaging: 'Focus on quality conversations over quantity',
      dates: 'Plan efficient but meaningful first dates'
    }
  },
  app_fatigued_swiper: {
    name: 'The App-Fatigued Swiper',
    description: 'Experienced with dating apps but feeling overwhelmed and burnt out',
    challenges: ['Dating app burnout', 'Meaningless conversations', 'Too many options'],
    goals: ['Quality over quantity', 'Reduce app fatigue', 'Find genuine connections'],
    recommendations: {
      profile: 'Stand out with authentic, conversation-starting content',
      messaging: 'Use strategic conversation techniques to build deeper connections',
      dates: 'Focus on unique, memorable experiences'
    }
  },
  recently_single: {
    name: 'The Recently Single',
    description: 'New to dating after a long relationship, rebuilding confidence',
    challenges: ['Dating anxiety', 'Outdated dating knowledge', 'Low confidence'],
    goals: ['Rebuild confidence', 'Learn modern dating', 'Take things slow'],
    recommendations: {
      profile: 'Highlight your growth and new chapter',
      messaging: 'Practice conversation skills in low-pressure situations',
      dates: 'Start with casual, comfortable activities'
    }
  }
};

export const OnboardingProvider = ({ children }) => {
  const { updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});

  const questions = [
    {
      id: 'dating_experience',
      type: 'single',
      title: 'How would you describe your dating experience?',
      options: [
        { value: 'beginner', label: 'New to dating or recently single' },
        { value: 'experienced', label: 'Experienced but looking for better results' },
        { value: 'expert', label: 'Very experienced but facing challenges' }
      ]
    },
    {
      id: 'primary_goal',
      type: 'single',
      title: 'What\'s your primary dating goal?',
      options: [
        { value: 'serious_relationship', label: 'Find a serious, long-term relationship' },
        { value: 'casual_dating', label: 'Enjoy casual dating and meeting new people' },
        { value: 'improve_skills', label: 'Improve my dating and social skills' },
        { value: 'rebuild_confidence', label: 'Rebuild confidence after a breakup' }
      ]
    },
    {
      id: 'biggest_challenge',
      type: 'multiple',
      title: 'What are your biggest dating challenges? (Select all that apply)',
      options: [
        { value: 'profile_creation', label: 'Creating an attractive dating profile' },
        { value: 'conversation', label: 'Starting and maintaining conversations' },
        { value: 'first_dates', label: 'Planning and executing great first dates' },
        { value: 'confidence', label: 'Building dating confidence' },
        { value: 'time_management', label: 'Balancing dating with work/life' },
        { value: 'app_fatigue', label: 'Dealing with dating app burnout' }
      ]
    },
    {
      id: 'current_situation',
      type: 'single',
      title: 'Which best describes your current situation?',
      options: [
        { value: 'career_focused', label: 'Career-focused professional with limited time' },
        { value: 'app_experienced', label: 'Experienced with apps but feeling burnt out' },
        { value: 'recently_single', label: 'Recently single and getting back out there' },
        { value: 'social_anxiety', label: 'Dealing with social anxiety in dating' }
      ]
    },
    {
      id: 'preferred_approach',
      type: 'single',
      title: 'What\'s your preferred approach to dating?',
      options: [
        { value: 'strategic', label: 'Strategic and planned approach' },
        { value: 'natural', label: 'Natural and spontaneous approach' },
        { value: 'gradual', label: 'Gradual and comfortable pace' },
        { value: 'intensive', label: 'Intensive improvement and practice' }
      ]
    }
  ];

  const updateResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const determinePersona = (responses) => {
    // Logic to determine persona based on responses
    const situation = responses.current_situation;
    
    if (situation === 'career_focused') {
      return 'hesitant_professional';
    } else if (situation === 'app_experienced') {
      return 'app_fatigued_swiper';
    } else if (situation === 'recently_single') {
      return 'recently_single';
    }
    
    // Fallback logic based on other responses
    if (responses.dating_experience === 'beginner') {
      return 'recently_single';
    } else if (responses.biggest_challenge?.includes('app_fatigue')) {
      return 'app_fatigued_swiper';
    } else {
      return 'hesitant_professional';
    }
  };

  const completeOnboarding = () => {
    const persona = determinePersona(responses);
    const onboardingData = {
      responses,
      persona,
      personaData: PERSONAS[persona],
      completedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('sparkcoach_onboarding', JSON.stringify(onboardingData));
    
    // Update user
    updateUser({
      onboardingComplete: true,
      persona,
      personaData: PERSONAS[persona]
    });
    
    return onboardingData;
  };

  const value = {
    questions,
    currentStep,
    responses,
    personas: PERSONAS,
    updateResponse,
    nextStep,
    prevStep,
    completeOnboarding,
    isComplete: currentStep >= questions.length
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};