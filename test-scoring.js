// Simple test script to verify the scoring system works
const { calculateReadinessScore } = require('./shared/dist/utils/scoring');

// Mock business data for testing
const mockBusinessProfile = {
  id: '1',
  companyName: 'Test Company LLC',
  businessType: 'llc',
  taxId: '12-3456789',
  registrationNumber: 'LLC123456',
  industry: 'Technology',
  website: 'https://testcompany.com',
  description: 'A test company for demonstrating the AWS readiness platform functionality',
  foundedYear: 2020,
  employeeCount: 25,
  annualRevenue: 500000
};

const mockContactInfo = {
  primaryEmail: 'admin@testcompany.com',
  businessPhone: '+1-555-123-4567',
  businessAddress: {
    street: '123 Business St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'US'
  },
  billingAddress: {
    street: '123 Business St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'US'
  },
  contactPerson: {
    firstName: 'John',
    lastName: 'Doe',
    title: 'CEO',
    email: 'john@testcompany.com',
    phone: '+1-555-123-4567'
  }
};

const mockPaymentMethod = {
  id: 'pm_123',
  type: 'business_credit',
  last4: '4242',
  brand: 'visa',
  isVerified: true,
  riskScore: 15,
  issuerCountry: 'US'
};

const mockDocuments = [
  {
    id: 'doc_1',
    type: 'business_license',
    fileName: 'business_license.pdf',
    uploadDate: new Date(),
    status: 'verified'
  },
  {
    id: 'doc_2',
    type: 'tax_document',
    fileName: 'tax_document.pdf',
    uploadDate: new Date(),
    status: 'verified'
  }
];

const mockRiskFactors = [];

console.log('Testing AWS Account Readiness Scoring System...\n');

try {
  const score = calculateReadinessScore(
    mockBusinessProfile,
    mockContactInfo,
    mockPaymentMethod,
    mockDocuments,
    mockRiskFactors
  );

  console.log('✅ Scoring calculation successful!');
  console.log('\n📊 Results:');
  console.log(`Overall Score: ${Math.round(score.overall * 100)}%`);
  console.log('\n📋 Category Breakdown:');
  Object.entries(score.categories).forEach(([category, value]) => {
    console.log(`  ${category}: ${Math.round(value * 100)}%`);
  });
  
  if (score.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    score.recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
  }

  console.log('\n🎉 Test completed successfully!');
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}