'use client';

import { useState, useEffect, useMemo } from 'react';
import { GripVertical, ExternalLink, Smartphone, Wifi, Battery, Link } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import type { MobilePreviewProps, CustomLink } from '@/lib/types';

export function MobilePreview({ profile, socialLinks, customLinks }: MobilePreviewProps) {
  const activeSocialLinks = useMemo(() => 
    socialLinks.filter(link => link.isActive && link.url),
    [socialLinks]
  );
  const activeCustomLinks = useMemo(() => 
    customLinks.filter(link => link.isActive && link.url && link.title),
    [customLinks]
  );
  
  const [draggableCustomLinks, setDraggableCustomLinks] = useState<CustomLink[]>([]);
  const [draggedItem, setDraggedItem] = useState<CustomLink | null>(null);

  const handleLinkClick = (url: string, linkText: string) => {
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    alert(`Preview: Would navigate to ${formattedUrl}`);
  };

  const handleDragStart = (e: React.DragEvent, link: CustomLink) => {
    setDraggedItem(link);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetLink: CustomLink) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetLink.id) return;
    
    const newLinks = [...draggableCustomLinks];
    const draggedIndex = newLinks.findIndex(link => link.id === draggedItem.id);
    const targetIndex = newLinks.findIndex(link => link.id === targetLink.id);
    
    newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, draggedItem);
    
    setDraggableCustomLinks(newLinks);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  useEffect(() => {
    setDraggableCustomLinks(activeCustomLinks);
  }, [activeCustomLinks]);

  return (
    <Card className="transition-all duration-200 ease-out hover:shadow-md sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center"
            aria-hidden="true"
          >
            <Smartphone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
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
            <div 
              className="w-full h-[500px] rounded-[2rem] overflow-hidden relative bg-white dark:bg-gray-900"
              role="img"
              aria-label="Mobile phone preview of your OneLink page"
            >
              {/* Status Bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-8 bg-black bg-opacity-10 flex items-center justify-between px-6"
                aria-hidden="true"
              >
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-current rounded-full opacity-60" />
                  <div className="w-1 h-1 bg-current rounded-full opacity-60" />
                  <div className="w-1 h-1 bg-current rounded-full opacity-60" />
                </div>
                <div className="text-xs font-medium opacity-60 text-gray-900 dark:text-white">
                  9:41
                </div>
                <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                  <Wifi className="w-3 h-3 opacity-60" />
                  <Battery className="w-3 h-3 opacity-60" />
                </div>
              </div>

              {/* Content */}
              <div className="pt-12 h-full overflow-y-auto">
                <div className="flex flex-col min-h-full">
                  {/* Main Content Area */}
                  <div className="flex-grow px-6 pb-6">
                    <div className="flex flex-col items-center space-y-8">
                      {/* Profile Section */}
                      <div className="text-center px-4">
                        {/* Name */}
                        <h1 
                          className="text-xl font-bold mb-3 text-gray-900 dark:text-white leading-tight"
                          id="preview-profile-name"
                        >
                          {profile.name || 'Your Name'}
                        </h1>

                        {/* Bio */}
                        {profile.bio && (
                          <p 
                            className="text-sm opacity-80 leading-relaxed text-gray-700 dark:text-gray-300 max-w-xs"
                            aria-describedby="preview-profile-name"
                          >
                            {profile.bio}
                          </p>
                        )}
                      </div>

                      {/* Social Links Section */}
                      {activeSocialLinks.length > 0 && (
                        <div className="w-full max-w-sm">
                          {activeSocialLinks.length <= 4 ? (
                            <div className="space-y-3">
                              <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center mb-4">
                                Social Links
                              </h2>
                              {activeSocialLinks.map((link) => (
                                <Button
                                  key={link.id}
                                  onClick={() => handleLinkClick(link.url || '', link.platform)}
                                  className="w-full py-4 px-5 rounded-xl text-sm font-medium transition-all duration-200 ease-out transform hover:scale-[1.02] active:scale-[0.98] bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 shadow-sm"
                                  variant="ghost"
                                  aria-label={`Preview link to ${link.platform} - ${link.url}`}
                                >
                                  <span className="flex items-center gap-3 justify-center">
                                    <link.icon className="w-5 h-5" aria-hidden="true" />
                                    {link.platform}
                                  </span>
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center">
                                Social Links
                              </h2>
                              <div className="grid grid-cols-4 gap-3 justify-items-center">
                                {activeSocialLinks.map((link) => (
                                  <button
                                    key={link.id}
                                    onClick={() => handleLinkClick(link.url || '', link.platform)}
                                    className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 ease-out transform hover:scale-110 active:scale-95 flex items-center justify-center group"
                                    aria-label={`Preview link to ${link.platform} - ${link.url}`}
                                    title={link.platform}
                                  >
                                    <link.icon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* External/Custom Links Section */}
                      {draggableCustomLinks.length > 0 && (
                        <div className="w-full max-w-sm space-y-3">
                          <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center mb-4">
                            Links
                          </h2>
                          {draggableCustomLinks.map((link) => (
                            <div
                              key={link.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, link)}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, link)}
                              onDragEnd={handleDragEnd}
                              className={cn(
                                "group relative cursor-move transition-all duration-200 ease-out",
                                draggedItem?.id === link.id && "opacity-50 scale-95"
                              )}
                            >
                              <Button
                                onClick={() => handleLinkClick(link.url || '', link.title)}
                                className="w-full py-4 px-5 rounded-xl text-sm font-medium transition-all duration-200 ease-out transform hover:scale-[1.02] active:scale-[0.98] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 shadow-sm group-hover:border-gray-300 dark:group-hover:border-gray-500"
                                variant="ghost"
                                aria-label={`Preview link to ${link.title} - ${link.url}`}
                              >
                                <span className="flex items-center gap-3 justify-between w-full">
                                  <span className="flex items-center gap-3">
                                    <ExternalLink className="w-5 h-5" aria-hidden="true" />
                                    {link.title}
                                  </span>
                                  <GripVertical className="w-4 h-4 opacity-40 group-hover:opacity-60" aria-hidden="true" />
                                </span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Empty State */}
                      {activeSocialLinks.length === 0 && draggableCustomLinks.length === 0 && (
                        <div className="text-center py-12" role="status">
                          <Link className="w-12 h-12 mx-auto mb-4 opacity-40 text-gray-500 dark:text-gray-400" />
                          <p className="text-sm opacity-60 text-gray-500 dark:text-gray-400 max-w-xs">
                            Add some links to see them here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto px-6 pb-6">
                    <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs opacity-50 text-gray-500 dark:text-gray-400">
                        Made with OneLink
                      </p>
                    </div>
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
        <div 
          className="mt-6 p-4 bg-muted rounded-lg"
          role="region"
          aria-label="Preview statistics"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p 
                className="text-lg font-semibold"
                aria-label={`${activeSocialLinks.length} social links active`}
              >
                {activeSocialLinks.length}
              </p>
              <p className="text-xs text-muted-foreground">
                Social
              </p>
            </div>
            <div>
              <p 
                className="text-lg font-semibold"
                aria-label={`${activeCustomLinks.length} custom links active`}
              >
                {activeCustomLinks.length}
              </p>
              <p className="text-xs text-muted-foreground">
                Custom
              </p>
            </div>
            <div>
              <p 
                className="text-lg font-semibold"
                aria-label={profile.name ? "Profile name completed" : "Profile name missing"}
              >
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
