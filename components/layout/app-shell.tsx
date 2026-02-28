"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import * as React from "react";
import { Header } from "@/components/layout/header";
import { LogoutConfirmModal } from "@/components/layout/logout-confirm-modal";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [logoutOpen, setLogoutOpen] = React.useState(false);

  const confirmLogout = async () => {
    setLogoutOpen(false);
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#dde0e5]">
      {/* Desktop sidebar */}
      <div className="fixed left-0 top-0 z-30 hidden h-screen lg:block">
        <Sidebar onLogout={() => setLogoutOpen(true)} />
      </div>

      {/* Header */}
      <Header onMenuClick={() => setMobileOpen((prev) => !prev)} />

      {/* Mobile sidebar overlay */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              mobile
              onNavigate={() => setMobileOpen(false)}
              onLogout={() => setLogoutOpen(true)}
            />
          </div>
        </div>
      ) : null}

      {/* Logout modal */}
      <LogoutConfirmModal
        open={logoutOpen}
        onNo={() => setLogoutOpen(false)}
        onYes={confirmLogout}
      />

      {/* Main */}
      <main className="px-4 pb-8 pt-28 lg:ml-[240px] lg:px-8">
        {children}
      </main>
    </div>
  );
}