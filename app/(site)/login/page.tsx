"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function LoginPage() {
  const [passcode, setPasscode] = useState('');

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to continue to CloudCurio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => signIn("github")} className="w-full">
            Sign in with GitHub
          </Button>
          <Button onClick={() => signIn("google")} className="w-full">
            Sign in with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signIn("credentials", { passcode });
            }}
            className="space-y-2"
          >
            <Input
              type="password"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Sign in with Passcode
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}