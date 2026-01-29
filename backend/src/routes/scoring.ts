import { Router } from 'express';
import { calculateReadinessScore } from '@aws-readiness/shared';
import { BusinessProfile, ContactInformation, PaymentMethod, Document, RiskFactor } from '@aws-readiness/shared';
import { validateScoringRequest, validateRiskAnalysisRequest } from '../middleware/validation';
import { cacheScoring } from '../middleware/cache';

const router = Router();

// Calculate readiness score for a business profile
router.post('/calculate', cacheScoring, validateScoringRequest, async (req, res) => {
  try {
    const { businessProfile, contactInfo, paymentMethod, documents = [], riskFactors = [] } = req.body;

    // Validate required fields
    if (!businessProfile || !contactInfo || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: businessProfile, contactInfo, and paymentMethod are required'
      });
    }

    // Use shared scoring utility for consistency
    const score = calculateReadinessScore(
      businessProfile as BusinessProfile,
      contactInfo as ContactInformation,
      paymentMethod as PaymentMethod,
      documents as Document[],
      riskFactors as RiskFactor[]
    );

    res.json({ success: true, data: score });
  } catch (error) {
    console.error('Error calculating readiness score:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      success: false,
      error: 'Failed to calculate score',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

// Get risk factors for current profile
router.post('/risk-analysis', cacheScoring, validateRiskAnalysisRequest, async (req, res) => {
  try {
    const { businessProfile, contactInfo, paymentMethod } = req.body;

    // Validate required fields
    if (!businessProfile || !contactInfo) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: businessProfile and contactInfo are required'
      });
    }

    const riskFactors: RiskFactor[] = [];

    // Check for free email usage
    if (contactInfo.primaryEmail) {
      const domain = contactInfo.primaryEmail.split('@')[1];
      const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'protonmail.com'];
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
    if (paymentMethod) {
      if (paymentMethod.type === 'prepaid') {
        riskFactors.push({
          type: 'weak_payment',
          severity: 'high',
          description: 'Using prepaid card for business account',
          recommendation: 'Use a business credit or debit card instead'
        });
      } else if (paymentMethod.type === 'personal') {
        riskFactors.push({
          type: 'weak_payment',
          severity: 'low',
          description: 'Using personal card for business account',
          recommendation: 'Consider using a business credit card for better approval rates'
        });
      }
    }

    // Check profile completeness
    const requiredFields = ['companyName', 'businessType', 'taxId', 'website'];
    const missingFields = requiredFields.filter(field => !businessProfile[field]);
    if (missingFields.length > 0) {
      riskFactors.push({
        type: 'incomplete_profile',
        severity: missingFields.length > 2 ? 'high' : 'medium',
        description: `Missing required business information: ${missingFields.join(', ')}`,
        recommendation: 'Complete all required business profile fields'
      });
    }

    res.json({ success: true, data: riskFactors });
  } catch (error) {
    console.error('Error analyzing risk factors:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      success: false,
      error: 'Failed to analyze risk factors',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

export { router as scoringRoutes };