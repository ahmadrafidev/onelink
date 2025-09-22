import { z } from 'zod';
import {
  profileFormSchema,
  customLinkFormSchema,
  socialLinkFormSchema,
  sanitizeUrl,
} from '@/lib/schemas';
import type { Profile, SocialLink, CustomLink } from '@/lib/types';

/**
 * Real-time validation helpers for form inputs
 */

export const validateProfileField = (field: keyof Profile, value: string) => {
  try {
    const fieldSchema = profileFormSchema.shape[field as keyof typeof profileFormSchema.shape];
    if (fieldSchema) {
      fieldSchema.parse(value);
      return { isValid: true, error: null };
    }
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.issues[0]?.message || 'Invalid input' };
    }
    return { isValid: false, error: 'Validation error' };
  }
};

export const validateCustomLinkField = (field: keyof CustomLink, value: string) => {
  try {
    const fieldSchema = customLinkFormSchema.shape[field as keyof typeof customLinkFormSchema.shape];
    if (fieldSchema) {
      // Special handling for URL fields to show proper feedback
      if (field === 'url') {
        fieldSchema.parse(sanitizeUrl(value));
      } else {
        fieldSchema.parse(value);
      }
      return { isValid: true, error: null };
    }
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.issues[0]?.message || 'Invalid input' };
    }
    return { isValid: false, error: 'Validation error' };
  }
};

export const validateSocialLinkUrl = (url: string | undefined) => {
  try {
    if (!url) {
      socialLinkFormSchema.parse({ url: '' });
    } else {
      socialLinkFormSchema.parse({ url: sanitizeUrl(url) });
    }
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.issues[0]?.message || 'Invalid URL' };
    }
    return { isValid: false, error: 'Validation error' };
  }
};

/**
 * Batch validation functions for complete objects
 */

export const validateCompleteProfile = (profile: Partial<Profile>) => {
  const result = profileFormSchema.safeParse(profile);
  return {
    isValid: result.success,
    errors: result.success ? {} : result.error.flatten().fieldErrors,
    data: result.success ? result.data : null,
  };
};

export const validateCompleteCustomLink = (link: Partial<CustomLink>) => {
  // Sanitize URL before validation
  const sanitizedLink = {
    ...link,
    url: link.url ? sanitizeUrl(link.url) : '',
  };
  
  const result = customLinkFormSchema.safeParse(sanitizedLink);
  return {
    isValid: result.success,
    errors: result.success ? {} : result.error.flatten().fieldErrors,
    data: result.success ? result.data : null,
  };
};

/**
 * Form submission helpers
 */

export const prepareProfileForSubmission = (profile: Partial<Profile>): Profile | null => {
  const validation = validateCompleteProfile(profile);
  if (!validation.isValid || !validation.data) {
    return null;
  }
  
  return {
    name: validation.data.name.trim(),
    bio: validation.data.bio?.trim() || '',
    profileLink: profile.profileLink || '',
  };
};

export const prepareCustomLinkForSubmission = (link: Partial<CustomLink>): CustomLink | null => {
  const validation = validateCompleteCustomLink(link);
  if (!validation.isValid || !validation.data) {
    return null;
  }
  
  return {
    id: link.id || '',
    title: validation.data.title.trim(),
    url: sanitizeUrl(validation.data.url),
    isActive: link.isActive ?? true,
  };
};

/**
 * URL-specific validation utilities
 */

export const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return true; // Empty URLs are valid for optional fields
  
  try {
    const normalizedUrl = sanitizeUrl(url);
    const parsedUrl = new URL(normalizedUrl);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

export const formatUrlForDisplay = (url: string): string => {
  if (!url) return '';
  
  try {
    const normalizedUrl = sanitizeUrl(url);
    const parsedUrl = new URL(normalizedUrl);
    return parsedUrl.href;
  } catch {
    return url;
  }
};

/**
 * Error formatting utilities
 */

export const formatValidationError = (error: z.ZodError): Record<string, string> => {
  const formatted: Record<string, string> = {};
  
  error.issues.forEach((err) => {
    const path = err.path.join('.');
    formatted[path] = err.message;
  });
  
  return formatted;
};

export const getFieldError = (errors: Record<string, string[]>, fieldName: string): string | null => {
  const fieldErrors = errors[fieldName];
  return fieldErrors && fieldErrors.length > 0 ? fieldErrors[0] : null;
};
