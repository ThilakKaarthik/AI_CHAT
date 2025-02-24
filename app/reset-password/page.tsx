"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/card";
import { Label } from "@/components/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  // State hooks
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionRestored, setSessionRestored] = useState(false);

  // Hook for navigation (router)
  const router = useRouter();
  const searchParams = useSearchParams();

  // Password validation regex: 
  // - At least 6 characters, 1 lowercase, 1 uppercase, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/;

  // Restore session using Supabase exchangeCodeForSession()
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      supabase.auth.exchangeCodeForSession(token)
        .then(({ error }) => {
          if (error) {
            toast.error("Session exchange failed. Try resetting again.", {
              position: "bottom-right",
              className: "bg-destructive text-destructive-foreground",
            });
          } else {
            setSessionRestored(true);
          }
        });
    }
  }, [searchParams]);

  // Handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if session was successfully restored
    if (!sessionRestored) {
      toast.error("Session is missing. Please request a new reset link.", {
        position: "bottom-right",
        className: "bg-destructive text-destructive-foreground",
      });
      setLoading(false);
      return;
    }

    // Step 1: Password match validation
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "bottom-right",
        className: "bg-destructive text-destructive-foreground",
      });
      setLoading(false);
      return;
    }

    // Step 2: Password strength validation
    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password must be at least 6 characters long, include one uppercase letter, one lowercase letter, and one special character.",
        {
          position: "bottom-right",
          className: "bg-destructive text-destructive-foreground",
        }
      );
      setLoading(false);
      return;
    }

    // Step 3: Update password using Supabase
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    // Step 4: Handle errors or success
    if (error) {
      toast.error(error.message || "Failed to reset password.", {
        position: "bottom-right",
        className: "bg-destructive text-destructive-foreground",
      });
    } else {
      toast.success("Password reset successfully!", {
        position: "bottom-right",
        className: "bg-primary text-primary-foreground",
      });

      // Redirect user to login page
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
