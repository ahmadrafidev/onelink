'use client';

import { useState } from 'react';

import { ProfileEditor } from '@/components/profile-editor';
import { LinksEditor } from '@/components/links-editor';
import { MobilePreview } from '@/components/mobile-preview';
import { ActionButtons } from '@/components/action-buttons';
import { ThemeToggle } from '@/components/theme-toggle';

import { createInitialSocialLinks, DEFAULT_PROFILE, APP_NAME, APP_DESCRIPTION } from '@/lib/constants';
import type { Profile, SocialLink, CustomLink } from '@/lib/types';

export default function Home() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(createInitialSocialLinks());

  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header 
        className="px-6 py-2 md:py-6" 
        role="banner"
        aria-label="OneLink application header"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <div className="flex items-center gap-3">
            <h1 
              className="text-xl font-semibold text-foreground tracking-tight"
              id="app-title"
            >
              {APP_NAME}
            </h1>
            <div className="h-4 w-px bg-border" />
            <p 
              className="text-muted-foreground text-sm font-medium"
              aria-describedby="app-title"
            >
              {APP_DESCRIPTION}
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

      {/* Main Content  */}
      <main 
        id="main-content"
        className="max-w-6xl mx-auto px-6 py-2 md:py-4"
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
