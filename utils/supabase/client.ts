import { createBrowserClient } from '@supabase/ssr';
import { Database } from 'database.types';

export const createClient = () => {
  console.log('in function');
  return createBrowserClient<Database>(
    'https://sjnxdkoqfwuhjxxatbqt.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqbnhka29xZnd1aGp4eGF0YnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1Mjc0MDQsImV4cCI6MjAyOTEwMzQwNH0.aTT1mSVTYEQYEAh5qKyJzeE9UEHfzeZMWebcIC4swjE'
  );
};
