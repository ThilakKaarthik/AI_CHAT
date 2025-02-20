import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useRegisterActions() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|;:'",.<>?]).{6,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!passwordPattern.test(password)) {
      setPasswordError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      setLoading(false);
      return;
    } else {
      setPasswordError("");
    }

    try {
      const { data: existingUsers } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .single();

      // if (existingUsers) {
      //   toast("Email already exists", {
      //     description: "Please use a different email address or sign in.",
      //     action: {
      //       label: "Sign In",
      //       onClick: () => router.push("/login"),
      //     },
      //   });
      //   setLoading(false);
      //   return;
      // }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Registration successful! Please sign in.");
        router.push("/login");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    passwordError,
    handleSubmit,
  };
}