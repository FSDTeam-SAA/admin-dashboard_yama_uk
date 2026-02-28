"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const shellGradient =
  "linear-gradient(176.86deg, #38AAE8 0%, #2C85B5 50%, #1F5F82 100%)";

type SidebarProps = {
  mobile?: boolean;
  onNavigate?: () => void;
  onLogout: () => void;
};

export function Sidebar({ mobile = false, onNavigate, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [openLogout, setOpenLogout] = useState(false);

  return (
    <aside
      className={cn(
        "relative h-full shrink-0",
        mobile ? "w-[260px] px-5 py-6" : "w-[260px] px-6 py-7"
      )}
      style={{ background: shellGradient }}
    >
      {/* Logo */}
      <div className={cn("mb-8 flex justify-center", mobile && "mb-7")}>
        <div className="flex h-[92px] w-[92px] items-center justify-center rounded-2xl border border-white/80 bg-black/90 shadow-sm">
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

      {/* Nav */}
      <nav className={cn("space-y-3", mobile && "space-y-2.5")}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-white/90 transition",
                mobile ? "text-[16px]" : "text-[17px]",
                active ? "bg-[#7fd0ee]/70 text-white shadow-sm" : "hover:bg-white/15"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className={cn("font-medium", active && "font-semibold")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout trigger */}
      <button
        type="button"
        onClick={() => setOpenLogout(true)}
        className={cn(
          "absolute bottom-7 left-6 flex items-center gap-3 text-white/95 transition hover:text-white",
          mobile ? "left-5 text-[16px]" : "text-[17px]"
        )}
      >
        <LogOut className="h-5 w-5" />
        <span className="font-medium">Logout</span>
      </button>

      {/* Logout modal */}
      <AlertDialog open={openLogout} onOpenChange={setOpenLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpenLogout(false);
                onLogout();
              }}
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}