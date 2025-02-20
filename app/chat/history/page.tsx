'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ScrollArea } from "@/components/scroll-area";
import { Button } from "@/components/button";
import { formatDistanceToNow } from "date-fns";
import * as Accordion from "@radix-ui/react-accordion";
import { History } from "lucide-react";
import Link from "next/link";

interface ChatEntry {
  id: string;
  message: string;
  response: string;
  action_type?: string;
  created_at: string;
}

export default function ChatHistory() {
  const [history, setHistory] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchChatHistory = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Please sign in to view history", { position: "bottom-right" });
        router.push("/login");
        return;
      }

      const userId = session.user.id;

      try {
        const { data: chatData, error: chatError } = await supabase
          .from("chat_history")
          .select("id, message, response, created_at")
          .eq("user_id", userId);

        const { data: finalData, error: finalError } = await supabase
          .from("finalhistory")
          .select("id, message, response, action_type, created_at")
          .eq("user_id", userId);

        if (chatError || finalError) {
          throw chatError || finalError;
        }

        const mergedHistory: ChatEntry[] = [...(chatData || []), ...(finalData || [])].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setHistory(mergedHistory);
      } catch (error) {
        console.error("Error fetching history:", error);
        toast.error("Failed to load chat history", { position: "bottom-right" });
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [router]);

  const deleteHistory = async (id: string) => {
    try {
      const { error: chatError } = await supabase.from("chat_history").delete().match({ id });
      const { error: finalError } = await supabase.from("finalhistory").delete().match({ id });

      if (chatError && finalError) throw chatError || finalError;

      setHistory((prev) => prev.filter((item) => item.id !== id));
      toast.success("History deleted successfully", { position: "bottom-right" });
    } catch (error) {
      console.error("Error deleting history:", error);
      toast.error("Failed to delete history", { position: "bottom-right" });
    }
  };

  const formatResponse = (text: string) => {
    return text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-64 border-r bg-muted p-4 flex flex-col">
        <div className="space-y-4 mb-4">
          <Link href="/chat/history">
            <Button variant="ghost" className="w-full justify-start">
              <History className="mr-2 h-4 w-4" />
              Chat History
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-6">Chat History</h1>

        {loading ? (
          <p className="text-lg">Loading history...</p>
        ) : history.length === 0 ? (
          <p>No chat history available.</p>
        ) : (
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <Accordion.Root type="single" collapsible>
              {history.map((item) => (
                <Accordion.Item key={item.id} value={item.id} className="border-b">
                  <div className="flex items-center justify-between p-4">
                    <Accordion.Trigger className="w-full text-left font-semibold flex flex-col">
                      {item.action_type ? (
                        <span className="text-black dark:text-white font-medium">{item.action_type}</span>
                      ) : (
                        <span className="text-base font-medium">{item.message}</span>
                      )}
                      <time className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </time>
                    </Accordion.Trigger>

                    <div>
                      <Button size="sm" className="ml-2" onClick={() => deleteHistory(item.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>

                  <Accordion.Content className="p-4 bg-card border-t">
                    <p className="text-sm font-medium mb-2">AI response:</p>
                    <p 
                      className="text-sm text-muted-foreground whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: formatResponse(item.response) }}
                    />
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}