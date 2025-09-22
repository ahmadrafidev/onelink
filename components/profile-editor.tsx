'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { ProfileEditorProps, Profile } from '@/lib/types';

export function ProfileEditor({ profile, setProfile }: ProfileEditorProps) {
  const handleInputChange = (field: keyof Profile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          Profile
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="display-name">Display Name</Label>
          <Input
            id="display-name"
            type="text"
            value={profile.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Type your name here"
            aria-describedby="display-name-desc"
            required
            aria-required="true"
          />
          <div id="display-name-desc" className="text-xs text-muted-foreground">
            This will be displayed as your main heading
          </div>
        </div>

        {/* Bio Input */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell people about yourself..."
            rows={3}
            className="resize-none focus-enhanced"
            aria-describedby="bio-desc"
            maxLength={160}
          />
          <div id="bio-desc" className="text-xs text-muted-foreground flex justify-between">
            <span>Brief description about yourself (optional)</span>
            <span>{profile.bio.length}/160</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
