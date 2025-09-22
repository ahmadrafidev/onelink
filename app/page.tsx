'use client';

import { useState } from 'react';
import { ProfileEditor } from '@/components/profile-editor';
import { LinksEditor } from '@/components/links-editor';
import { MobilePreview } from '@/components/mobile-preview';
import { ActionButtons } from '@/components/action-buttons';
import { ThemeToggle } from '@/components/theme-toggle';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
  icon: string;
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

export default function Home() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    bio: '',
    profileLink: '',
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: 'instagram', platform: 'Instagram', url: '', isActive: false, icon: '📷' },
    { id: 'twitter', platform: 'Twitter/X', url: '', isActive: false, icon: '🐦' },
    { id: 'facebook', platform: 'Facebook', url: '', isActive: false, icon: '📘' },
    { id: 'linkedin', platform: 'LinkedIn', url: '', isActive: false, icon: '💼' },
    { id: 'youtube', platform: 'YouTube', url: '', isActive: false, icon: '🎥' },
    { id: 'tiktok', platform: 'TikTok', url: '', isActive: false, icon: '🎵' },
    { id: 'github', platform: 'GitHub', url: '', isActive: false, icon: '💻' },
    { id: 'website', platform: 'Website', url: '', isActive: false, icon: '🌐' },
  ]);

  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col items-center flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              OneLink
            </h1>
            <p className="text-muted-foreground text-sm">
              Create your personal link hub
            </p>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content - Column Layout */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Editors */}
          <div className="space-y-6">
            {/* Profile Editor */}
            <ProfileEditor profile={profile} setProfile={setProfile} />
            
            {/* Links Editor */}
            <LinksEditor 
              socialLinks={socialLinks} 
              setSocialLinks={setSocialLinks}
              customLinks={customLinks}
              setCustomLinks={setCustomLinks}
            />
          </div>

          {/* Right Column: Preview */}
          <div className="space-y-6">
            <MobilePreview 
              profile={profile} 
              socialLinks={socialLinks}
              customLinks={customLinks}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8">
          <ActionButtons 
            profile={profile} 
            socialLinks={socialLinks}
            customLinks={customLinks}
          />
        </div>
      </main>
    </div>
  );
}
