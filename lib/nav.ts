import { BarChart3, CircleDollarSign, LayoutDashboard, LogOut, Settings, TicketPercent, Users, UsersRound } from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "User list", icon: Users },
  { href: "/washers", label: "Washer list", icon: UsersRound },
  { href: "/revenue", label: "Revenue", icon: CircleDollarSign },
  { href: "/services", label: "Services", icon: Settings },
  { href: "/coupons", label: "Coupon Making", icon: TicketPercent },
  { href: "/payment-dispute", label: "Payment/Dispute", icon: BarChart3 },
];

export const logoutItem = { href: "/login", label: "Logout", icon: LogOut };
