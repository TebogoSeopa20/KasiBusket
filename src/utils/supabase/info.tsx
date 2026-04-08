// Supabase connection configuration.
// Set these in your .env (or .env.local) at project root:
// VITE_SUPABASE_URL=https://<project>.supabase.co
// VITE_SUPABASE_ANON_KEY=<public-anon-key>

const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseUrl = (envUrl ?? '').replace(/\/$/, '');
export const publicAnonKey = envAnonKey ?? '';

// Derived project id (handy for display only)
export const projectId = (() => {
  try {
    if (!supabaseUrl) return '';
    const host = new URL(supabaseUrl).hostname;
    return host.split('.')[0];
  } catch {
    return '';
  }
})();

export function assertSupabaseConfig() {
  if (!supabaseUrl || !publicAnonKey) {
    console.warn(
      '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Auth/remote features will be disabled.'
    );
  }
}
