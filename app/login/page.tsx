"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/card";
import { Label } from "@/components/label";
import Link from "next/link";
import { LogIn, Mail, Lock } from "lucide-react";
import Image from "next/image";
import { useLoginActions } from "@/app/login/action";

export default function LoginPage() {
  const { email, setEmail, password, setPassword, loading, handleSubmit } = useLoginActions();

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: "-2s" }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: "-4s" }}></div>
      </div>

      <div className="flex w-full max-w-6xl gap-8 items-center relative z-10">
        {/* Left side - Illustration */}
        <div className="hidden lg:block w-1/2 animate-float">
          <Image
            src="./images/login.jpg"
            alt="Abstract Decoration"
            width={600}
            height={600}
            className="rounded-2xl shadow-2xl animate-pulse-slow"
          />
        </div>

        {/* Right side - Form */}
        <Card className="w-full lg:w-1/2 max-w-md backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-xl animate-slide-in">
          <CardHeader>
            <div className="text-center">
              <LogIn className="mx-auto h-12 w-12 text-primary animate-glow" />
              <h2 className="mt-6 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}> {/* Handle form submission */}
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 animate-glow" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Handle email change
                  required
                  disabled={loading}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500 hover:ring-1 hover:ring-blue-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 animate-glow" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Handle password change
                  required
                  disabled={loading}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500 hover:ring-1 hover:ring-blue-300"
                />
                <div className="text-right text-sm">
                  <Link href="/forgot-password" className="text-blue-500 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full glow-effect bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300" disabled={loading || !email || !password}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline hover:text-blue-400 transition-colors duration-300">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}