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
      <header 
        className="px-6 py-4 border-b border-border bg-card"
        role="banner"
        aria-label="OneLink application header"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col items-center flex-1">
            <h1 
              className="text-2xl font-bold text-foreground"
              id="app-title"
            >
              OneLink
            </h1>
            <p 
              className="text-muted-foreground text-sm"
              aria-describedby="app-title"
            >
              Create your personal link hub
            </p>
          </div>
          <nav 
            className="flex items-center"
            aria-label="Theme options"
          >
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Main Content - Column Layout */}
      <main 
        id="main-content"
        className="max-w-6xl mx-auto px-6 py-8"
        role="main"
        aria-label="OneLink editor interface"
      >
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Editors */}
          <section 
            className="space-y-6"
            aria-label="Profile and links editing"
          >
            {/* Profile Editor */}
            <section aria-labelledby="profile-section-title">
              <h2 id="profile-section-title" className="sr-only">
                Profile Editor
              </h2>
              <ProfileEditor profile={profile} setProfile={setProfile} />
            </section>
            
            {/* Links Editor */}
            <section aria-labelledby="links-section-title">
              <h2 id="links-section-title" className="sr-only">
                Links Editor
              </h2>
              <LinksEditor 
                socialLinks={socialLinks} 
                setSocialLinks={setSocialLinks}
                customLinks={customLinks}
                setCustomLinks={setCustomLinks}
              />
            </section>
          </section>

          {/* Right Column: Preview */}
          <aside 
            className="space-y-6"
            aria-label="Mobile preview of your page"
          >
            <MobilePreview 
              profile={profile} 
              socialLinks={socialLinks}
              customLinks={customLinks}
            />
          </aside>
        </div>

        {/* Action Buttons */}
        <section 
          className="mt-8"
          aria-labelledby="actions-section-title"
        >
          <h2 id="actions-section-title" className="sr-only">
            Page Actions
          </h2>
          <ActionButtons 
            profile={profile} 
            socialLinks={socialLinks}
            customLinks={customLinks}
          />
        </section>
      </main>
    </div>
  );
}
