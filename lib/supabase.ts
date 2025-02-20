import { createClient } from "@supabase/supabase-js";

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.warn(
    "NEXT_PUBLIC_SUPABASE_URL is not set. Please connect to Supabase to get your project URL."
  );
}

if (!supabaseAnonKey) {
  console.warn(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Please connect to Supabase to get your anon key."
  );
}

// Initialize Supabase client with better error handling
export const supabase = createClient(
  supabaseUrl || "https://jxsytgvnuyutaxtbfyxh.supabase.co",
  supabaseAnonKey ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4c3l0Z3ZudXl1dGF4dGJmeXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxODY0MzksImV4cCI6MjA1NDc2MjQzOX0.8ZJNRfb6_D1qotnyAFn9dm_KFCTFMRZCVN9XVBjL6MY",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// Helper function to check authentication status
export async function checkAuthStatus() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    console.error("Auth status check failed:", error);
    return { session: null, error };
  }
}

export type ChatHistory = {
  id: string;
  user_id: string;
  message: string;
  response: string;
  created_at: string;
  type?: string;
  language?: string;
};
