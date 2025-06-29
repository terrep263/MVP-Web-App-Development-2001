import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDownload, FiFileText, FiCheck, FiPrinter } = FiIcons;

const WorksheetDownload = ({ content, lessonTitle, onComplete }) => {
  const [downloaded, setDownloaded] = useState(false);

  const generateWorksheet = (type) => {
    // Generate different worksheet content based on type
    const worksheets = {
      'profile-audit': {
        title: 'Complete Profile Audit Checklist',
        sections: [
          {
            title: 'Photo Analysis',
            items: [
              'Main photo shows clear face shot ✓/✗',
              'Genuine smile in at least one photo ✓/✗',
              'Full body shot included ✓/✗',
              'Photos show variety of activities ✓/✗',
              'Good lighting in all photos ✓/✗',
              'No group photos as main image ✓/✗'
            ]
          },
          {
            title: 'Bio Optimization',
            items: [
              'Bio length: 50-150 words ✓/✗',
              'Mentions specific interests ✓/✗',
              'Shows personality/humor ✓/✗',
              'Includes conversation starters ✓/✗',
              'Positive tone throughout ✓/✗',
              'Clear about what you\'re seeking ✓/✗'
            ]
          }
        ]
      },
      'date-planning': {
        title: 'Perfect Date Planning Guide',
        sections: [
          {
            title: 'Pre-Date Preparation',
            items: [
              'Research venue and backup options',
              'Confirm date details 24 hours prior',
              'Plan conversation topics',
              'Choose appropriate outfit',
              'Arrange transportation',
              'Set realistic expectations'
            ]
          }
        ]
      }
    };

    return worksheets[type] || worksheets['profile-audit'];
  };

  const handleDownload = () => {
    const worksheet = generateWorksheet('profile-audit');
    
    // Create downloadable content
    let content = `${worksheet.title}\n${'='.repeat(worksheet.title.length)}\n\n`;
    
    worksheet.sections.forEach(section => {
      content += `${section.title}:\n${'-'.repeat(section.title.length)}\n`;
      section.items.forEach(item => {
        content += `□ ${item}\n`;
      });
      content += '\n';
    });

    content += '\nNotes:\n_'.repeat(50) + '\n\n';
    content += '_'.repeat(50) + '\n\n';
    content += '_'.repeat(50) + '\n\n';

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonTitle.replace(/\s+/g, '_')}_Worksheet.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    setDownloaded(true);
  };

  const handlePrint = () => {
    const worksheet = generateWorksheet('profile-audit');
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${worksheet.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; }
            h2 { color: #4b5563; margin-top: 30px; }
            .item { margin: 10px 0; }
            .checkbox { margin-right: 10px; }
          </style>
        </head>
        <body>
          <h1>${worksheet.title}</h1>
          ${worksheet.sections.map(section => `
            <h2>${section.title}</h2>
            ${section.items.map(item => `
              <div class="item">
                <span class="checkbox">☐</span>${item}
              </div>
            `).join('')}
          `).join('')}
          <h2>Notes:</h2>
          <div style="height: 200px; border: 1px solid #ccc; margin: 10px 0;"></div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <SafeIcon icon={FiFileText} className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Downloadable Worksheet
        </h3>
        <p className="text-gray-600">
          Get your personalized worksheet to practice and track your progress offline
        </p>
      </div>

      {/* Worksheet Preview */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-900 mb-4">📋 What's Included:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Profile Audit Checklist</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Photo quality assessment</li>
              <li>• Bio optimization guide</li>
              <li>• Conversation starter ideas</li>
              <li>• Action items checklist</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Bonus Materials</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Note-taking sections</li>
              <li>• Progress tracking</li>
              <li>• Quick reference guide</li>
              <li>• Implementation timeline</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <SafeIcon icon={FiDownload} className="h-5 w-5" />
          <span>Download Worksheet</span>
        </button>
        
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <SafeIcon icon={FiPrinter} className="h-5 w-5" />
          <span>Print Worksheet</span>
        </button>
      </div>

      {/* Success Message */}
      {downloaded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6"
        >
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCheck} className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Worksheet downloaded successfully!
            </span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Complete the worksheet and return to mark this lesson as finished.
          </p>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mb-6">
        <h5 className="font-medium text-yellow-900 mb-2">📝 How to Use This Worksheet:</h5>
        <ol className="text-yellow-800 text-sm space-y-1">
          <li>1. Download and print the worksheet</li>
          <li>2. Complete each section honestly</li>
          <li>3. Use it as a reference while optimizing your profile</li>
          <li>4. Return here to mark the lesson complete</li>
        </ol>
      </div>

      {/* Complete Button */}
      <button
        onClick={() => onComplete()}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Mark Lesson as Complete
      </button>
    </div>
  );
};

export default WorksheetDownload;