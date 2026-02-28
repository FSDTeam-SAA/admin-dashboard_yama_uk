"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const shellGradient =
  "linear-gradient(176.86deg, #38AAE8 0%, #2C85B5 50%, #1F5F82 100%)";

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-20 flex h-20 items-center justify-between px-4 lg:px-8"
      style={{ background: shellGradient }}
    >
      <Button
        variant="ghost"
        className="text-white lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div className="ml-auto flex items-center gap-4 text-white">
        <Bell className="h-5 w-5" />
        <span className="text-sm font-medium">Mr. Raja</span>
        <div className="h-9 w-9 rounded-full bg-[#0f172a]" />
      </div>
    </header>
  );
}