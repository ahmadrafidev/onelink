'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { Profile, SocialLink, CustomLink } from '../app/page';

interface ActionButtonsProps {
  profile: Profile;
  socialLinks: SocialLink[];
  customLinks: CustomLink[];
}

export function ActionButtons({ profile, socialLinks, customLinks }: ActionButtonsProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isShortening, setIsShortening] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const activeSocialLinks = socialLinks.filter(link => link.isActive && link.url);
  const activeCustomLinks = customLinks.filter(link => link.isActive && link.url && link.title);
  const totalActiveLinks = activeSocialLinks.length + activeCustomLinks.length;
  const isReadyToPublish = profile.name && totalActiveLinks > 0;

  const handlePublish = async () => {
    if (!isReadyToPublish) return;

    setIsPublishing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock URL
    const username = profile.name.toLowerCase().replace(/\s+/g, '');
    const mockUrl = `https://onelink.app/${username}`;
    setPublishedUrl(mockUrl);
    setIsPublishing(false);
  };

  const handleShorten = async () => {
    if (!publishedUrl) return;

    setIsShortening(true);
    
    // Simulate URL shortening
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const shortUrl = `https://1lnk.app/${Math.random().toString(36).substr(2, 6)}`;
    navigator.clipboard.writeText(shortUrl);
    setIsShortening(false);
    
    // Show success message
    alert(`Short URL copied to clipboard: ${shortUrl}`);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Create export data
    const exportData = {
      profile,
      socialLinks: activeSocialLinks,
      customLinks: activeCustomLinks,
      exportedAt: new Date().toISOString(),
    };
    
    // Create and download JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `onelink-${profile.name || 'export'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  const handleShare = async () => {
    if (!publishedUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name}'s Links`,
          text: profile.bio || `Check out ${profile.name}'s links`,
          url: publishedUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(publishedUrl);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(publishedUrl);
      alert('Link copied to clipboard!');
    }
  };

  const handlePreview = () => {
    // Open preview in new tab
    const previewData = encodeURIComponent(JSON.stringify({ 
      profile, 
      socialLinks: activeSocialLinks, 
      customLinks: activeCustomLinks 
    }));
    const previewUrl = `/preview?data=${previewData}`;
    window.open(previewUrl, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Message */}
        {!isReadyToPublish && (
          <Alert>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <AlertTitle>Almost ready!</AlertTitle>
            <AlertDescription>
              Add your name and at least one link to publish your page.
            </AlertDescription>
          </Alert>
        )}

        {/* Published URL */}
        {publishedUrl && (
          <Alert>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <AlertTitle>Published successfully!</AlertTitle>
            <AlertDescription>
              Your page is live at:{' '}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(publishedUrl)}
                className="h-auto p-1 font-mono text-xs hover:bg-muted"
              >
                {publishedUrl}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Publish Button */}
          <Button
            onClick={handlePublish}
            disabled={true}
            variant="secondary"
            className="transition-all duration-200 ease-out transform hover:scale-105"
          >
            {isPublishing ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Publishing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Publish
              </>
            )}
          </Button>

          {/* Preview Button */}
          <Button
            onClick={handlePreview}
            disabled={true}
            variant="outline"
            className="transition-all duration-200 ease-out transform hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </Button>

          {/* Share Button */}
          <Button
            onClick={handleShare}
            disabled={true}
            variant="secondary"
            className="transition-all duration-200 ease-out transform hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share
          </Button>

          {/* Shortener Button */}
          <Button
            onClick={handleShorten}
            disabled={true}
            variant="secondary"
            className="transition-all duration-200 ease-out transform hover:scale-105"
          >
            {isShortening ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Shortening...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Shorten
              </>
            )}
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="pt-4 border-t border-border">
          <div className="flex justify-center">
            <Button
              onClick={handleExport}
              disabled={true}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              {isExporting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Data
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
