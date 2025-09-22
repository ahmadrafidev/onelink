'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { LinksEditorProps, SocialLink, CustomLink } from '@/lib/types';

export function LinksEditor({ socialLinks, setSocialLinks, customLinks, setCustomLinks }: LinksEditorProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

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

  // Drag and Drop for Custom Links
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = customLinks.findIndex(link => link.id === draggedItem);
    const targetIndex = customLinks.findIndex(link => link.id === targetId);

    const newLinks = [...customLinks];
    const [draggedLink] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, draggedLink);

    setCustomLinks(newLinks);
    setDraggedItem(null);
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
                <div className="flex items-start gap-4">
                  {/* Platform Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <link.icon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3 min-w-0">
                    
                    {/* URL Input */}
                    <div className="space-y-1 relative">
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
                          <div id={`social-url-error-${link.id}`} className="text-xs text-destructive">
                            Please enter a valid URL
                          </div>
                        </>
                      )}
                    </div>
                    </div>
                    
                    {/* Active Toggle */}
                    <div className="flex items-center space-x-2 pt-1">
                      <Checkbox
                        id={`social-active-${link.id}`}
                        checked={link.isActive}
                        onCheckedChange={(checked) => updateSocialLink(link.id, 'isActive', checked)}
                      />
                      <Label
                        htmlFor={`social-active-${link.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        Active
                      </Label>
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
          <ScrollArea className="h-64">
            <div 
              className="space-y-4 pr-4"
              role="group"
              aria-label="Custom links list"
            >
              {customLinks.map((link, index) => (
                <div
                  key={link.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, link.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, link.id)}
                  className={cn(
                    "group p-4 border rounded-lg transition-all duration-200 ease-out",
                    draggedItem === link.id && "opacity-50 scale-95",
                    !draggedItem && "hover:shadow-sm hover:border-primary/50",
                    !link.isActive && "opacity-60"
                  )}
                  role="group"
                  aria-labelledby={`custom-link-title-${link.id}`}
                  aria-describedby={`custom-link-desc-${link.id}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Drag Handle */}
                    <button 
                      className="mt-2 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing transition-colors"
                      aria-label={`Drag to reorder link ${index + 1} of ${customLinks.length}`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-16h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
                      </svg>
                    </button>

                    <div className="flex-1 space-y-3">
                      {/* Link Title */}
                      <div className="space-y-1">
                        <Label htmlFor={`custom-title-${link.id}`} className="sr-only">
                          Link title
                        </Label>
                        <Input
                          id={`custom-title-${link.id}`}
                          type="text"
                          value={link.title}
                          onChange={(e) => updateCustomLink(link.id, 'title', e.target.value)}
                          placeholder="Link title"
                          className="text-sm"
                          aria-describedby={`custom-link-desc-${link.id}`}
                        />
                      </div>

                      {/* Link URL */}
                      <div className="space-y-1">
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
                            aria-describedby={link.url && !isValidUrl(link.url) ? `custom-url-error-${link.id}` : `custom-link-desc-${link.id}`}
                            aria-invalid={link.url && !isValidUrl(link.url) ? 'true' : 'false'}
                          />
                          {link.url && !isValidUrl(link.url) && (
                            <>
                              <div className="absolute right-3 top-2">
                                <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div id={`custom-url-error-${link.id}`} className="text-xs text-destructive">
                                Please enter a valid URL
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Hidden description for screen readers */}
                      <div id={`custom-link-desc-${link.id}`} className="sr-only">
                        Custom link {index + 1} of {customLinks.length}. 
                        {link.title && `Title: ${link.title}. `}
                        {link.url && `URL: ${link.url}. `}
                        {link.isActive ? 'Active' : 'Inactive'}.
                      </div>

                      {/* Link Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`custom-active-${link.id}`}
                            checked={link.isActive}
                            onCheckedChange={(checked) => updateCustomLink(link.id, 'isActive', checked)}
                          />
                          <Label
                            htmlFor={`custom-active-${link.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            Active
                          </Label>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomLink(link.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`Remove ${link.title || 'untitled'} link`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {customLinks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground" role="status">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <p>No custom links yet. Click "Add Link" to get started.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
