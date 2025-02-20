'use client';

import Link from "next/link";
import { Button } from "@/components/button";
import { Code2 } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { Toaster } from "@/components/sonner";

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => pathname === path;


  if (loading) {
    return (
      <header className="border-b bg-[#1a1a1a] border-[#2a2a2a]">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">ITC Code Assistant</span>
            </Link>
            <div className="flex items-center space-x-4">
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white">ITC Code Assistant</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link 
                  href="/chat" 
                  className={`text-sm font-medium transition-colors ${
                    isActive('/chat') 
                      ? 'text-violet-400' 
                      : 'text-gray-300 hover:text-violet-400'
                  }`}
                >
                  Chat
                </Link>
                <Link 
                  href="/chat/history" 
                  className={`text-sm font-medium transition-colors ${
                    isActive('/chat/history') 
                      ? 'text-violet-400' 
                      : 'text-gray-300 hover:text-violet-400'
                  }`}
                >
                  History
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <ModeToggle />
            {user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-gray-300 hover:text-violet-400 hover:bg-violet-600/10"
              >
                Sign out
              </Button>
            ) : (
              pathname === "/" && !user && (
                <>
                  <Link href="/login">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-300 hover:text-violet-400 hover:bg-violet-600/10"
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button 
                      size="sm"
                      className="bg-violet-600 text-white hover:bg-violet-700"
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            border: '1px solid #444',
          },
          className: 'custom-toast',
        }}
      />
    </header>
  );
}
