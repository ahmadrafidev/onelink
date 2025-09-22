import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Music,
  Github,
  Globe,
} from 'lucide-react';
import type { SocialPlatformConfig } from '@/lib/types';

export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  { 
    id: 'instagram', 
    platform: 'Instagram', 
    icon: Instagram,
    placeholder: 'https://instagram.com/username'
  },
  { 
    id: 'twitter', 
    platform: 'Twitter/X', 
    icon: Twitter,
    placeholder: 'https://x.com/username'
  },
  { 
    id: 'facebook', 
    platform: 'Facebook', 
    icon: Facebook,
    placeholder: 'https://facebook.com/username'
  },
  { 
    id: 'linkedin', 
    platform: 'LinkedIn', 
    icon: Linkedin,
    placeholder: 'https://linkedin.com/in/username'
  },
  { 
    id: 'youtube', 
    platform: 'YouTube', 
    icon: Youtube,
    placeholder: 'https://youtube.com/@username'
  },
  { 
    id: 'tiktok', 
    platform: 'TikTok', 
    icon: Music,
    placeholder: 'https://tiktok.com/@username'
  },
  { 
    id: 'github', 
    platform: 'GitHub', 
    icon: Github,
    placeholder: 'https://github.com/username'
  },
  { 
    id: 'website', 
    platform: 'Website', 
    icon: Globe,
    placeholder: 'https://yourwebsite.com'
  },
];

/**
 * Creates the initial social links array for state management
 */
export const createInitialSocialLinks = () => {
  return SOCIAL_PLATFORMS.map(config => ({
    ...config,
    url: '',
    isActive: false,
  }));
};
