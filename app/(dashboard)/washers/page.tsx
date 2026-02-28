"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Check, Eye, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { getWashers } from "@/lib/api";

export default function WashersPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["washers", page, search],
    queryFn: () => getWashers({ page, limit: 10, search }),
  });

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Page Title */}
      <h1 className="mb-10 text-4xl font-semibold text-[#1f2937]">Washer list</h1>

      <div className="w-full">
        {/* Table Header - Pixel Perfect Alignment */}
        <div className="grid grid-cols-[1.5fr_2fr_0.5fr_1fr] px-4 pb-6 text-xl font-bold text-black">
          <div>Washer Name</div>
          <div>Washer Location</div>
          <div className="text-center">Age Range</div>
          <div className="text-center">Action</div>
        </div>

        {/* Table Body */}
        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-xl" />
            ))
          ) : (
            data?.data.map((washer) => (
              <div
                key={washer._id}
                className="grid grid-cols-[1.5fr_2fr_0.5fr_1fr] items-center border-b border-gray-100 px-4 pb-6 transition-all hover:bg-gray-50/30"
              >
                {/* Washer Identity Column */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border border-gray-100 shadow-sm">
                    {/* Ensure photo path is handled correctly if it's a relative backend path */}
                    <AvatarImage 
                      src={washer.photo?.startsWith('http') ? washer.photo : `/${washer.photo}`} 
                      alt={washer.name} 
                    />
                    <AvatarFallback className="bg-slate-100 text-slate-600 font-bold uppercase">
                      {washer.name?.charAt(0) || "W"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-900 leading-tight">
                      {washer.name || "Unnamed"}
                    </span>
                    <span className="text-sm text-gray-400">
                      {washer.email}
                    </span>
                  </div>
                </div>

                {/* Location Column */}
                <div className="text-lg text-gray-600">
                  {washer.address || "Jenaer Strasse 39, City: Duisburg"}
                </div>

                {/* Age Range Column */}
                <div className="text-center text-lg text-gray-600">
                  25-35
                </div>

                {/* Action Buttons Column */}
                <div className="flex items-center justify-center gap-6">
                  <Link href={`/washers/${washer._id}`}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors shadow-sm">
                      <Eye className="h-6 w-6" />
                    </div>
                  </Link>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-500 hover:bg-green-100 transition-colors shadow-sm">
                    <Check className="h-6 w-6" />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors shadow-sm">
                    <Trash2 className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination Container */}
      <div className="mt-10 flex justify-end">
        <Pagination page={page} totalPages={data?.totalPages || 1} onChange={setPage} />
      </div>
    </div>
  );
}