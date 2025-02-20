
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export function useLoginActions() {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [loading, setLoading] = useState(false); // State for loading indicator
  const router = useRouter();

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        let errorMessage = "Failed to sign in";
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please verify your email address";
        }

        toast.error(errorMessage, {
          position: "bottom-right",
          duration: 4000,
          className: "bg-destructive text-destructive-foreground",
        });
        return;
      }

      if (data.user) {
        toast.success("Login successful!", {
          position: "bottom-right",
          duration: 3000,
          className: "bg-primary text-primary-foreground",
        });
        router.push("/chat");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
  };
}