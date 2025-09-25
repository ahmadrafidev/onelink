'use client';

import { useState, useRef } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { MOCK_BASE_URL } from '@/lib/constants';
import type { ActionButtonsProps } from '@/lib/types';
import {
  Zap,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Upload,
  Eye,
  Share2,
  Link,
  Loader2,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function ActionButtons({
  profile,
  socialLinks,
  customLinks
}: ActionButtonsProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isShortening, setIsShortening] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const activeSocialLinks = socialLinks.filter(link => link.isActive && link.url);
  const activeCustomLinks = customLinks.filter(link => link.isActive && link.url && link.title);
  const totalActiveLinks = activeSocialLinks.length + activeCustomLinks.length;
  const isReadyToPublish = profile.name && totalActiveLinks > 0;

  const handlePublish = async () => {
    if (!isReadyToPublish) {
      toast.error('Please add your name and at least one link before publishing.');
      return;
    }

    if (isPublishing) return;

    setIsPublishing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock URL
    const username = profile.name.toLowerCase().replace(/\s+/g, '');
    const mockUrl = `${MOCK_BASE_URL}/${username}`;
    setPublishedUrl(mockUrl);
    setIsPublishing(false);
    
    // Show success notification
    toast.success('Your page has been published successfully!');
  };

  const handleShorten = async () => {
    if (!publishedUrl) {
      toast.error('Please publish your page first before shortening the URL.');
      return;
    }

    if (isShortening) return;

    setIsShortening(true);
    
    // Simulate URL shortening
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const shortUrl = `https://1lnk.app/${Math.random().toString(36).substr(2, 6)}`;
    navigator.clipboard.writeText(shortUrl);
    setIsShortening(false);
    
    // Show success message
    toast.success(`Short URL copied to clipboard: ${shortUrl}`);
  };

  const handleCopyLink = async () => {
    if (!publishedUrl) return;

    try {
      await navigator.clipboard.writeText(publishedUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link to clipboard');
    }
  };

  const handleNativeShare = async () => {
    if (!publishedUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name}'s Links`,
          text: profile.bio || `Check out ${profile.name}'s links`,
          url: publishedUrl,
        });
        setIsShareOpen(false);
      } catch (error) {
        toast.error('Failed to share');
      }
    } else {
      toast.info('Native sharing not supported on this device');
    }
  };

  const handleSocialShare = (platform: string) => {
    if (!publishedUrl) return;

    const text = encodeURIComponent(profile.bio || `Check out ${profile.name}'s links`);
    const url = encodeURIComponent(publishedUrl);
    const title = encodeURIComponent(`${profile.name}'s Links`);

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      setIsShareOpen(false);
    }
  };

  const handlePreview = () => {
    if (!isReadyToPublish) {
      toast.error('Please add your name and at least one link before previewing.');
      return;
    }

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
          <div 
            className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center"
            aria-hidden="true"
          >
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Message */}
        {!isReadyToPublish && (
          <Alert role="status" aria-live="polite">
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            <AlertTitle>Almost ready!</AlertTitle>
            <AlertDescription id="publish-requirements">
              Add your name and at least one link to publish your page.
            </AlertDescription>
          </Alert>
        )}

        {/* Published URL */}
        {publishedUrl && (
          <Alert role="status" aria-live="polite">
            <CheckCircle className="w-4 h-4" aria-hidden="true" />
            <AlertTitle>Published successfully!</AlertTitle>
            <AlertDescription>
              Your page is live at:{' '}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(publishedUrl);
                  toast.info('URL copied to clipboard!');
                }}
                className={cn(
                  "h-auto p-1 font-mono text-xs hover:bg-muted",
                  "transition-all duration-150 ease-out transform",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "motion-reduce:transform-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
                )}
                aria-label={`Copy URL ${publishedUrl} to clipboard`}
              >
                {publishedUrl}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons Grid */}
        <div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          role="group"
          aria-label="Main action buttons for publishing and managing your OneLink page"
        >
          {/* Publish Button */}
          <Button
            onClick={handlePublish}
            className={cn(
              "transition-all duration-150 ease-out transform",
              "hover:scale-[1.02] active:scale-[0.98]",
              "motion-reduce:transform-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
            )}
            aria-label="Publish your OneLink page"
            aria-busy={isPublishing}
            aria-describedby={!isReadyToPublish ? "publish-requirements" : undefined}
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span className="sr-only" aria-live="polite">Publishing in progress</span>
                Publishing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" aria-hidden="true" />
                Publish
              </>
            )}
          </Button>

          {/* Preview Button */}
          <Button
            onClick={handlePreview}
            className={cn(
              "transition-all duration-150 ease-out transform",
              "hover:scale-[1.02] active:scale-[0.98]",
              "motion-reduce:transform-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
            )}
            aria-label="Preview your OneLink page in a new tab"
            aria-describedby={!isReadyToPublish ? "publish-requirements" : undefined}
          >
            <Eye className="w-4 h-4" aria-hidden="true" />
            Preview
          </Button>

          {/* Share Button */}
          <Popover open={isShareOpen} onOpenChange={setIsShareOpen}>
            <PopoverTrigger asChild>
              <Button
                onClick={(e) => {
                  if (!publishedUrl) {
                    e.preventDefault();
                    toast.error('Please publish your page first before sharing.');
                    return;
                  }
                }}
                className={cn(
                  "transition-all duration-150 ease-out transform",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "motion-reduce:transform-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
                )}
                aria-label={publishedUrl ? "Share your published OneLink page" : "Share page (requires publishing first)"}
                aria-describedby={!publishedUrl ? "share-requirements" : undefined}
                disabled={!publishedUrl}
              >
                <Share2 className="w-4 h-4" aria-hidden="true" />
                Share
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80"
              align="start"
              side="top"
              sideOffset={8}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Share your page</h4>
                  <p className="text-sm text-muted-foreground">
                    Share your OneLink page with others
                  </p>
                </div>

                {/* URL Input and Copy */}
                <div className="space-y-2">
                  <label htmlFor="share-url" className="text-sm font-medium">
                    Your link
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      id="share-url"
                      value={publishedUrl || ''}
                      readOnly
                      className="flex-1 text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={handleCopyLink}
                      className="shrink-0"
                      aria-label="Copy link to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Social Sharing Buttons */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Share on social media</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialShare('twitter')}
                      className="justify-start"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialShare('facebook')}
                      className="justify-start"
                    >
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialShare('linkedin')}
                      className="justify-start"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialShare('whatsapp')}
                      className="justify-start"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>

                {/* Native Share */}
                {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNativeShare}
                    className="w-full justify-start"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    More sharing options
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Shortener Button */}
          <Button
            onClick={handleShorten}
            disabled={!publishedUrl}
            className={cn(
              "transition-all duration-150 ease-out transform",
              "hover:scale-[1.02] active:scale-[0.98]",
              "motion-reduce:transform-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
            )}
            aria-label={publishedUrl ? "Create a shortened URL and copy to clipboard" : "Shorten URL (requires publishing first)"}
            aria-busy={isShortening}
            aria-describedby={!publishedUrl ? "shorten-requirements" : undefined}
          >
            {isShortening ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span className="sr-only" aria-live="polite">Shortening URL in progress</span>
                Shortening...
              </>
            ) : (
              <>
                <Link className="w-4 h-4" aria-hidden="true" />
                Shorten
              </>
            )}
          </Button>
        </div>


        {/* Hidden requirement messages for screen readers */}
        <div className="sr-only">
          <div id="share-requirements">
            To share your page, you must first publish it by clicking the Publish button.
          </div>
          <div id="shorten-requirements">
            To create a shortened URL, you must first publish your page by clicking the Publish button.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
