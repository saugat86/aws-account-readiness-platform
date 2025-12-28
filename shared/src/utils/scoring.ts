import { BusinessProfile, ContactInformation, PaymentMethod, Document, ReadinessScore, RiskFactor } from '../types';

export const calculateReadinessScore = (
  businessProfile: BusinessProfile,
  contactInfo: ContactInformation,
  paymentMethod: PaymentMethod,
  documents: Document[],
  riskFactors: RiskFactor[]
): ReadinessScore => {
  const businessProfileScore = calculateBusinessProfileScore(businessProfile);
  const documentationScore = calculateDocumentationScore(documents);
  const paymentMethodScore = calculatePaymentMethodScore(paymentMethod);
  const contactInfoScore = calculateContactInfoScore(contactInfo);
  const riskFactorScore = calculateRiskFactorScore(riskFactors);

  const overall = Math.round(
    (businessProfileScore * 0.25 +
     documentationScore * 0.25 +
     paymentMethodScore * 0.2 +
     contactInfoScore * 0.15 +
     riskFactorScore * 0.15) * 100
  ) / 100;

  return {
    overall,
    categories: {
      businessProfile: businessProfileScore,
      documentation: documentationScore,
      paymentMethod: paymentMethodScore,
      contactInfo: contactInfoScore,
      riskFactors: riskFactorScore
    },
    recommendations: generateRecommendations({
      businessProfile: businessProfileScore,
      documentation: documentationScore,
      paymentMethod: paymentMethodScore,
      contactInfo: contactInfoScore,
      riskFactors: riskFactorScore
    })
  };
};

const calculateBusinessProfileScore = (profile: BusinessProfile): number => {
  let score = 0;
  const maxScore = 10;

  if (profile.companyName) score += 1;
  if (profile.businessType) score += 1;
  if (profile.taxId) score += 2;
  if (profile.registrationNumber) score += 1;
  if (profile.industry) score += 1;
  if (profile.website) score += 1;
  if (profile.description && profile.description.length > 50) score += 1;
  if (profile.foundedYear && profile.foundedYear < new Date().getFullYear()) score += 1;
  if (profile.employeeCount > 0) score += 1;

  return score / maxScore;
};

const calculateDocumentationScore = (documents: Document[]): number => {
  const requiredTypes = ['business_license', 'tax_document', 'registration', 'identity'];
  const verifiedDocs = documents.filter(doc => doc.status === 'verified');
  
  let score = 0;
  requiredTypes.forEach(type => {
    if (verifiedDocs.some(doc => doc.type === type)) {
      score += 0.25;
    }
  });

  return score;
};

const calculatePaymentMethodScore = (paymentMethod: PaymentMethod): number => {
  let score = 0;

  if (paymentMethod.type === 'business_credit') score += 0.5;
  else if (paymentMethod.type === 'business_debit') score += 0.3;
  else if (paymentMethod.type === 'prepaid') score -= 0.2;

  if (paymentMethod.isVerified) score += 0.3;
  
  // Risk score (lower is better)
  score += (100 - paymentMethod.riskScore) / 100 * 0.2;

  return Math.max(0, Math.min(1, score));
};

const calculateContactInfoScore = (contactInfo: ContactInformation): number => {
  let score = 0;
  const maxScore = 8;

  if (contactInfo.primaryEmail) score += 1;
  if (contactInfo.businessPhone) score += 1;
  if (contactInfo.businessAddress.street) score += 1;
  if (contactInfo.billingAddress.street) score += 1;
  if (contactInfo.contactPerson.firstName) score += 1;
  if (contactInfo.contactPerson.lastName) score += 1;
  if (contactInfo.contactPerson.email) score += 1;
  if (contactInfo.contactPerson.phone) score += 1;

  return score / maxScore;
};

const calculateRiskFactorScore = (riskFactors: RiskFactor[]): number => {
  if (riskFactors.length === 0) return 1;

  let penalty = 0;
  riskFactors.forEach(factor => {
    switch (factor.severity) {
      case 'high': penalty += 0.3; break;
      case 'medium': penalty += 0.2; break;
      case 'low': penalty += 0.1; break;
    }
  });

  return Math.max(0, 1 - penalty);
};

const generateRecommendations = (scores: any): string[] => {
  const recommendations: string[] = [];

  if (scores.businessProfile < 0.8) {
    recommendations.push('Complete your business profile with all required information');
  }
  if (scores.documentation < 0.8) {
    recommendations.push('Upload and verify all required business documents');
  }
  if (scores.paymentMethod < 0.7) {
    recommendations.push('Use a business credit card for better verification success');
  }
  if (scores.contactInfo < 0.9) {
    recommendations.push('Ensure all contact information is complete and accurate');
  }
  if (scores.riskFactors < 0.8) {
    recommendations.push('Address identified risk factors before account creation');
  }

  return recommendations;
};