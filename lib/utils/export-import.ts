import { validateAppState, validateExportData, sanitizeUrl } from '@/lib/schemas';
import type { AppState, ExportData, Profile, SocialLink, CustomLink } from '@/lib/types';

/**
 * Export utilities with validation
 */

export const exportAppData = (appState: AppState): string => {
  // Validate the app state before export
  const validation = validateAppState(appState);
  if (!validation.success) {
    throw new Error(`Invalid app state: ${validation.error.message}`);
  }

  const exportData: ExportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    data: validation.data,
  };

  return JSON.stringify(exportData, null, 2);
};

export const downloadAppData = (appState: AppState, filename?: string) => {
  try {
    const jsonString = exportAppData(appState);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `onelink-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return { success: true, message: 'Data exported successfully' };
  } catch (error) {
    console.error('Export error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Export failed' 
    };
  }
};

/**
 * Import utilities with validation
 */

export const importAppData = (jsonString: string): { success: true; data: AppState } | { success: false; error: string } => {
  try {
    const parsedData = JSON.parse(jsonString);
    
    // Validate the export data structure
    const exportValidation = validateExportData(parsedData);
    if (!exportValidation.success) {
      return {
        success: false,
        error: `Invalid export format: ${exportValidation.error.issues.map(e => e.message).join(', ')}`
      };
    }

    // Additional validation of the app state
    const appStateValidation = validateAppState(exportValidation.data.data);
    if (!appStateValidation.success) {
      return {
        success: false,
        error: `Invalid app data: ${appStateValidation.error.issues.map(e => e.message).join(', ')}`
      };
    }

    // Sanitize URLs during import
    const sanitizedData = sanitizeImportedData(appStateValidation.data);
    
    return {
      success: true,
      data: sanitizedData
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse JSON'
    };
  }
};

export const uploadAndImportAppData = (file: File): Promise<{ success: true; data: AppState } | { success: false; error: string }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(importAppData(result));
      } else {
        resolve({ success: false, error: 'Failed to read file' });
      }
    };
    
    reader.onerror = () => {
      resolve({ success: false, error: 'Failed to read file' });
    };
    
    reader.readAsText(file);
  });
};

/**
 * Data sanitization helpers
 */

const sanitizeImportedData = (appState: AppState): AppState => {
  return {
    profile: sanitizeProfile(appState.profile),
    socialLinks: appState.socialLinks.map(sanitizeSocialLink),
    customLinks: appState.customLinks.map(sanitizeCustomLink),
  };
};

const sanitizeProfile = (profile: Profile): Profile => {
  return {
    name: profile.name.trim(),
    bio: profile.bio?.trim() || '',
    profileLink: profile.profileLink ? sanitizeUrl(profile.profileLink) : '',
  };
};

const sanitizeSocialLink = (link: SocialLink): SocialLink => {
  return {
    ...link,
    url: link.url ? sanitizeUrl(link.url) : '',
    platform: link.platform.trim(),
  };
};

const sanitizeCustomLink = (link: CustomLink): CustomLink => {
  return {
    ...link,
    title: link.title.trim(),
    url: link.url ? sanitizeUrl(link.url) : '',
  };
};

/**
 * Version migration utilities
 */

export const migrateAppData = (data: any): AppState | null => {
  // Handle legacy data formats if needed
  // For now, we just return validated data
  const validation = validateAppState(data);
  return validation.success ? validation.data : null;
};

/**
 * Data validation utilities for specific use cases
 */

export const validateBeforeExport = (appState: AppState): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check if profile has required fields
  if (!appState.profile.name.trim()) {
    errors.push('Profile name is required');
  }
  
  // Check for valid URLs in social links
  appState.socialLinks.forEach((link, index) => {
    if (link.isActive && link.url && !isValidUrlFormat(link.url)) {
      errors.push(`Invalid URL in ${link.platform} link`);
    }
  });
  
  // Check for valid URLs and titles in custom links
  appState.customLinks.forEach((link, index) => {
    if (link.isActive) {
      if (!link.title.trim()) {
        errors.push(`Custom link ${index + 1} is missing a title`);
      }
      if (!link.url || !isValidUrlFormat(link.url)) {
        errors.push(`Custom link "${link.title || index + 1}" has an invalid URL`);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const isValidUrlFormat = (url: string): boolean => {
  try {
    const normalizedUrl = sanitizeUrl(url);
    const parsedUrl = new URL(normalizedUrl);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};
