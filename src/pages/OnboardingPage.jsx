import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiArrowRight, FiArrowLeft, FiHeart, FiTarget, FiUsers, FiClock } = FiIcons;

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue } = useForm();

  const steps = [
    {
      title: 'Welcome to Spark Coach!',
      subtitle: 'Let\'s personalize your dating journey',
      component: WelcomeStep
    },
    {
      title: 'What are your dating goals?',
      subtitle: 'Help us understand what you\'re looking for',
      component: GoalsStep
    },
    {
      title: 'What\'s your dating experience?',
      subtitle: 'This helps us tailor our advice',
      component: ExperienceStep
    },
    {
      title: 'What challenges do you face?',
      subtitle: 'We\'ll focus on areas where you need the most help',
      component: ChallengesStep
    },
    {
      title: 'Perfect! You\'re all set',
      subtitle: 'Let\'s start your transformation',
      component: CompletionStep
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data) => {
    // Determine persona based on responses
    let persona = 'hesitant-professional';
    
    if (data.experience === 'very-experienced' && data.challenges?.includes('app-fatigue')) {
      persona = 'app-fatigued';
    } else if (data.experience === 'beginner' && data.challenges?.includes('recent-breakup')) {
      persona = 'recently-single';
    }

    const onboardingData = {
      ...data,
      persona,
      completedAt: new Date().toISOString()
    };

    completeOnboarding(onboardingData);
    toast.success('Welcome to Spark Coach! Let\'s begin your journey.');
    navigate('/dashboard');
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-xl p-8"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {steps[currentStep].title}
                </h1>
                <p className="text-lg text-gray-600">
                  {steps[currentStep].subtitle}
                </p>
              </div>

              <CurrentStepComponent 
                register={register} 
                watch={watch} 
                setValue={setValue}
                nextStep={nextStep}
                onSubmit={onSubmit}
              />

              {currentStep < steps.length - 1 && (
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <SafeIcon icon={FiArrowLeft} className="h-4 w-4 mr-2" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all"
                  >
                    Next
                    <SafeIcon icon={FiArrowRight} className="h-4 w-4 ml-2" />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};

// Step Components
const WelcomeStep = ({ nextStep }) => (
  <div className="text-center">
    <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
      <SafeIcon icon={FiHeart} className="h-12 w-12 text-white" />
    </div>
    <p className="text-gray-600 mb-8 text-lg leading-relaxed">
      We're here to help you build confidence, improve your conversations, and find meaningful connections. 
      This quick setup will personalize your coaching experience.
    </p>
    <button
      type="button"
      onClick={nextStep}
      className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all font-medium"
    >
      Let's Get Started
    </button>
  </div>
);

const GoalsStep = ({ register }) => {
  const goals = [
    { value: 'serious-relationship', label: 'Long-term relationship', icon: FiHeart },
    { value: 'casual-dating', label: 'Casual dating & fun', icon: FiUsers },
    { value: 'build-confidence', label: 'Build dating confidence', icon: FiTarget },
    { value: 'improve-skills', label: 'Improve conversation skills', icon: FiClock }
  ];

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <label key={goal.value} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-pink-300 cursor-pointer transition-colors">
          <input
            {...register('goals', { required: true })}
            type="radio"
            value={goal.value}
            className="sr-only"
          />
          <div className="flex items-center w-full">
            <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
              <SafeIcon icon={goal.icon} className="h-6 w-6 text-pink-600" />
            </div>
            <span className="text-lg font-medium text-gray-900">{goal.label}</span>
          </div>
        </label>
      ))}
    </div>
  );
};

const ExperienceStep = ({ register }) => {
  const experiences = [
    { value: 'beginner', label: 'New to dating', description: 'Just getting started or getting back out there' },
    { value: 'some-experience', label: 'Some experience', description: 'Had a few dates but want to improve' },
    { value: 'experienced', label: 'Fairly experienced', description: 'Been dating but facing some challenges' },
    { value: 'very-experienced', label: 'Very experienced', description: 'Lots of dating experience but need a refresh' }
  ];

  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <label key={exp.value} className="flex p-4 border-2 border-gray-200 rounded-lg hover:border-pink-300 cursor-pointer transition-colors">
          <input
            {...register('experience', { required: true })}
            type="radio"
            value={exp.value}
            className="sr-only"
          />
          <div className="w-full">
            <div className="font-medium text-gray-900 mb-1">{exp.label}</div>
            <div className="text-sm text-gray-600">{exp.description}</div>
          </div>
        </label>
      ))}
    </div>
  );
};

const ChallengesStep = ({ register }) => {
  const challenges = [
    { value: 'conversation-starters', label: 'Starting conversations' },
    { value: 'dating-anxiety', label: 'Dating anxiety & nerves' },
    { value: 'profile-optimization', label: 'Creating an attractive profile' },
    { value: 'app-fatigue', label: 'Dating app burnout' },
    { value: 'recent-breakup', label: 'Recently single' },
    { value: 'time-management', label: 'Balancing dating with busy life' }
  ];

  return (
    <div>
      <p className="text-gray-600 mb-6">Select all that apply (you can choose multiple):</p>
      <div className="grid grid-cols-1 gap-3">
        {challenges.map((challenge) => (
          <label key={challenge.value} className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-pink-300 cursor-pointer transition-colors">
            <input
              {...register('challenges')}
              type="checkbox"
              value={challenge.value}
              className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <span className="ml-3 text-gray-900">{challenge.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const CompletionStep = ({ onSubmit }) => (
  <div className="text-center">
    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <SafeIcon icon={FiTarget} className="h-12 w-12 text-green-600" />
    </div>
    <p className="text-gray-600 mb-8 text-lg leading-relaxed">
      Great! We've created a personalized coaching plan just for you. 
      Let's start building your confidence and improving your dating life.
    </p>
    <button
      type="submit"
      className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all font-medium"
    >
      Start My Journey
    </button>
  </div>
);

export default OnboardingPage;