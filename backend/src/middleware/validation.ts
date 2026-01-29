import { Request, Response, NextFunction } from 'express';
import { validateEmail, validateBusinessEmail, validatePhone, validateTaxId, validateWebsite } from '@aws-readiness/shared';

export const validateScoringRequest = (req: Request, res: Response, next: NextFunction) => {
  const { businessProfile, contactInfo, paymentMethod } = req.body;

  const errors: string[] = [];

  // Validate business profile
  if (!businessProfile) {
    errors.push('businessProfile is required');
  } else {
    if (!businessProfile.companyName || businessProfile.companyName.trim().length < 2) {
      errors.push('Valid company name is required (minimum 2 characters)');
    }
    if (businessProfile.taxId && !validateTaxId(businessProfile.taxId)) {
      errors.push('Invalid tax ID format (expected XX-XXXXXXX for US)');
    }
    if (businessProfile.website && !validateWebsite(businessProfile.website)) {
      errors.push('Invalid website URL format');
    }
    if (businessProfile.foundedYear) {
      const currentYear = new Date().getFullYear();
      if (businessProfile.foundedYear < 1800 || businessProfile.foundedYear > currentYear) {
        errors.push(`Invalid founded year (must be between 1800 and ${currentYear})`);
      }
    }
  }

  // Validate contact information
  if (!contactInfo) {
    errors.push('contactInfo is required');
  } else {
    if (!contactInfo.primaryEmail || !validateEmail(contactInfo.primaryEmail)) {
      errors.push('Valid primary email is required');
    }
    if (contactInfo.businessPhone && !validatePhone(contactInfo.businessPhone)) {
      errors.push('Invalid business phone format');
    }
    if (contactInfo.contactPerson) {
      if (contactInfo.contactPerson.email && !validateEmail(contactInfo.contactPerson.email)) {
        errors.push('Invalid contact person email format');
      }
      if (contactInfo.contactPerson.phone && !validatePhone(contactInfo.contactPerson.phone)) {
        errors.push('Invalid contact person phone format');
      }
    }
  }

  // Validate payment method
  if (!paymentMethod) {
    errors.push('paymentMethod is required');
  } else {
    const validTypes = ['business_credit', 'business_debit', 'prepaid', 'personal'];
    if (!validTypes.includes(paymentMethod.type)) {
      errors.push(`Invalid payment method type (must be one of: ${validTypes.join(', ')})`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

export const validateRiskAnalysisRequest = (req: Request, res: Response, next: NextFunction) => {
  const { businessProfile, contactInfo } = req.body;

  const errors: string[] = [];

  if (!businessProfile) {
    errors.push('businessProfile is required');
  }

  if (!contactInfo) {
    errors.push('contactInfo is required');
  } else {
    if (!contactInfo.primaryEmail || !validateEmail(contactInfo.primaryEmail)) {
      errors.push('Valid primary email is required');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Request sanitization middleware
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    // Remove any potentially malicious scripts or HTML
    const sanitize = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      }
      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      }
      if (obj !== null && typeof obj === 'object') {
        const sanitized: any = {};
        for (const key in obj) {
          sanitized[key] = sanitize(obj[key]);
        }
        return sanitized;
      }
      return obj;
    };

    req.body = sanitize(req.body);
  }

  next();
};
