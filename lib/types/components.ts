import type { Profile, SocialLink, CustomLink } from './core';

/**
 * Component prop interfaces
 */

export interface ProfileEditorProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

export interface LinksEditorProps {
  socialLinks: SocialLink[];
  setSocialLinks: (links: SocialLink[]) => void;
  customLinks: CustomLink[];
  setCustomLinks: (links: CustomLink[]) => void;
}

export interface MobilePreviewProps {
  profile: Profile;
  socialLinks: SocialLink[];
  customLinks: CustomLink[];
}

export interface ActionButtonsProps {
  profile: Profile;
  socialLinks: SocialLink[];
  customLinks: CustomLink[];
}
