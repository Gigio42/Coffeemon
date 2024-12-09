"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Coffee, Mail, Lock } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5E1D3] bg-opacity-80">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
          filter: "blur(5px)",
        }}
      ></div>
      <Card className="w-full max-w-md bg-white bg-opacity-90 shadow-lg relative z-10">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Coffee className="h-12 w-12 text-[#6F4E37]" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-[#4A3728]">
            Welcome back, coffee lover!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#4A3728]">
                Email
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6F4E37]"
                  size={18}
                />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-[#FFF8E7] border-[#D2B48C] focus:border-[#6F4E37] text-[#4A3728]"
                  placeholder="jane@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#4A3728]">
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6F4E37]"
                  size={18}
                />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-[#FFF8E7] border-[#D2B48C] focus:border-[#6F4E37] text-[#4A3728]"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-[#6F4E37] hover:bg-[#8B4513] text-white"
            >
              Brew me in!
            </Button>
          </form>
          <div className="mt-4">
            <Button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full bg-white text-[#4A3728] hover:bg-[#FFF8E7] border border-[#D2B48C]"
            >
              Sign in with Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-[#4A3728]">
            New to our coffee club?{" "}
            <Link
              href="/auth/register"
              className="text-[#8B4513] hover:underline font-semibold"
            >
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
