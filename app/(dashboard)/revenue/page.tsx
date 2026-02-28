"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { getRevenueRows } from "@/lib/api";

export default function RevenuePage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["revenue", page, search],
    queryFn: () => getRevenueRows({ page, limit: 10, search }),
  });
  const from = ((data?.page || 1) - 1) * (data?.limit || 10) + (data?.total ? 1 : 0);
  const to = Math.min((data?.page || 1) * (data?.limit || 10), data?.total || 0);

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-[#1f2937]">Revenue</h1>

      <Input
        value={search}
        onChange={(event) => {
          setPage(1);
          setSearch(event.target.value);
        }}
        className="max-w-3xl bg-[#f4f6f8] text-base"
        placeholder="Search shops..."
      />

      <div className="overflow-x-auto rounded-2xl border border-[#b9bfc8] bg-[#f4f6f8]">
        <table className="min-w-full">
          <thead className="bg-[#cce5f5] text-left text-3xl font-semibold">
            <tr>
              <th className="px-4 py-4">Serial No.</th>
              <th className="px-4 py-4">Name</th>
              <th className="px-4 py-4">Email</th>
              <th className="px-4 py-4">Total Work Done</th>
              <th className="px-4 py-4">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={5} className="px-4 py-3">
                      <Skeleton className="h-12 w-full" />
                    </td>
                  </tr>
                ))
              : data?.data.map((row) => (
                  <tr key={row._id} className="border-b border-[#d2d7dc] text-[17px]">
                    <td className="px-4 py-4">{row.serial}</td>
                    <td className="px-4 py-4">{row.name}</td>
                    <td className="px-4 py-4">{row.email}</td>
                    <td className="px-4 py-4">{row.totalWorkDone}</td>
                    <td className="px-4 py-4">${row.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
          </tbody>
        </table>
        <div className="flex flex-col items-start justify-between gap-3 p-4 text-base text-[#6b7280] md:flex-row md:items-center">
          <p>
            Showing {from}-{to} from {data?.total || 0}
          </p>
          <Pagination page={page} totalPages={data?.totalPages || 1} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}


