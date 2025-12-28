export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateBusinessEmail = (email: string): boolean => {
  if (!validateEmail(email)) return false;
  
  const freeEmailProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
    'aol.com', 'icloud.com', 'protonmail.com'
  ];
  
  const domain = email.split('@')[1].toLowerCase();
  return !freeEmailProviders.includes(domain);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateTaxId = (taxId: string, country: string = 'US'): boolean => {
  if (country === 'US') {
    // EIN format: XX-XXXXXXX
    const einRegex = /^\d{2}-\d{7}$/;
    return einRegex.test(taxId);
  }
  return taxId.length > 0;
};

export const validateWebsite = (website: string): boolean => {
  try {
    const url = new URL(website);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};