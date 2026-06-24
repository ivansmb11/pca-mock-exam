// Public Supabase config. The anon key is meant to be public — Row Level
// Security protects the data. These are filled in after `supabase link`
// (or by your Vercel deploy). Replace the two placeholders below.
export const SUPABASE_URL = "__SUPABASE_URL__";
export const SUPABASE_ANON_KEY = "__SUPABASE_ANON_KEY__";

export const isConfigured = () =>
  SUPABASE_URL.startsWith("http") && !SUPABASE_ANON_KEY.startsWith("__");
