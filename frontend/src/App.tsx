import React, { useState, useEffect } from 'react';
import { ReadinessScore } from './components/ReadinessScore';
import { apiService } from './services/api';
import { ReadinessScore as IReadinessScore } from '@aws-readiness/shared';

function App() {
  const [score, setScore] = useState<IReadinessScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check API health on mount
  useEffect(() => {
    apiService
      .healthCheck()
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  const [formData, setFormData] = useState({
    companyName: '',
    businessType: 'llc' as const,
    taxId: '',
    website: '',
    industry: '',
    description: '',
    primaryEmail: '',
    businessPhone: '',
    paymentType: 'business_credit' as const,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const calculatedScore = await apiService.calculateScore({
        businessProfile: {
          id: 'temp',
          companyName: formData.companyName,
          businessType: formData.businessType,
          taxId: formData.taxId,
          website: formData.website,
          industry: formData.industry,
          description: formData.description,
          registrationNumber: '',
          foundedYear: new Date().getFullYear(),
          employeeCount: 1,
        },
        contactInfo: {
          primaryEmail: formData.primaryEmail,
          businessPhone: formData.businessPhone,
          businessAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'US',
          },
          billingAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'US',
          },
          contactPerson: {
            firstName: '',
            lastName: '',
            title: '',
            email: formData.primaryEmail,
            phone: formData.businessPhone,
          },
        },
        paymentMethod: {
          id: 'temp',
          type: formData.paymentType,
          last4: '0000',
          brand: 'Visa',
          isVerified: false,
          riskScore: 20,
          issuerCountry: 'US',
        },
      });

      setScore(calculatedScore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              AWS Account Readiness Platform
            </h1>
            <div className="flex items-center space-x-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  apiStatus === 'online' ? 'bg-green-500' :
                  apiStatus === 'offline' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`}
              />
              <span className="text-sm text-gray-600">
                {apiStatus === 'online' ? 'API Online' :
                 apiStatus === 'offline' ? 'API Offline' :
                 'Checking...'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Business Information</h2>
              <form onSubmit={handleCalculate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type *
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="llc">LLC</option>
                    <option value="corporation">Corporation</option>
                    <option value="partnership">Partnership</option>
                    <option value="sole_proprietorship">Sole Proprietorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax ID (EIN)
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    placeholder="XX-XXXXXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g., Technology, Finance"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Brief description of your business"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    name="primaryEmail"
                    value={formData.primaryEmail}
                    onChange={handleChange}
                    required
                    placeholder="contact@company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Phone
                  </label>
                  <input
                    type="tel"
                    name="businessPhone"
                    value={formData.businessPhone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method Type *
                  </label>
                  <select
                    name="paymentType"
                    value={formData.paymentType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="business_credit">Business Credit Card</option>
                    <option value="business_debit">Business Debit Card</option>
                    <option value="personal">Personal Card</option>
                    <option value="prepaid">Prepaid Card</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || apiStatus === 'offline'}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Calculating...' : 'Calculate Readiness Score'}
                </button>

                {error && (
                  <div className="text-red-600 text-sm mt-2">
                    Error: {error}
                  </div>
                )}
              </form>
            </div>

            {/* Results */}
            <div>
              {score ? (
                <ReadinessScore score={score} />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium">No score calculated yet</p>
                    <p className="text-sm mt-2">Fill out the form and click Calculate</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;