'use client';

import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { MOCK_BASE_URL } from '@/lib/constants';
import { downloadAppData, uploadAndImportAppData, validateBeforeExport } from '@/lib/utils/export-import';
import type { ActionButtonsProps, AppState } from '@/lib/types';
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
  Download, 
  FolderOpen 
} from 'lucide-react';

interface ExtendedActionButtonsProps extends ActionButtonsProps {
  onImportData?: (data: AppState) => void;
}

export function ActionButtons({ 
  profile, 
  socialLinks, 
  customLinks, 
  onImportData 
}: ExtendedActionButtonsProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isShortening, setIsShortening] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [exportErrors, setExportErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeSocialLinks = socialLinks.filter(link => link.isActive && link.url);
  const activeCustomLinks = customLinks.filter(link => link.isActive && link.url && link.title);
  const totalActiveLinks = activeSocialLinks.length + activeCustomLinks.length;
  const isReadyToPublish = profile.name && totalActiveLinks > 0;

  const handlePublish = async () => {
    if (!isReadyToPublish) {
      alert('Please add your name and at least one link before publishing.');
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
  };

  const handleShorten = async () => {
    if (!publishedUrl) {
      alert('Please publish your page first before shortening the URL.');
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
    alert(`Short URL copied to clipboard: ${shortUrl}`);
  };

  const handleExport = async () => {
    if (!isReadyToPublish) {
      alert('Please add your name and at least one link before exporting.');
      return;
    }

    if (isExporting) return;

    setIsExporting(true);
    setExportErrors([]);
    
    try {
      // Create app state object
      const appState: AppState = {
        profile,
        socialLinks,
        customLinks,
      };
      
      // Validate before export
      const validation = validateBeforeExport(appState);
      if (!validation.isValid) {
        setExportErrors(validation.errors);
        setIsExporting(false);
        return;
      }
      
      // Export with validation
      const result = downloadAppData(appState);
      if (!result.success) {
        setExportErrors([result.message]);
      }
    } catch (error) {
      setExportErrors([error instanceof Error ? error.message : 'Export failed']);
    }
    
    setIsExporting(false);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setExportErrors([]);
    
    try {
      const result = await uploadAndImportAppData(file);
      if (result.success && onImportData) {
        onImportData(result.data);
        alert('Data imported successfully!');
      } else if (!result.success) {
        setExportErrors([result.error]);
      }
    } catch (error) {
      setExportErrors([error instanceof Error ? error.message : 'Import failed']);
    }
    
    setIsImporting(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleShare = async () => {
    if (!publishedUrl) {
      alert('Please publish your page first before sharing.');
      return;
    }

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
    if (!isReadyToPublish) {
      alert('Please add your name and at least one link before previewing.');
      return;
    }

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

        {/* Export Errors */}
        {exportErrors.length > 0 && (
          <Alert variant="destructive" role="alert" aria-live="assertive">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            <AlertTitle>Validation Error</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-1" role="list">
                {exportErrors.map((error, index) => (
                  <li key={index} className="text-sm" role="listitem">• {error}</li>
                ))}
              </ul>
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
                  alert('URL copied to clipboard!');
                }}
                className={cn(
                  "h-auto p-1 font-mono text-xs hover:bg-muted",
                  "transition-all duration-200 ease-out transform",
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
              "transition-all duration-200 ease-out transform",
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
              "transition-all duration-200 ease-out transform",
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
          <Button
            onClick={handleShare}
            className={cn(
              "transition-all duration-200 ease-out transform",
              "hover:scale-[1.02] active:scale-[0.98]",
              "motion-reduce:transform-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
            )}
            aria-label={publishedUrl ? "Share your published OneLink page" : "Share page (requires publishing first)"}
            aria-describedby={!publishedUrl ? "share-requirements" : undefined}
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
            Share
          </Button>

          {/* Shortener Button */}
          <Button
            onClick={handleShorten}
            className={cn(
              "transition-all duration-200 ease-out transform",
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

        {/* Secondary Actions */}
        <div className="pt-4 border-t border-border">
          <div 
            className="flex justify-center gap-4"
            role="group"
            aria-label="Secondary actions for data management"
          >
            <Button
              onClick={handleExport}
              variant="ghost"
              size="sm"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                "transition-all duration-200 ease-out transform",
                "hover:scale-[1.02] active:scale-[0.98]",
                "motion-reduce:transform-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
              )}
              aria-label={isReadyToPublish ? "Export your profile and links data as JSON file" : "Export data (requires name and at least one link)"}
              aria-busy={isExporting}
              aria-describedby={!isReadyToPublish ? "export-requirements" : undefined}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span className="sr-only" aria-live="polite">Exporting data in progress</span>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Export Data
                </>
              )}
            </Button>
            
            {onImportData && (
              <>
                <Button
                  onClick={handleImport}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-muted-foreground hover:text-foreground",
                    "transition-all duration-200 ease-out transform",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    "motion-reduce:transform-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
                  )}
                  aria-label="Import profile and links data from JSON file"
                  aria-busy={isImporting}
                  aria-controls="file-input"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span className="sr-only" aria-live="polite">Importing data in progress</span>
                      Importing...
                    </>
                  ) : (
                    <>
                      <FolderOpen className="w-4 h-4" aria-hidden="true" />
                      Import Data
                    </>
                  )}
                </Button>
                
                <input
                  id="file-input"
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                  aria-label="Select JSON file to import profile and links data"
                  aria-describedby="file-input-description"
                />
                <span id="file-input-description" className="sr-only">
                  Choose a JSON file containing your OneLink profile and links data to import. The file should be exported from OneLink previously.
                </span>
              </>
            )}
          </div>
        </div>

        {/* Hidden requirement messages for screen readers */}
        <div className="sr-only">
          <div id="share-requirements">
            To share your page, you must first publish it by clicking the Publish button.
          </div>
          <div id="shorten-requirements">
            To create a shortened URL, you must first publish your page by clicking the Publish button.
          </div>
          <div id="export-requirements">
            To export your data, please add your name and at least one link first.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
