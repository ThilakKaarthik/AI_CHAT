import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useChatLogic() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('code-generation');

  useEffect(() => {
    checkAuth(); // Check if user is authenticated on mount
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Please sign in to access the chat', {
        position: 'bottom-right',
        duration: 4000,
        className: 'bg-destructive text-destructive-foreground',
      });
      router.push('/login');
    }
  };

  return {
    activeTab,
    setActiveTab,
  };
}