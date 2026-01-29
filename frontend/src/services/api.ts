import { BusinessProfile, ContactInformation, PaymentMethod, Document, RiskFactor, ReadinessScore } from '@aws-readiness/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string | string[];
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<T> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Request failed');
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async calculateScore(payload: {
    businessProfile: Partial<BusinessProfile>;
    contactInfo: Partial<ContactInformation>;
    paymentMethod: Partial<PaymentMethod>;
    documents?: Document[];
    riskFactors?: RiskFactor[];
  }): Promise<ReadinessScore> {
    return this.request<ReadinessScore>('/api/scoring/calculate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async analyzeRiskFactors(payload: {
    businessProfile: Partial<BusinessProfile>;
    contactInfo: Partial<ContactInformation>;
    paymentMethod?: Partial<PaymentMethod>;
  }): Promise<RiskFactor[]> {
    return this.request<RiskFactor[]>('/api/scoring/risk-analysis', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
