"use client";

import * as React from "react";
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
    <main className="flex min-h-screen items-center justify-center bg-[#eceeef] px-4">
      <div className="w-full max-w-[760px] rounded-2xl p-6 md:p-10">
        <div className="mb-8 flex justify-center">
          <div className="flex h-44 w-44 items-center justify-center rounded-4xl border border-white bg-black text-6xl font-bold text-white">e</div>
        </div>
        <h1 className="text-5xl font-bold text-black">Forgot Password</h1>
        <p className="mb-8 text-xl text-[#9a9a9a]">Enter your registered email address. We&apos;ll send you a code to reset your password.</p>

        <div className="space-y-4">
          <label className="block text-lg font-medium text-black">Email Address</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="h-16 text-lg" />
          <Button className="h-16 w-full text-xl" onClick={() => mutation.mutate(email)} disabled={mutation.isPending || !email}>
            {mutation.isPending ? "Sending..." : "Send OTP"}
          </Button>
        </div>
      </div>
    </main>
  );
}


