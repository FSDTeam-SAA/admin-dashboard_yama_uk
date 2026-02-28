"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      // optional: pass remember flag if your backend uses it
      remember,
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
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-[520px]">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-[92px] w-[92px] items-center justify-center rounded-2xl bg-black shadow-sm">
            <Image
              src="/logo.png"
              alt="Logo"
              width={72}
              height={72}
              className="h-[62px] w-[62px] object-contain"
              priority
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-[34px] font-extrabold leading-tight text-black">
          Login to Account
        </h1>
        <p className="mt-2 text-center text-[18px] text-[#9a9a9a]">
          Please enter your email and password to continue
        </p>

        {/* Form */}
        <form onSubmit={onSubmit} className="mx-auto mt-8 w-full max-w-[420px] space-y-4">
          <div>
            <label className="mb-2 block text-[14px] font-medium text-black">
              Email Address
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="h-12"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-black">
              Password
            </label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12"
              type="password"
              autoComplete="current-password"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-end pt-1">

            <button
              type="button"
              className="text-[12px] text-[#374151]"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            className="h-12 w-full bg-sky-500 text-[14px] font-medium hover:bg-sky-600"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}