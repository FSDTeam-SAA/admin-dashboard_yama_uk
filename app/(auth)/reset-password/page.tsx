import { Suspense } from "react";
import { ResetPasswordClientPage } from "@/app/(auth)/reset-password/reset-password-client";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#eceeef]" />}>
      <ResetPasswordClientPage />
    </Suspense>
  );
}
