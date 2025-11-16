import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uksjnwnvarhldlxyymef.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrc2pud252YXJobGRseHl5bWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDYxOTQsImV4cCI6MjA3NzU4MjE5NH0.A9CE2oq6gF09N-QYG6P8EMrwsW9bhLMkODjRhi_O4W4';

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseKey);
};

export const supabase = createClient();

export default supabase;