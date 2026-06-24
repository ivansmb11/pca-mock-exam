// Public Supabase config. The anon key is meant to be public — Row Level
// Security protects the data. (This is the project's anon/publishable key, the
// same value every Supabase frontend ships in the browser.)
export const SUPABASE_URL = "https://niswoqrprhrcmxggvmhp.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pc3dvcXJwcmhyY214Z2d2bWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTU5ODgsImV4cCI6MjA5Nzg5MTk4OH0.NiCvzjMvaq6QcyO4BjnVAfvQcOdT5yYxWGvn7osQvbY";

export const isConfigured = () =>
  SUPABASE_URL.startsWith("http") && !SUPABASE_ANON_KEY.startsWith("__");
