"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { forgotPassword, getErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("OTP sent to your email");
      router.push(`/otp?email=${encodeURIComponent(email)}`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

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

        <h1 className="text-center text-[34px] font-extrabold leading-tight text-black">
          Forgot Password
        </h1>
        <p className="mt-2 text-center text-[18px] text-[#9a9a9a]">
          Enter your registered email address. We&apos;ll send you a code to reset your password.
        </p>

        <div className="mx-auto mt-8 w-full max-w-[420px] space-y-4">
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

          <Button
            className="h-12 w-full bg-sky-500 text-[14px] font-medium hover:bg-sky-600"
            onClick={() => mutation.mutate(email)}
            disabled={mutation.isPending || !email}
          >
            {mutation.isPending ? "Sending..." : "Send OTP"}
          </Button>

          {/* Optional back to login (nice UX, but you can remove) */}
          <button
            type="button"
            className="mx-auto block text-[12px] text-[#374151]"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </main>
  );
}