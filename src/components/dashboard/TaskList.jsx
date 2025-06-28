import React from 'react';
import { motion } from 'framer-motion';
import { useCoach } from '../../contexts/CoachContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiCheckCircle, FiClock, FiPlayCircle, FiCalendar } = FiIcons;

const TaskList = () => {
  const { tasks, completeTask } = useCoach();

  const handleCompleteTask = (taskId) => {
    completeTask(taskId);
    toast.success('Task completed! Great job!');
  };

  const getCategoryColor = (category) => {
    const colors = {
      profile: 'bg-pink-100 text-pink-800',
      conversation: 'bg-purple-100 text-purple-800',
      confidence: 'bg-indigo-100 text-indigo-800',
      strategy: 'bg-green-100 text-green-800',
      lifestyle: 'bg-yellow-100 text-yellow-800',
      wellness: 'bg-blue-100 text-blue-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (b.status === 'completed' && a.status !== 'completed') return -1;
    
    // Sort by priority (high first)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
  });

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border-2 transition-all ${
            task.status === 'completed'
              ? 'bg-green-50 border-green-200'
              : 'bg-white border-gray-200 hover:border-pink-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className={`font-semibold ${
                  task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                  {task.category}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{task.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {task.estimatedTime && (
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiClock} className="h-4 w-4" />
                    <span>{task.estimatedTime}</span>
                  </div>
                )}
                
                {task.priority && (
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <span className={getPriorityColor(task.priority)}>
                      {task.priority} priority
                    </span>
                  </div>
                )}
                
                {task.dueDate && (
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                    <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="ml-4">
              {task.status === 'completed' ? (
                <div className="flex items-center text-green-600">
                  <SafeIcon icon={FiCheckCircle} className="h-6 w-6" />
                </div>
              ) : (
                <button
                  onClick={() => handleCompleteTask(task.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all text-sm"
                >
                  <SafeIcon icon={FiPlayCircle} className="h-4 w-4" />
                  <span>Start</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
      
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiCheckCircle} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-500">Your personalized tasks will appear here as you progress.</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;