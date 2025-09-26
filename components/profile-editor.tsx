'use client';

import { useForm } from 'react-hook-form';
import { User, AlertTriangle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { profileFormSchema } from '@/lib/schemas';
import type { ProfileEditorProps, Profile, ProfileFormData } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ProfileEditor({ profile, setProfile }: ProfileEditorProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange' as const,
    defaultValues: {
      name: profile.name,
      bio: profile.bio || '',
    },
  });

  const watchedValues = watch();
  const bioLength = watchedValues.bio?.length || 0;

  // Update parent state when form values change
  const onFormChange = (data: { name: string; bio: string }) => {
    setProfile({
      ...profile,
      name: data.name,
      bio: data.bio || '',
    });
  };

  // Handle real-time updates
  const handleInputChange = (field: 'name' | 'bio', value: string) => {
    setValue(field, value, { shouldValidate: true, shouldDirty: true });
    
    // Update parent state immediately for real-time preview
    const updatedProfile = {
      ...profile,
      [field]: value,
    };
    setProfile(updatedProfile);
  };

  return (
    <Card className="transition-all duration-200 ease-out hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
            aria-hidden="true"
          >
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          Profile
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onFormChange)} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="display-name">
              Display Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="display-name"
              type="text"
              {...register('name')}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Type your name here"
              className={cn(
                "transition-colors duration-200",
                errors.name && "border-destructive focus-visible:ring-destructive"
              )}
              aria-describedby={errors.name ? "display-name-error" : "display-name-desc"}
              aria-invalid={!!errors.name}
            />
            {errors.name ? (
              <div id="display-name-error" className="text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.name.message}
              </div>
            ) : (
              <div id="display-name-desc" className="text-xs text-muted-foreground">
                This will be displayed as your main heading
              </div>
            )}
          </div>

          {/* Bio Input */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...register('bio')}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell people about yourself..."
              rows={3}
              className={cn(
                "resize-none transition-colors duration-200",
                errors.bio && "border-destructive focus-visible:ring-destructive"
              )}
              aria-describedby={errors.bio ? "bio-error" : "bio-desc"}
              aria-invalid={!!errors.bio}
              maxLength={160}
            />
            {errors.bio ? (
              <div id="bio-error" className="text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.bio.message}
              </div>
            ) : (
              <div id="bio-desc" className="text-xs text-muted-foreground flex justify-between">
                <span>Brief description about yourself (optional)</span>
                <span className={cn(
                  "transition-colors duration-200",
                  bioLength > 150 && "text-orange-500",
                  bioLength >= 160 && "text-destructive"
                )}>
                  {bioLength}/160
                </span>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
