'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Link, Trash2 } from 'lucide-react';
import type { LinksEditorProps, SocialLink, CustomLink } from '@/lib/types';

export function LinksEditor({ socialLinks, setSocialLinks, customLinks, setCustomLinks }: LinksEditorProps) {
  // Social Links Functions
  const updateSocialLink = (id: string, field: keyof SocialLink, value: string | boolean) => {
    setSocialLinks(socialLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  // Custom Links Functions
  const addCustomLink = () => {
    const newLink: CustomLink = {
      id: Date.now().toString(),
      title: '',
      url: '',
      isActive: true,
    };
    setCustomLinks([...customLinks, newLink]);
  };

  const updateCustomLink = (id: string, field: keyof CustomLink, value: string | boolean) => {
    setCustomLinks(customLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const removeCustomLink = (id: string) => {
    setCustomLinks(customLinks.filter(link => link.id !== id));
  };


  const isValidUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Social Media Links */}
      <Card className="transition-all duration-200 ease-out hover:shadow-md">
        <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              className="w-4 h-4 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          Social Media Links
        </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4" role="group" aria-label="Social media links">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className={cn(
                  "p-4 border rounded-lg transition-all duration-200 ease-out focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                  !link.isActive && "opacity-60"
                )}
                role="group"
                aria-labelledby={`social-platform-${link.id}`}
              >
                <div className="flex items-center gap-4">
                  {/* Platform Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <link.icon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                  </div>
                  
                  {/* URL Input */}
                  <div className="flex-1 space-y-2 min-w-0">
                    {/* URL Input */}
                    <div className="relative">
                      <Label htmlFor={`social-url-${link.id}`} className="sr-only">
                        {link.platform} URL
                      </Label>
                      <Input
                        id={`social-url-${link.id}`}
                        type="url"
                        value={link.url}
                        onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                        placeholder={link.placeholder}
                        className={cn(
                          "text-sm",
                          link.url && !isValidUrl(link.url) && "border-destructive"
                        )}
                        aria-describedby={link.url && !isValidUrl(link.url) ? `social-url-error-${link.id}` : undefined}
                        aria-invalid={link.url && !isValidUrl(link.url) ? 'true' : 'false'}
                      />
                      {link.url && !isValidUrl(link.url) && (
                        <>
                          <div className="absolute right-3 top-2">
                            <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div id={`social-url-error-${link.id}`} className="text-xs text-destructive mt-1">
                            Please enter a valid URL
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Active Toggle - Just checkbox */}
                  <div className="flex-shrink-0">
                    <Checkbox
                      id={`social-active-${link.id}`}
                      checked={link.isActive}
                      onCheckedChange={(checked) => updateSocialLink(link.id, 'isActive', checked)}
                      aria-label={`Toggle ${link.platform}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Links */}
      <Card className="transition-all duration-200 ease-out hover:shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center"
                aria-hidden="true"
              >
                <svg
                  className="w-4 h-4 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              Custom Links
            </CardTitle>
            <Button 
              onClick={addCustomLink} 
              size="sm"
              aria-label="Add a new custom link"
            >
              Add Link
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4" role="group" aria-label="Custom links list">
            {customLinks.map((link) => (
              <div
                key={link.id}
                className={cn(
                  "p-4 border rounded-lg transition-all duration-200 ease-out focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                  !link.isActive && "opacity-60"
                )}
                role="group"
                aria-labelledby={`custom-link-title-${link.id}`}
              >
                <div className="flex items-center gap-4">
                  {/* Link Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Link className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                  </div>
                  
                  {/* Title & URL Input */}
                  <div className="flex-1 space-y-2 min-w-0">
                    {/* Title Input */}
                    <div className="relative">
                      <Label htmlFor={`custom-title-${link.id}`} className="sr-only">
                        Link title
                      </Label>
                      <Input
                        id={`custom-title-${link.id}`}
                        type="text"
                        value={link.title}
                        onChange={(e) => updateCustomLink(link.id, 'title', e.target.value)}
                        placeholder="Link title"
                        className="text-sm font-medium"
                      />
                    </div>

                    {/* URL Input */}
                    <div className="relative">
                      <Label htmlFor={`custom-url-${link.id}`} className="sr-only">
                        Link URL
                      </Label>
                      <Input
                        id={`custom-url-${link.id}`}
                        type="url"
                        value={link.url}
                        onChange={(e) => updateCustomLink(link.id, 'url', e.target.value)}
                        placeholder="https://example.com"
                        className={cn(
                          "text-sm",
                          link.url && !isValidUrl(link.url) && "border-destructive"
                        )}
                        aria-describedby={link.url && !isValidUrl(link.url) ? `custom-url-error-${link.id}` : undefined}
                        aria-invalid={link.url && !isValidUrl(link.url) ? 'true' : 'false'}
                      />
                      {link.url && !isValidUrl(link.url) && (
                        <>
                          <div className="absolute right-3 top-2">
                            <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div id={`custom-url-error-${link.id}`} className="text-xs text-destructive mt-1">
                            Please enter a valid URL
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Controls - Checkbox & Remove */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Checkbox
                      id={`custom-active-${link.id}`}
                      checked={link.isActive}
                      onCheckedChange={(checked) => updateCustomLink(link.id, 'isActive', checked)}
                      aria-label={`Toggle ${link.title || 'custom link'}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomLink(link.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      aria-label={`Remove ${link.title || 'untitled'} link`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

              {customLinks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground" role="status">
                <Link className="w-12 h-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
                <p>No custom links yet. Click "Add Link" to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
