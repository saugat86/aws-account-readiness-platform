export interface BusinessProfile {
  id: string;
  companyName: string;
  businessType: 'corporation' | 'llc' | 'partnership' | 'sole_proprietorship';
  taxId: string;
  registrationNumber: string;
  industry: string;
  website: string;
  description: string;
  foundedYear: number;
  employeeCount: number;
  annualRevenue?: number;
}

export interface ContactInformation {
  primaryEmail: string;
  businessPhone: string;
  businessAddress: Address;
  billingAddress: Address;
  contactPerson: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
  };
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  id: string;
  type: 'business_credit' | 'business_debit' | 'prepaid' | 'personal';
  last4: string;
  brand: string;
  isVerified: boolean;
  riskScore: number;
  issuerCountry: string;
}

export interface Document {
  id: string;
  type: 'business_license' | 'tax_document' | 'registration' | 'identity' | 'utility_bill';
  fileName: string;
  uploadDate: Date;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
}

export interface ReadinessScore {
  overall: number;
  categories: {
    businessProfile: number;
    documentation: number;
    paymentMethod: number;
    contactInfo: number;
    riskFactors: number;
  };
  recommendations: string[];
}

export interface RiskFactor {
  type: 'vpn_usage' | 'geographic_mismatch' | 'weak_payment' | 'incomplete_profile' | 'free_email';
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
}

export interface AppealCase {
  id: string;
  accountId: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  suspensionReason: string;
  appealLetter: string;
  supportingDocuments: Document[];
  submissionDate?: Date;
  responseDate?: Date;
  awsResponse?: string;
}