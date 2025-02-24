"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/card";
import { Label } from "@/components/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

function ResetPasswordComponent() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionRestored, setSessionRestored] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams(); // Wrapped in Suspense at the parent level

  useEffect(() => {
    const token = searchParams.get("token");

    console.log("🔍 Debug - Reset Token:", token); // Check if the token is received

    if (!token) {
      toast.error("Reset token is missing. Please request a new reset link.");
      return;
    }

    // Ensure async handling is correct
    const verifySession = async () => {
      const { error, data } = await supabase.auth.verifyOtp({
        type: "recovery",
        token,
      });

      if (error) {
        console.error("🚨 Supabase Error:", error.message);
        toast.error("Session exchange failed. Try resetting again.");
      } else {
        console.log("✅ Session Restored:", data);
        setSessionRestored(true);
      }
    };

    verifySession();
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!sessionRestored) {
      toast.error("Session is missing. Please request a new reset link.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password must be at least 6 characters long, include one uppercase letter, one lowercase letter, and one special character."
      );
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      console.error("🚨 Supabase Password Reset Error:", error.message);
      toast.error(error.message || "Failed to reset password.");
    } else {
      toast.success("Password reset successfully!");
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordComponent />
    </Suspense>
  );
}
