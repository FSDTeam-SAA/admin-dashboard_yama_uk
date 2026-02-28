"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("admin@gmail.com");
  const [password, setPassword] = React.useState("123456");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.ok) {
      toast.success("Login successful");
      router.push("/dashboard");
      return;
    }

    toast.error("Invalid email or password");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eceeef] px-4">
      <div className="w-full max-w-[760px] rounded-2xl p-6 md:p-10">
        <div className="mb-8 flex justify-center">
          <div className="flex h-44 w-44 items-center justify-center rounded-4xl border border-white bg-black text-6xl font-bold text-white">e</div>
        </div>
        <h1 className="text-center text-5xl font-bold text-black">Login to Account</h1>
        <p className="mb-8 text-center text-xl text-[#9a9a9a]">Please enter your email and password to continue</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-lg font-medium text-black">Email Address</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="h-16 text-lg" />
          </div>

          <div>
            <label className="mb-2 block text-lg font-medium text-black">Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-16 text-lg"
              type="password"
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 text-xl text-[#4b5563]">
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#3ea0d8]" />
              Remember Me
            </label>
            <button type="button" className="text-xl text-[#374151]" onClick={() => router.push("/forgot-password")}>
              Forgot Password?
            </button>
          </div>

          <Button type="submit" className="h-16 w-full text-xl" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}


