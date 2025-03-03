"use client";

import { useState, useEffect, SetStateAction } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/card";
import { Label } from "@/components/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Session } from "inspector";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Fetch session on mount (especially needed for password recovery links)
  useEffect(() => {
    const fetchSession = async () => {
      const type = searchParams.get("type"); // Check if the URL contains 'type=recovery'
      
      if (type === "recovery") {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          toast.error("Session missing or expired. Please request a new reset link.", {
            position: "bottom-right",
          });
          router.push("/forgot-password"); // Redirect user if session is missing
        } else {
          setSession(data.session as unknown as SetStateAction<Session | null>); // Store session if available
        }
      }
    };

    fetchSession();
  }, [searchParams, router]);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "bottom-right" });
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password must be at least 6 characters long, include one uppercase letter, one lowercase letter, and one special character.",
        { position: "bottom-right" }
      );
      setLoading(false);
      return;
    }

    if (!session) {
      toast.error("Session expired or missing. Please request a new reset link.", {
        position: "bottom-right",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast.error(error.message || "Failed to reset password.", { position: "bottom-right" });
    } else {
      toast.success("Password reset successfully!", { position: "bottom-right" });
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Reset Password</h2>
          <p className="text-sm text-muted-foreground text-center">
            Enter your new password below.
          </p>
        </CardHeader>
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading || !newPassword || !confirmPassword}>
              {loading ? "Resetting..." : "Change Password"}
            </Button>
            <Button variant="ghost" onClick={() => router.push("/login")}>
              Back to Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
