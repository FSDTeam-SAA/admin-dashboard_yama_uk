"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Check, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { getWashers } from "@/lib/api";

export default function WashersPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["washers", page, search],
    queryFn: () => getWashers({ page, limit: 9, search }),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-[#1f2937]">Washer List</h1>
      <Input
        placeholder="Search washers"
        value={search}
        onChange={(event) => {
          setPage(1);
          setSearch(event.target.value);
        }}
        className="max-w-xl bg-[#f4f6f8] text-base"
      />

      <div className="overflow-x-auto rounded-2xl bg-[#f4f6f8] p-4">
        <div className="min-w-[920px]">
          <div className="grid grid-cols-[2fr_2.5fr_1fr_1fr] border-b border-[#d2d7dc] pb-3 text-[17px] font-semibold">
            <p>Washer Name</p>
            <p>Washer Location</p>
            <p>Age Range</p>
            <p>Action</p>
          </div>
          <div className="space-y-4 pt-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-16 w-full" />)
              : data?.data.map((washer) => (
                  <div key={washer._id} className="grid grid-cols-[2fr_2.5fr_1fr_1fr] items-center border-b border-[#d2d7dc] pb-3 text-[17px]">
                    <div>
                      <p className="font-semibold text-[#111827]">{washer.name || "Unnamed"}</p>
                      <p className="text-[#6b7280]">{washer.email}</p>
                    </div>
                    <p>{washer.address || "Jenaer Strasse 39, City: Duisburg"}</p>
                    <p>25-35</p>
                    <div className="flex items-center gap-4">
                      <Link href={`/washers/${washer._id}`}>
                        <Eye className="h-5 w-5 text-[#6b7280]" />
                      </Link>
                      <Check className="h-5 w-5 text-[#22c55e]" />
                      <Trash2 className="h-5 w-5 text-[#ef4444]" />
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Pagination page={page} totalPages={data?.totalPages || 1} onChange={setPage} />
      </div>
    </div>
  );
}


