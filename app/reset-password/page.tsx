"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/card";
import { Label } from "@/components/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  // State hooks for new password, confirm password, and loading state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Hook for navigation (router)
  const router = useRouter();

  // Password validation regex: Password must have:
  // - At least 6 characters
  // - At least 1 lowercase letter
  // - At least 1 uppercase letter
  // - At least 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/;

  // Main function to handle the password reset logic
  const handleResetPassword = async (e: React.FormEvent) => {
    // Prevent the default form submission behavior
    e.preventDefault();
    
    // Set loading state to true when the password reset process begins
    setLoading(true);

    // Step 1: Check if the new password and confirmation password match
    if (newPassword !== confirmPassword) {
      // Show an error toast if passwords don't match
      toast.error("Passwords do not match!", {
        position: "bottom-right",
        className: "bg-destructive text-destructive-foreground", // Styling for error
      });
      // End the loading state
      setLoading(false);
      return; // Exit function early if passwords do not match
    }

    // Step 2: Validate the new password using a regex pattern
    if (!passwordRegex.test(newPassword)) {
      // Show an error toast if password does not meet criteria
      toast.error(
        "Password must be at least 6 characters long, include one uppercase letter, one lowercase letter, and one special character.",
        {
          position: "bottom-right",
          className: "bg-destructive text-destructive-foreground", // Styling for error
        }
      );
      // End the loading state
      setLoading(false);
      return; // Exit function early if password is invalid
    }

    // Step 3: Attempt to update the user's password in Supabase
    const { error } = await supabase.auth.updateUser({
      password: newPassword, // Set the new password for the user
    });

    // Step 4: Handle errors from the password update attempt
    if (error) {
      // Show an error toast if there is an issue updating the password
      toast.error(error.message || "Failed to reset password.", {
        position: "bottom-right",
        className: "bg-destructive text-destructive-foreground", // Styling for error
      });
    } else {
      // Show a success toast if password reset is successful
      toast.success("Password reset successfully!", {
        position: "bottom-right",
        className: "bg-primary text-primary-foreground", // Styling for success
      });
      // Redirect the user to the login page after success
      router.push("/login");
    }

    // End the loading state
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
