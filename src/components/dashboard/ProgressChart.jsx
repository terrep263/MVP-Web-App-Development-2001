import React from 'react';
import { useCoach } from '../../contexts/CoachContext';

const ProgressChart = () => {
  const { progress } = useCoach();

  const metrics = [
    { label: 'Profile Score', value: progress.profileScore, color: 'bg-pink-500' },
    { label: 'Confidence', value: progress.confidenceLevel, color: 'bg-purple-500' },
    { label: 'Conversations', value: progress.conversationSkills, color: 'bg-indigo-500' }
  ];

  return (
    <div className="space-y-4">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">{metric.label}</span>
            <span className="font-medium text-gray-900">{metric.value}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className={`${metric.color} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${metric.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressChart;