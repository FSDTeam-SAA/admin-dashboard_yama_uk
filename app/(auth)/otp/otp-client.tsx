"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function OtpClientPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);

  const update = (index: number, value: string) => {
    const next = [...otp];
    next[index] = value.replace(/[^0-9]/g, "").slice(0, 1);
    setOtp(next);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eceeef] px-4">
      <div className="w-full max-w-[760px] rounded-2xl p-6 md:p-10">
        <h1 className="text-5xl font-bold text-black">Enter OTP</h1>
        <p className="mb-8 text-xl text-[#9a9a9a]">We have shared a code to {email || "your email address"}</p>

        <div className="mb-6 flex gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              value={digit}
              onChange={(e) => update(index, e.target.value)}
              className="h-20 w-20 rounded-xl border border-[#8cc4ea] text-center text-lg text-[#3ea0d8] focus:outline-none"
            />
          ))}
        </div>

        <Button
          className="h-16 w-full text-xl"
          onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${otp.join("")}`)}
          disabled={otp.join("").length !== 6}
        >
          Verify
        </Button>
      </div>
    </main>
  );
}


