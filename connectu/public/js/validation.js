const sanitizeNumeric = (value = '', maxLength = 4) => {
  const digitsOnly = value.replace(/[^0-9]/g, '');
  return digitsOnly.slice(0, maxLength);
};

export const clampDayValue = (value) => {
  const digits = sanitizeNumeric(value, 2);
  if (!digits) return '';
  const numeric = Math.min(Math.max(Number(digits), 1), 31);
  return String(numeric).padStart(Math.min(digits.length, 2), '0');
};

export const clampYearValue = (value) => sanitizeNumeric(value, 4);

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const validateSignupPayload = (payload) => {
  const requiredFields = ['firstName', 'lastName', 'email'];
  for (const field of requiredFields) {
    if (!payload[field]) {
      return {
        valid: false,
        message: 'Please fill out all required fields before submitting.',
      };
    }
  }

  if (!payload.school) {
    return { valid: false, message: 'Please choose or enter your university.' };
  }

  if (!isValidEmail(payload.email)) {
    return { valid: false, message: 'Enter a valid school email address.' };
  }

  const month = Number(payload.dobMonth);
  const day = Number(payload.dobDay);
  const year = Number(payload.dobYear);

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return { valid: false, message: 'Select a valid month for your birthday.' };
  }

  if (!Number.isInteger(year) || payload.dobYear.length !== 4) {
    return { valid: false, message: 'Enter a 4-digit year for your birthday.' };
  }

  if (!Number.isInteger(day) || day < 1) {
    return { valid: false, message: 'Enter a valid day for your birthday.' };
  }

  const maxDay = new Date(year, month, 0).getDate();
  if (day > maxDay) {
    return {
      valid: false,
      message: `Day must be between 1 and ${maxDay} for the selected month.`,
    };
  }

  const dob = `${year.toString().padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  if (!payload.password || payload.password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }

  if (payload.password !== payload.confirmPassword) {
    return { valid: false, message: 'Passwords do not match' };
  }

  return {
    valid: true,
    data: {
      ...payload,
      dob,
    },
  };
};