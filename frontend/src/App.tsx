import React from 'react';
import { ReadinessScore } from './components/ReadinessScore';

// Mock data for demonstration
const mockScore = {
  overall: 0.75,
  categories: {
    businessProfile: 0.8,
    documentation: 0.6,
    paymentMethod: 0.9,
    contactInfo: 0.85,
    riskFactors: 0.7
  },
  recommendations: [
    'Upload and verify your business license',
    'Complete tax documentation verification',
    'Add utility bill for address verification'
  ]
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              AWS Account Readiness Platform
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <ReadinessScore score={mockScore} />
        </div>
      </main>
    </div>
  );
}

export default App;