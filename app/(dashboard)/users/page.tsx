"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Check, Eye, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { getUsers } from "@/lib/api";

export default function UsersPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, search],
    queryFn: () => getUsers({ page, limit: 10, search }),
  });

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="mb-10 text-4xl font-semibold text-[#1f2937]">User list</h1>

      <div className="w-full">
        {/* Table Header */}
        <div className="grid grid-cols-[1.5fr_2fr_0.5fr_1fr] px-4 pb-6 text-xl font-bold text-black">
          <div>User Name</div>
          <div>User Location</div>
          <div className="text-center">Age</div>
          <div className="text-center">Action</div>
        </div>

        {/* Table Body */}
        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-xl" />
            ))
          ) : (
            data?.data.map((user) => {
              // Calculate age or default to 25 as per mock image
              const age = user.dateOfBirth
                ? Math.max(new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear(), 18)
                : 25;

              return (
                <div
                  key={user._id}
                  className="grid grid-cols-[1.5fr_2fr_0.5fr_1fr] items-center border-b border-gray-100 px-4 pb-6 transition-hover hover:bg-gray-50/50"
                >
                  {/* User Identity */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border border-gray-100 shadow-sm">
                      <AvatarImage src={user.photo} alt={user.name} />
                      <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-gray-900">
                        {user.name || "Darrell"}
                      </span>
                      <span className="text-sm text-gray-400">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="text-lg text-gray-600">
                    {user.address || "Jenaer Strasse 39, City: Duisburg"}
                  </div>

                  {/* Age */}
                  <div className="text-center text-lg text-gray-600">
                    {age}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-6">
                    <Link href={`/users/${user._id}`} className="transition-transform hover:scale-110">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100">
                        <Eye className="h-6 w-6" />
                      </div>
                    </Link>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-500 hover:bg-green-100 transition-colors">
                      <Check className="h-6 w-6" />
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                      <Trash2 className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <Pagination page={page} totalPages={data?.totalPages || 1} onChange={setPage} />
      </div>
    </div>
  );
}