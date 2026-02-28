"use client";

import * as React from "react";
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

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    mutation.mutate({ email, otp, password });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eceeef] px-4">
      <div className="w-full max-w-[760px] rounded-2xl p-6 md:p-10">
        <h1 className="text-5xl font-bold text-black">Reset Password</h1>
        <p className="mb-8 text-xl text-[#9a9a9a]">Create your new password</p>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-lg font-medium text-black">New Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="h-16 text-lg"
            />
          </div>
          <div>
            <label className="mb-2 block text-lg font-medium text-black">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter confirm new password"
              className="h-16 text-lg"
            />
          </div>
          <Button className="h-16 w-full text-xl" disabled={mutation.isPending} onClick={submit}>
            {mutation.isPending ? "Updating..." : "Continue"}
          </Button>
        </div>
      </div>
    </main>
  );
}


