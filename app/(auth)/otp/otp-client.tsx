"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function OtpClientPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);

  const refs = React.useRef<Array<HTMLInputElement | null>>([]);

  const update = (index: number, value: string) => {
    const v = value.replace(/[^0-9]/g, "").slice(0, 1);

    const next = [...otp];
    next[index] = v;
    setOtp(next);

    if (v && index < 5) refs.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const code = otp.join("");

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
          Enter OTP
        </h1>
        <p className="mt-2 text-center text-[18px] text-[#9a9a9a]">
          We have shared a code to{" "}
          <span className="text-[#374151]">{email || "your email address"}</span>
        </p>

        <div className="mx-auto mt-8 w-full max-w-[420px]">
          <div className="mb-6 flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  refs.current[index] = el;
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                value={digit}
                onChange={(e) => update(index, e.target.value)}
                onKeyDown={(e) => onKeyDown(index, e)}
                className="h-12 w-12 rounded-xl border border-[#cfe8f6] text-center text-[16px] text-black outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            ))}
          </div>

          <Button
            className="h-12 w-full bg-sky-500 text-[14px] font-medium hover:bg-sky-600"
            onClick={() =>
              router.push(
                `/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(code)}`
              )
            }
            disabled={code.length !== 6}
          >
            Verify
          </Button>

          {/* Optional */}
          <button
            type="button"
            className="mx-auto mt-4 block text-[12px] text-[#374151]"
            onClick={() => router.push(`/forgot-password`)}
          >
            Didn&apos;t get a code? Try again
          </button>
        </div>
      </div>
    </main>
  );
}