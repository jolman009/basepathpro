# Annotations Feature Setup Guide

This guide explains how to set up the video annotations persistence feature using Supabase.

## Prerequisites

- Supabase project with `videos` table already configured
- Supabase credentials in `.env.local`:
  ```
  VITE_SUPABASE_URL=your-project-url
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```

## Step 1: Create Annotations Table

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `supabase_annotations_schema.sql`

This will create:
- `annotations` table with proper schema
- Index on `video_id` for performance
- Row Level Security policies
- Auto-update trigger for `updated_at` timestamp

## Step 2: Verify Table Structure

The `annotations` table should have these columns:
- `id` (uuid, primary key)
- `video_id` (uuid, foreign key to videos table)
- `type` (text: 'line', 'angle', or 'rect')
- `points` (jsonb: array of {x, y} coordinates)
- `timestamp` (float: video timestamp in seconds)
- `color` (text: hex color code)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## Step 3: Test the Feature

1. Start the dev server: `pnpm run dev`
2. Upload a video through the Videos page
3. Click on the uploaded video to open the Video Detail page
4. Use the annotation tools:
   - **Line**: Click twice to draw a line
   - **Angle**: Click three times to draw an angle (displays degrees)
   - **Rectangle**: Click and drag to draw a rectangle
   - **Eraser**: Click on annotations to remove them
   - **Reset**: Clear all annotations

5. Watch for the save status indicator in the header:
   - "Saving..." - Annotations are being saved (2s debounce)
   - "Saved" - Successfully saved to Supabase
   - "Save failed" - Error occurred (check console)

## How It Works

### Auto-Save Flow
1. User draws/modifies annotations
2. Changes trigger `handleAnnotationsChange`
3. Debounce timer waits 2 seconds for more changes
4. Annotations saved to Supabase
5. Status indicator shows progress

### Data Persistence
- Annotations are stored per video by `video_id`
- Each annotation includes timestamp, type, points, and color
- Old annotations are replaced when saving (upsert pattern)
- Annotations load automatically when video opens

### Files Modified
- `src/features/videos/services/annotations.service.ts` - Supabase CRUD operations
- `src/features/videos/pages/VideoDetailScreen.tsx` - Video player with persistence
- `src/features/videos/components/VideoAnnotationCanvas.tsx` - Canvas drawing logic
- `supabase_annotations_schema.sql` - Database schema

## Troubleshooting

### Annotations not saving
1. Check browser console for errors
2. Verify Supabase credentials in `.env.local`
3. Ensure `annotations` table exists
4. Check Supabase dashboard for table permissions

### Annotations not loading
1. Verify video has a valid `id` from Supabase
2. Check network tab for failed requests
3. Ensure RLS policies allow read access

### Save status shows error
1. Open browser console to see detailed error
2. Common issues:
   - Missing `annotations` table
   - Invalid `video_id` (foreign key constraint)
   - RLS policy blocking writes

## Next Steps

Consider implementing:
- Side-by-side video comparison (Week 2 goal)
- Annotation history/versioning
- Export annotations to JSON
- Share annotations with other users
- Annotation templates for common analysis patterns
