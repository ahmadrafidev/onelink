import type { LucideIcon } from 'lucide-react';

/**
 * Core data types for the OneLink application
 */

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
  icon: LucideIcon;
  placeholder: string;
}

export interface CustomLink {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
}

export interface Profile {
  name: string;
  bio: string;
  profileLink?: string;
}

export interface SocialPlatformConfig {
  id: string;
  platform: string;
  icon: LucideIcon;
  placeholder: string;
}
