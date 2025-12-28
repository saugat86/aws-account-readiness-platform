import { Router } from 'express';

const router = Router();

// Enhanced scoring calculation with detailed recommendations
const calculateSimpleScore = (businessProfile: any, contactInfo: any, paymentMethod: any) => {
  let businessScore = 0;
  let contactScore = 0;
  let paymentScore = 0;
  const documentationScore = 0.5; // Mock - would be calculated from actual documents
  const riskScore = 1.0; // Mock - would be calculated from risk factors

  // Business profile scoring (0-1)
  const businessFields = ['companyName', 'businessType', 'taxId', 'website', 'industry', 'description'];
  const presentFields = businessFields.filter(field => businessProfile?.[field]);
  businessScore = presentFields.length / businessFields.length;

  // Contact info scoring (0-1)
  let contactPoints = 0;
  if (contactInfo?.primaryEmail) {
    contactPoints += 0.4;
    // Check if it's a business email (not free provider)
    const domain = contactInfo.primaryEmail.split('@')[1]?.toLowerCase();
    const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    if (!freeProviders.includes(domain)) {
      contactPoints += 0.3;
    }
  }
  if (contactInfo?.businessPhone) contactPoints += 0.3;
  contactScore = Math.min(1, contactPoints);

  // Payment method scoring (0-1)
  switch (paymentMethod?.type) {
    case 'business_credit': paymentScore = 1.0; break;
    case 'business_debit': paymentScore = 0.8; break;
    case 'personal': paymentScore = 0.5; break;
    case 'prepaid': paymentScore = 0.2; break;
    default: paymentScore = 0.3;
  }

  // Calculate overall score with weights
  const overall = (
    businessScore * 0.25 +
    contactScore * 0.20 +
    paymentScore * 0.25 +
    documentationScore * 0.20 +
    riskScore * 0.10
  );

  // Generate detailed recommendations
  const recommendations = [];
  
  if (businessScore < 0.9) {
    const missingFields = businessFields.filter(field => !businessProfile?.[field]);
    if (missingFields.includes('industry')) {
      recommendations.push('Add your business industry classification for better verification');
    }
    if (missingFields.includes('description')) {
      recommendations.push('Provide a detailed business description (minimum 50 words)');
    }
    if (missingFields.length > 2) {
      recommendations.push(`Complete missing business fields: ${missingFields.join(', ')}`);
    }
  }

  if (contactScore < 0.9) {
    if (contactInfo?.primaryEmail) {
      const domain = contactInfo.primaryEmail.split('@')[1]?.toLowerCase();
      const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      if (freeProviders.includes(domain)) {
        recommendations.push('Use a professional business email address with your own domain');
      }
    } else {
      recommendations.push('Add a primary business email address');
    }
    if (!contactInfo?.businessPhone) {
      recommendations.push('Add a dedicated business phone number');
    }
  }

  if (paymentScore < 0.8) {
    if (paymentMethod?.type === 'prepaid') {
      recommendations.push('Replace prepaid card with a business credit or debit card');
    } else if (paymentMethod?.type === 'personal') {
      recommendations.push('Use a business credit card for higher approval rates');
    } else if (!paymentMethod?.type) {
      recommendations.push('Add a business credit card as your payment method');
    }
  }

  if (documentationScore < 0.8) {
    recommendations.push('Upload and verify required business documents (license, tax documents, registration)');
  }

  // Add proactive recommendations even for good scores
  if (overall >= 0.8 && recommendations.length === 0) {
    recommendations.push('Your profile looks strong! Consider uploading additional verification documents to maximize approval chances');
    if (businessScore < 1.0) {
      recommendations.push('Add business description and industry details for a complete profile');
    }
  }

  return {
    overall: Math.round(overall * 100) / 100,
    categories: {
      businessProfile: Math.round(businessScore * 100) / 100,
      documentation: documentationScore,
      paymentMethod: Math.round(paymentScore * 100) / 100,
      contactInfo: Math.round(contactScore * 100) / 100,
      riskFactors: riskScore
    },
    recommendations
  };
};

// Calculate readiness score for a business profile
router.post('/calculate', async (req, res) => {
  try {
    const { businessProfile, contactInfo, paymentMethod } = req.body;
    
    console.log('Received scoring request:', { businessProfile, contactInfo, paymentMethod });
    
    const score = calculateSimpleScore(businessProfile, contactInfo, paymentMethod);

    console.log('Calculated score:', score);
    res.json({ success: true, data: score });
  } catch (error) {
    console.error('Error calculating readiness score:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ success: false, error: 'Failed to calculate score', details: errorMessage });
  }
});

// Get risk factors for current profile
router.post('/risk-analysis', async (req, res) => {
  try {
    const { businessProfile, contactInfo, paymentMethod } = req.body;
    
    const riskFactors = [];
    
    // Check for free email usage
    if (contactInfo.primaryEmail) {
      const domain = contactInfo.primaryEmail.split('@')[1];
      const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      if (freeProviders.includes(domain.toLowerCase())) {
        riskFactors.push({
          type: 'free_email',
          severity: 'medium',
          description: 'Using free email provider for business account',
          recommendation: 'Use a professional email address with your business domain'
        });
      }
    }
    
    // Check payment method risk
    if (paymentMethod && paymentMethod.type === 'prepaid') {
      riskFactors.push({
        type: 'weak_payment',
        severity: 'high',
        description: 'Using prepaid card for business account',
        recommendation: 'Use a business credit or debit card instead'
      });
    }
    
    // Check profile completeness
    const requiredFields = ['companyName', 'businessType', 'taxId', 'website'];
    const missingFields = requiredFields.filter(field => !businessProfile[field]);
    if (missingFields.length > 0) {
      riskFactors.push({
        type: 'incomplete_profile',
        severity: 'medium',
        description: `Missing required business information: ${missingFields.join(', ')}`,
        recommendation: 'Complete all required business profile fields'
      });
    }

    res.json({ success: true, data: riskFactors });
  } catch (error) {
    console.error('Error analyzing risk factors:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze risk factors' });
  }
});

export { router as scoringRoutes };