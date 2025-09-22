import { z } from 'zod';

/**
 * URL validation schema with improved validation
 */
const urlSchema = z
  .string()
  .min(1, 'URL is required')
  .refine(
    (url) => {
      if (!url) return false;
      try {
        const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
        const parsedUrl = new URL(normalizedUrl);
        return ['http:', 'https:'].includes(parsedUrl.protocol);
      } catch {
        return false;
      }
    },
    { message: 'Please enter a valid URL' }
  );

/**
 * Optional URL schema for when URL is not required
 */
const optionalUrlSchema = z
  .string()
  .optional()
  .refine(
    (url) => {
      if (!url || url.trim() === '') return true;
      try {
        const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
        const parsedUrl = new URL(normalizedUrl);
        return ['http:', 'https:'].includes(parsedUrl.protocol);
      } catch {
        return false;
      }
    },
    { message: 'Please enter a valid URL' }
  );

/**
 * Profile schema with validation rules
 */
export const profileSchema = z.object({
  name: z
    .string()
    .min(1, 'Display name is required')
    .max(50, 'Display name must be 50 characters or less')
    .trim(),
  bio: z
    .string()
    .max(160, 'Bio must be 160 characters or less')
    .optional()
    .default(''),
  profileLink: optionalUrlSchema,
});

/**
 * Social link schema with platform-specific validation
 */
export const socialLinkSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  platform: z.string().min(1, 'Platform is required'),
  url: optionalUrlSchema,
  isActive: z.boolean().default(false),
  icon: z.any(), // LucideIcon type can't be validated at runtime
  placeholder: z.string().min(1, 'Placeholder is required'),
});

/**
 * Custom link schema with title and URL validation
 */
export const customLinkSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z
    .string()
    .min(1, 'Link title is required')
    .max(100, 'Link title must be 100 characters or less')
    .trim(),
  url: urlSchema,
  isActive: z.boolean().default(true),
});

/**
 * Social platform configuration schema
 */
export const socialPlatformConfigSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  platform: z.string().min(1, 'Platform name is required'),
  icon: z.any(), // LucideIcon type can't be validated at runtime
  placeholder: z.string().min(1, 'Placeholder is required'),
});

/**
 * Complete application state schema
 */
export const appStateSchema = z.object({
  profile: profileSchema,
  socialLinks: z.array(socialLinkSchema),
  customLinks: z.array(customLinkSchema),
});

/**
 * Form schemas for different editing contexts
 */
export const profileFormSchema = z.object({
  name: z.string().min(1, 'Display name is required').max(50, 'Display name must be 50 characters or less').trim(),
  bio: z.string().max(160, 'Bio must be 160 characters or less').default(''),
});

export const customLinkFormSchema = customLinkSchema.pick({
  title: true,
  url: true,
});

export const socialLinkFormSchema = z.object({
  url: optionalUrlSchema,
});

/**
 * Export/Import schema for data persistence
 */
export const exportDataSchema = z.object({
  version: z.string().default('1.0'),
  exportDate: z.string().datetime(),
  data: appStateSchema,
});

/**
 * Type inference from schemas
 */
export type Profile = z.infer<typeof profileSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type CustomLink = z.infer<typeof customLinkSchema>;
export type SocialPlatformConfig = z.infer<typeof socialPlatformConfigSchema>;
export type AppState = z.infer<typeof appStateSchema>;
export type ExportData = z.infer<typeof exportDataSchema>;

// Form types
export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type CustomLinkFormData = z.infer<typeof customLinkFormSchema>;
export type SocialLinkFormData = z.infer<typeof socialLinkFormSchema>;

/**
 * Validation utilities
 */
export const validateProfile = (data: unknown) => profileSchema.safeParse(data);
export const validateSocialLink = (data: unknown) => socialLinkSchema.safeParse(data);
export const validateCustomLink = (data: unknown) => customLinkSchema.safeParse(data);
export const validateAppState = (data: unknown) => appStateSchema.safeParse(data);
export const validateExportData = (data: unknown) => exportDataSchema.safeParse(data);

/**
 * Data sanitization helpers
 */
export const sanitizeUrl = (url: string): string => {
  if (!url || url.trim() === '') return '';
  const trimmedUrl = url.trim();
  return trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
