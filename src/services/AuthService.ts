import { supabase } from '../utils/supabase/client';

export class AuthService {
  static async signInWithGoogle(): Promise<void> {
    // Redirect-based sign in using Supabase OAuth
    const redirectTo =
      typeof window !== 'undefined' ? window.location.origin : undefined;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: redirectTo ? { redirectTo } : undefined,
    });
  }

  static async signOut() {
    await supabase.auth.signOut();
  }
}




