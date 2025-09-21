'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Profile, SocialLink, CustomLink } from '../app/page';

interface MobilePreviewProps {
  profile: Profile;
  socialLinks: SocialLink[];
  customLinks: CustomLink[];
}

export function MobilePreview({ profile, socialLinks, customLinks }: MobilePreviewProps) {
  const activeSocialLinks = socialLinks.filter(link => link.isActive && link.url);
  const activeCustomLinks = customLinks.filter(link => link.isActive && link.url && link.title);
  const allActiveLinks = [...activeSocialLinks, ...activeCustomLinks];

  const handleLinkClick = (url: string) => {
    // For preview, we'll just show an alert
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    alert(`Preview: Would navigate to ${formattedUrl}`);
  };

  return (
    <Card className="transition-all duration-200 ease-out hover:shadow-md sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-orange-600 dark:text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          Mobile Preview
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Phone Frame */}
        <div className="relative mx-auto w-64">
          {/* Phone Bezel */}
          <div className="bg-gray-900 rounded-[2.5rem] p-2">
            {/* Phone Screen */}
            <div className="w-full h-[500px] rounded-[2rem] overflow-hidden relative bg-white dark:bg-gray-900">
              {/* Status Bar */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-black bg-opacity-10 flex items-center justify-between px-6">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-current rounded-full opacity-60" />
                  <div className="w-1 h-1 bg-current rounded-full opacity-60" />
                  <div className="w-1 h-1 bg-current rounded-full opacity-60" />
                </div>
                <div className="text-xs font-medium opacity-60 text-gray-900 dark:text-white">
                  9:41
                </div>
                <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                  <svg className="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 17h20v2H2zm1.15-4.05L4 11.47l.85 1.48L6 12.21l1.15.74L8 11.47l.85 1.48L10 12.21l1.15.74L12 11.47l.85 1.48L14 12.21l1.15.74L16 11.47l.85 1.48L18 12.21l1.15.74L20 11.47l.85 1.48L22 12.21l-1.15-.74L20 10.53l-.85 1.48L18 11.27l-1.15-.74L16 11.47l-.85-1.48L14 10.73l-1.15.74L12 10.53l-.85 1.48L10 11.27l-1.15-.74L8 11.47l-.85-1.48L6 10.73l-1.15.74L4 10.53l-.85 1.48L2 11.27l1.15.74z"/>
                  </svg>
                  <svg className="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="pt-12 pb-8 px-6 h-full overflow-y-auto">
                <div className="flex flex-col items-center space-y-6">
                  {/* Profile Section */}
                  <div className="text-center">
                    {/* Name */}
                    <h1 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      {profile.name || 'Your Name'}
                    </h1>

                    {/* Bio */}
                    {profile.bio && (
                      <p className="text-sm opacity-80 leading-relaxed text-gray-700 dark:text-gray-300">
                        {profile.bio}
                      </p>
                    )}
                  </div>

                  {/* Links */}
                  <div className="w-full space-y-3 max-w-sm">
                    {allActiveLinks.length > 0 ? (
                      allActiveLinks.map((link, index) => (
                        <Button
                          key={link.id}
                          onClick={() => handleLinkClick(link.url)}
                          className="w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ease-out transform hover:scale-105 active:scale-95 bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                          variant="ghost"
                        >
                          <span className="flex items-center gap-2">
                            {'platform' in link && (
                              <span className="text-lg">{link.icon}</span>
                            )}
                            {'platform' in link ? link.platform : link.title}
                          </span>
                        </Button>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <svg
                          className="w-8 h-8 mx-auto mb-3 opacity-40 text-gray-500 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        <p className="text-xs opacity-60 text-gray-500 dark:text-gray-400">
                          Add some links to see them here
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-8">
                    <p className="text-xs opacity-50 text-center text-gray-500 dark:text-gray-400">
                      Made with OneLink
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Details */}
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              iPhone 15 Pro Preview
            </p>
          </div>
        </div>

        {/* Preview Stats */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold">
                {activeSocialLinks.length}
              </p>
              <p className="text-xs text-muted-foreground">
                Social
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {activeCustomLinks.length}
              </p>
              <p className="text-xs text-muted-foreground">
                Custom
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {profile.name ? '✓' : '✗'}
              </p>
              <p className="text-xs text-muted-foreground">
                Profile
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
