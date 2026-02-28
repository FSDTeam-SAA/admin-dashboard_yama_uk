"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage, resetPassword } from "@/lib/api";

export function ResetPasswordClientPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const otp = params.get("otp") || "";

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successful");
      router.push("/login");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const submit = () => {
    if (!email || !otp) {
      toast.error("Email or OTP missing");
      return;
    }

    if (!password) {
      toast.error("Please enter a new password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    mutation.mutate({ email, otp, password });
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

        <h1 className="text-center text-[34px] font-extrabold leading-tight text-black">
          Reset Password
        </h1>
        <p className="mt-2 text-center text-[18px] text-[#9a9a9a]">
          Create your new password
        </p>

        <div className="mx-auto mt-8 w-full max-w-[420px] space-y-4">
          <div>
            <label className="mb-2 block text-[14px] font-medium text-black">
              New Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="h-12"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-black">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="h-12"
              autoComplete="new-password"
            />
          </div>

          <Button
            className="h-12 w-full bg-sky-500 text-[14px] font-medium hover:bg-sky-600"
            disabled={mutation.isPending}
            onClick={submit}
          >
            {mutation.isPending ? "Updating..." : "Continue"}
          </Button>

          {/* Optional */}
          <button
            type="button"
            className="mx-auto mt-2 block text-[12px] text-[#374151]"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </main>
  );
}