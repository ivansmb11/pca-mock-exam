import { supabase } from "./supabase-client.js";

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function getAccessToken() {
  const s = await getSession();
  return s?.access_token ?? null;
}

export function getUser(session) {
  return session?.user ?? null;
}

export async function signInWithPassword(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUpWithPassword(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin },
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

// Calls cb(session|null) immediately and on every auth change.
export function onAuthChange(cb) {
  supabase.auth.getSession().then(({ data }) => cb(data.session ?? null));
  supabase.auth.onAuthStateChange((_event, session) => cb(session ?? null));
}
