import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isConfigured } from "../config.js";

export { isConfigured };

// Before the project is wired up, config.js still holds placeholders, which
// would make createClient() throw on an invalid URL and break module load.
// Fall back to a syntactically-valid dummy so the app boots and shows the
// auth screen; every real call is gated behind isConfigured() in app.js.
const url = isConfigured() ? SUPABASE_URL : "https://placeholder.supabase.co";
const key = isConfigured() ? SUPABASE_ANON_KEY : "placeholder-anon-key";

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
