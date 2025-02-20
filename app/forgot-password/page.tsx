"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/card";
import { Label } from "@/components/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(""); // Store the email entered by the user
  const [loading, setLoading] = useState(false); // Track if the reset email is being sent
  const router = useRouter(); // Router to navigate back to login page

  /**
   * Handles the password reset request.
   * @param e - Form submission event
   */
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true); // Set loading state to true while sending the reset email

    // Send the password reset request to Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`, // URL to redirect after clicking reset link in email
    });

    // If there is an error, show a toast with the error message
    if (error) {
      toast.error(error.message || "Failed to send reset email.", {
        position: "bottom-right",
        className: "bg-destructive text-destructive-foreground",
      });
    } else {
      // If successful, show a success toast and clear the email field
      toast.success("Reset link sent! Check your email.", {
        position: "bottom-right",
        className: "bg-primary text-primary-foreground",
      });
      setEmail(""); // Clear email field after successful request
    }

    setLoading(false); // Set loading state to false once the request is complete
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
          <p className="text-sm text-muted-foreground text-center">
            Enter your email, and we'll send you a link to reset your password.
          </p>
        </CardHeader>
        <form onSubmit={handleForgotPassword}> {/* Handle form submission */}
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state on change
                required // Make the email field required
                disabled={loading} // Disable input when sending email
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading || !email}>
              {loading ? "Sending..." : "Send Reset Link"} {/* Display loading text or button label */}
            </Button>
            <Button variant="ghost" onClick={() => router.push("/login")}>
              Back to Login {/* Navigate back to the login page */}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
