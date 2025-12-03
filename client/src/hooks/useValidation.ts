import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  message?: string;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string;
}

export const useValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback((data: Record<string, any>): boolean => {
    const newErrors: ValidationErrors = {};

    Object.keys(rules).forEach(field => {
      const value = data[field];
      const rule = rules[field];

      // Required validation
      if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[field] = rule.message || `${field} is required`;
        return;
      }

      // Skip other validations if value is empty and not required
      if (!value || (typeof value === 'string' && !value.trim())) {
        return;
      }

      // Min length validation
      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        newErrors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`;
        return;
      }

      // Max length validation
      if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
        newErrors[field] = rule.message || `${field} must be no more than ${rule.maxLength} characters`;
        return;
      }

      // Pattern validation
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        newErrors[field] = rule.message || `${field} format is invalid`;
        return;
      }

      // Custom validation
      if (rule.custom) {
        const customError = rule.custom(value);
        if (customError) {
          newErrors[field] = customError;
          return;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [rules]);

  const validateField = useCallback((field: string, value: any): boolean => {
    const rule = rules[field];
    if (!rule) return true;

    let error: string | null = null;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      error = rule.message || `${field} is required`;
    }
    // Min length validation
    else if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      error = rule.message || `${field} must be at least ${rule.minLength} characters`;
    }
    // Max length validation
    else if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      error = rule.message || `${field} must be no more than ${rule.maxLength} characters`;
    }
    // Pattern validation
    else if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      error = rule.message || `${field} format is invalid`;
    }
    // Custom validation
    else if (rule.custom) {
      error = rule.custom(value);
    }

    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));

    return !error;
  }, [rules]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  }, []);

  return {
    errors,
    validate,
    validateField,
    clearErrors,
    clearFieldError
  };
};
