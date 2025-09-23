/**
 * Core data types for the OneLink application
 */

export type {
  Profile,
  SocialLink,
  CustomLink,
  SocialPlatformConfig,
  AppState,
  ProfileFormData,
  CustomLinkFormData,
  SocialLinkFormData,
} from '@/lib/schemas';

export {
  validateProfile,
  validateSocialLink,
  validateCustomLink,
  validateAppState,
  sanitizeUrl,
  generateId,
} from '@/lib/schemas';
