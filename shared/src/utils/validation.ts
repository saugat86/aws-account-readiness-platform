/**
 * Enhanced email validation with RFC 5322 compliance
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;

  // More comprehensive email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) return false;

  // Additional checks
  const [localPart, domain] = email.split('@');
  if (localPart.length > 64) return false; // Local part max length
  if (domain.length > 255) return false; // Domain max length
  if (email.length > 320) return false; // Total max length

  return true;
};

/**
 * Validate business email (not from free providers)
 */
export const validateBusinessEmail = (email: string): boolean => {
  if (!validateEmail(email)) return false;

  const freeEmailProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'aol.com', 'icloud.com', 'protonmail.com', 'mail.com',
    'yandex.com', 'zoho.com', 'inbox.com', 'gmx.com'
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;

  return !freeEmailProviders.includes(domain);
};

/**
 * Enhanced phone validation with international format support
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;

  // Remove common separators
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');

  // Support international format (+country code) and US format
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,14}$/;

  return phoneRegex.test(cleaned) && cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Enhanced tax ID validation with multi-country support
 */
export const validateTaxId = (taxId: string, country: string = 'US'): boolean => {
  if (!taxId || typeof taxId !== 'string') return false;

  const cleaned = taxId.trim();

  switch (country.toUpperCase()) {
    case 'US':
      // EIN format: XX-XXXXXXX or Social Security Number: XXX-XX-XXXX
      const einRegex = /^\d{2}-\d{7}$/;
      const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
      return einRegex.test(cleaned) || ssnRegex.test(cleaned);

    case 'CA':
      // Canadian Business Number: 9 digits
      const cbnRegex = /^\d{9}$/;
      return cbnRegex.test(cleaned.replace(/[\s\-]/g, ''));

    case 'GB':
      // UK VAT number: GB followed by 9 or 12 digits
      const ukVatRegex = /^GB\d{9}$|^GB\d{12}$/;
      return ukVatRegex.test(cleaned.replace(/\s/g, ''));

    default:
      // Generic validation: at least 5 characters
      return cleaned.length >= 5 && cleaned.length <= 20;
  }
};

/**
 * Enhanced website validation
 */
export const validateWebsite = (website: string): boolean => {
  if (!website || typeof website !== 'string') return false;

  try {
    const url = new URL(website);

    // Only allow http and https
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

    // Must have a valid hostname
    if (!url.hostname || url.hostname.length < 3) return false;

    // Must have at least one dot in hostname (e.g., example.com)
    if (!url.hostname.includes('.')) return false;

    // Hostname should not be localhost or IP address for business websites
    if (url.hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(url.hostname)) return false;

    return true;
  } catch {
    return false;
  }
};

/**
 * Validate postal/ZIP code
 */
export const validateZipCode = (zipCode: string, country: string = 'US'): boolean => {
  if (!zipCode || typeof zipCode !== 'string') return false;

  const cleaned = zipCode.trim();

  switch (country.toUpperCase()) {
    case 'US':
      // US ZIP: 5 digits or ZIP+4 format
      return /^\d{5}(-\d{4})?$/.test(cleaned);

    case 'CA':
      // Canadian postal code: A1A 1A1
      return /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(cleaned);

    case 'GB':
      // UK postcode
      return /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i.test(cleaned);

    default:
      // Generic: 3-10 alphanumeric characters
      return /^[A-Z0-9\s\-]{3,10}$/i.test(cleaned);
  }
};

/**
 * Validate company registration number
 */
export const validateRegistrationNumber = (regNumber: string, country: string = 'US'): boolean => {
  if (!regNumber || typeof regNumber !== 'string') return false;

  const cleaned = regNumber.trim();

  // Generic validation: 5-20 alphanumeric characters
  return /^[A-Z0-9\-]{5,20}$/i.test(cleaned);
};