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
  ExportData,
} from '@/lib/schemas';

export {
  validateProfile,
  validateSocialLink,
  validateCustomLink,
  validateAppState,
  validateExportData,
  sanitizeUrl,
  generateId,
} from '@/lib/schemas';
