'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Trash2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { cn } from '@/lib/utils';
import { customLinkFormSchema, sanitizeUrl, generateId } from '@/lib/schemas';
import { validateSocialLinkUrl, validateCustomLinkField } from '@/lib/utils/validation';
import type { LinksEditorProps, SocialLink, CustomLink, CustomLinkFormData } from '@/lib/types';

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
      id: generateId(),
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

  const getUrlValidation = (url: string | undefined) => {
    if (!url || url.trim() === '') return { isValid: true, error: null };
    return validateSocialLinkUrl(url);
  };

  const getCustomLinkFieldValidation = (field: keyof CustomLink, value: string) => {
    if (field === 'title' || field === 'url') {
      return validateCustomLinkField(field, value);
    }
    return { isValid: true, error: null };
  };

  const isSocialLinkFilled = (url: string | undefined) => url && url.trim() !== '';
  const isCustomLinkFilled = (title: string, url: string) => 
    (title && title.trim() !== '') || (url && url.trim() !== '');

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
          <div className="space-y-3" role="group" aria-label="Social media links">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className={cn(
                  "p-4 rounded-xl transition-all duration-300 ease-out focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                  "border",
                  isSocialLinkFilled(link.url) 
                    ? "border-zinc-300 bg-zinc-50/50 dark:border-zinc-600 dark:bg-zinc-800/30 shadow-sm" 
                    : "border-gray-200/60 bg-transparent dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600",
                  !link.isActive && "opacity-60"
                )}
                role="group"
                aria-labelledby={`social-platform-${link.id}`}
              >
                <div className="flex items-center gap-4">
                  {/* Platform Icon */}
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                      isSocialLinkFilled(link.url)
                        ? "bg-zinc-100 dark:bg-zinc-700 shadow-sm"
                        : "bg-gray-50 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50"
                    )}>
                      <link.icon className={cn(
                        "w-5 h-5 transition-colors duration-300",
                        isSocialLinkFilled(link.url)
                          ? "text-zinc-700 dark:text-zinc-300"
                          : "text-gray-500 dark:text-gray-400"
                      )} aria-hidden="true" />
                    </div>
                  </div>
                  
                  {/* URL Input */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 focus-within:border-zinc-400 dark:focus-within:border-zinc-500 focus-within:shadow-sm">
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
                            "text-sm transition-all duration-300 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-3 h-auto rounded-none",
                            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                            link.url ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400",
                            (() => {
                              const validation = getUrlValidation(link.url);
                              return !validation.isValid && "text-red-600 dark:text-red-400 placeholder:text-red-400";
                            })()
                          )}
                          aria-describedby={(() => {
                            const validation = getUrlValidation(link.url);
                            return !validation.isValid ? `social-url-error-${link.id}` : undefined;
                          })()}
                          aria-invalid={(() => {
                            const validation = getUrlValidation(link.url);
                            return !validation.isValid;
                          })()}
                        />
                        {(() => {
                          const validation = getUrlValidation(link.url);
                          if (!validation.isValid) {
                            return (
                              <div id={`social-url-error-${link.id}`} className="text-xs text-red-500 dark:text-red-400 px-3 pb-2 -mt-1">
                                {validation.error}
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Active Toggle */}
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
          <div className="space-y-3" role="group" aria-label="Custom links list">
            {customLinks.map((link) => (
              <div
                key={link.id}
                className={cn(
                  "p-4 rounded-xl transition-all duration-300 ease-out focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                  "border",
                  isCustomLinkFilled(link.title, link.url)
                    ? "border-slate-300 bg-slate-50/50 dark:border-slate-600 dark:bg-slate-800/30 shadow-sm"
                    : "border-gray-200/60 bg-transparent dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600",
                  // Active state
                  !link.isActive && "opacity-60"
                )}
                role="group"
                aria-labelledby={`custom-link-title-${link.id}`}
              >
                <div className="flex items-center gap-4">
                  {/* Link Icon */}
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                      isCustomLinkFilled(link.title, link.url)
                        ? "bg-slate-100 dark:bg-slate-700 shadow-sm"
                        : "bg-gray-50 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50"
                    )}>
                      <Link className={cn(
                        "w-5 h-5 transition-colors duration-300",
                        isCustomLinkFilled(link.title, link.url)
                          ? "text-slate-700 dark:text-slate-300"
                          : "text-gray-500 dark:text-gray-400"
                      )} aria-hidden="true" />
                    </div>
                  </div>
                  
                  {/* Title & URL Input */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 focus-within:border-slate-400 dark:focus-within:border-slate-500 focus-within:shadow-sm">
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
                          className={cn(
                            "text-sm font-medium transition-all duration-300 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-3 h-auto rounded-none",
                            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                            link.title ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400",
                            (() => {
                              const validation = getCustomLinkFieldValidation('title', link.title);
                              return !validation.isValid && "text-red-600 dark:text-red-400 placeholder:text-red-400";
                            })()
                          )}
                          aria-describedby={(() => {
                            const validation = getCustomLinkFieldValidation('title', link.title);
                            return !validation.isValid ? `custom-title-error-${link.id}` : undefined;
                          })()}
                          aria-invalid={(() => {
                            const validation = getCustomLinkFieldValidation('title', link.title);
                            return !validation.isValid;
                          })()}
                        />
                        {(() => {
                          const validation = getCustomLinkFieldValidation('title', link.title);
                          if (!validation.isValid) {
                            return (
                              <div id={`custom-title-error-${link.id}`} className="text-xs text-red-600 dark:text-red-400 px-3 py-1.5 bg-red-50/80 dark:bg-red-950/30 border-t border-red-200/60 dark:border-red-800/40 font-medium">
                                {validation.error}
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>

                      {/* Subtle Divider */}
                      {(() => {
                        const validation = getCustomLinkFieldValidation('title', link.title);
                        if (validation.isValid) {
                          return <div className="h-px bg-gray-100 dark:bg-gray-800"></div>;
                        }
                        return null;
                      })()}

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
                            "text-sm transition-all duration-300 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-3 h-auto rounded-none",
                            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                            link.url ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400",
                            (() => {
                              const validation = getCustomLinkFieldValidation('url', link.url);
                              return !validation.isValid && "text-red-600 dark:text-red-400 placeholder:text-red-400";
                            })()
                          )}
                          aria-describedby={(() => {
                            const validation = getCustomLinkFieldValidation('url', link.url);
                            return !validation.isValid ? `custom-url-error-${link.id}` : undefined;
                          })()}
                          aria-invalid={(() => {
                            const validation = getCustomLinkFieldValidation('url', link.url);
                            return !validation.isValid;
                          })()}
                        />
                        {(() => {
                          const validation = getCustomLinkFieldValidation('url', link.url);
                          if (!validation.isValid) {
                            return (
                              <div id={`custom-url-error-${link.id}`} className="text-xs text-red-600 dark:text-red-400 px-3 py-1.5 bg-red-50/80 dark:bg-red-950/30 border-t border-red-200/60 dark:border-red-800/40 font-medium">
                                {validation.error}
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
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
              <div className="text-center py-10 md:py-16" role="status">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center shadow-sm">
                  <Link className="w-6 h-6 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm md:text-lg font-medium text-gray-900 dark:text-gray-100">Create your first custom link</h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                    Add any website, portfolio, or social media link to your profile
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
