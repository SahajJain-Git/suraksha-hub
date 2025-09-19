-- Add new fields to profiles table for detailed user information
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS institute_name TEXT,
ADD COLUMN IF NOT EXISTS institute_location TEXT,
ADD COLUMN IF NOT EXISTS enrollment_number TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS institute_email TEXT,
ADD COLUMN IF NOT EXISTS designation TEXT;