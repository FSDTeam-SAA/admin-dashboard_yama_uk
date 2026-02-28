"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Check, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { getUsers } from "@/lib/api";

export default function UsersPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, search],
    queryFn: () => getUsers({ page, limit: 9, search }),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-[#1f2937]">User List</h1>
      <Input
        placeholder="Search users"
        value={search}
        onChange={(event) => {
          setPage(1);
          setSearch(event.target.value);
        }}
        className="max-w-xl bg-[#f4f6f8] text-base"
      />

      <div className="overflow-x-auto rounded-2xl bg-[#f4f6f8] p-4">
        <div className="min-w-[820px]">
          <div className="grid grid-cols-[2fr_2.5fr_1fr_1fr] border-b border-[#d2d7dc] pb-3 text-[17px] font-semibold">
            <p>User Name</p>
            <p>User Location</p>
            <p>Age</p>
            <p>Action</p>
          </div>
          <div className="space-y-4 pt-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-16 w-full" />)
              : data?.data.map((user) => {
                  const age = user.dateOfBirth
                    ? Math.max(new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear(), 18)
                    : 25;

                  return (
                    <div key={user._id} className="grid grid-cols-[2fr_2.5fr_1fr_1fr] items-center border-b border-[#d2d7dc] pb-3 text-[17px]">
                      <div>
                        <p className="font-semibold text-[#111827]">{user.name || "Unnamed"}</p>
                        <p className="text-[#6b7280]">{user.email}</p>
                      </div>
                      <p>{user.address || "Jenaer Strasse 39, City: Duisburg"}</p>
                      <p>{age}</p>
                      <div className="flex items-center gap-4">
                        <Link href={`/users/${user._id}`}>
                          <Eye className="h-5 w-5 text-[#6b7280]" />
                        </Link>
                        <Check className="h-5 w-5 text-[#22c55e]" />
                        <Trash2 className="h-5 w-5 text-[#ef4444]" />
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Pagination page={page} totalPages={data?.totalPages || 1} onChange={setPage} />
      </div>
    </div>
  );
}


