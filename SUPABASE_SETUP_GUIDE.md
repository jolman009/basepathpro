# Supabase Setup Guide

This guide will help you set up your Supabase database and storage for the softball/baseball training app.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A new Supabase project created
3. Your `.env` file configured with Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## Setup Steps

### 1. Run SQL Schemas in Order

Go to your Supabase project → SQL Editor → New Query, and run these files **in this exact order**:

#### Step 1: Base Schema (Athletes & Videos tables)
```bash
# File: supabase_base_schema.sql
```
Run this first to create the `athletes` and `videos` tables with RLS policies.

#### Step 2: Annotations Schema
```bash
# File: supabase_annotations_schema.sql
```
Run this to create the `annotations` table for video annotations.

#### Step 3: Sessions Schema
```bash
# File: supabase_sessions_schema.sql
```
Run this to create the `sessions` and `metrics` tables for performance tracking.

#### Step 4: Storage Policies
```bash
# File: supabase_storage_setup.sql
```
Run this to set up storage bucket policies.

### 2. Create Storage Bucket (Alternative Method)

If the SQL method doesn't work for storage, use the Supabase Dashboard:

1. Go to **Storage** in the left sidebar
2. Click **New bucket**
3. Name it: `videos`
4. Make it **Public**
5. Click **Create bucket**

Then go to **Policies** for the `videos` bucket and create these policies:

**Policy 1: Allow uploads**
- Policy name: `Allow public uploads`
- Allowed operation: `INSERT`
- Target roles: `public`
- Policy definition: `true`

**Policy 2: Allow reads**
- Policy name: `Allow public reads`
- Allowed operation: `SELECT`
- Target roles: `public`
- Policy definition: `true`

**Policy 3: Allow updates**
- Policy name: `Allow public updates`
- Allowed operation: `UPDATE`
- Target roles: `public`
- Policy definition: `true`

**Policy 4: Allow deletes**
- Policy name: `Allow public deletes`
- Allowed operation: `DELETE`
- Target roles: `public`
- Policy definition: `true`

### 3. Verify Setup

After running all schemas, verify in Supabase Dashboard:

**Database Tables:**
- ✅ `athletes` table exists
- ✅ `videos` table exists
- ✅ `annotations` table exists
- ✅ `sessions` table exists
- ✅ `metrics` table exists

**Storage:**
- ✅ `videos` bucket exists and is public
- ✅ Storage policies allow all operations

### 4. Test the Application

1. Start the dev server: `pnpm run dev`
2. Navigate to Athletes and create a test athlete
3. Navigate to Videos and upload a test video
4. If upload succeeds, your setup is complete!

## Troubleshooting

### "new row violates row-level security policy"

This means RLS is enabled but no policies allow the operation.

**Solution:**
1. Go to Supabase Dashboard → Authentication → Policies
2. Find the table causing issues (e.g., `videos`)
3. Ensure the "Allow all operations" policy exists
4. If not, run the corresponding schema file again

### Storage upload fails

**Solution:**
1. Check that the `videos` bucket exists in Storage
2. Verify the bucket is set to **Public**
3. Check that storage policies exist (see Step 2 above)
4. Verify your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct

### Foreign key constraint errors

This means you're trying to run schemas out of order.

**Solution:**
1. Drop all tables: Go to SQL Editor and run:
   ```sql
   drop table if exists metrics cascade;
   drop table if exists sessions cascade;
   drop table if exists annotations cascade;
   drop table if exists videos cascade;
   drop table if exists athletes cascade;
   ```
2. Re-run the schemas in the correct order (see Step 1)

## Security Note

⚠️ **Important**: The current RLS policies allow **public access** to all data for development purposes.

Before deploying to production, you should:
1. Implement authentication (Week 4 in the Production Timeline)
2. Update RLS policies to restrict access based on authenticated users
3. Add user ownership checks for athletes and videos

## Need Help?

If you encounter issues not covered here:
1. Check the Supabase logs: Dashboard → Logs
2. Verify your SQL ran successfully: Dashboard → SQL Editor → Query history
3. Check browser console for detailed error messages
