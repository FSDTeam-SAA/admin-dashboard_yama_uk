import { Suspense } from "react";
import { OtpClientPage } from "@/app/(auth)/otp/otp-client";

export default function OtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#eceeef]" />}>
      <OtpClientPage />
    </Suspense>
  );
}
