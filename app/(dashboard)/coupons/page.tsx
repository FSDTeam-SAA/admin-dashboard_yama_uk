"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { createCoupon, getCoupons, getErrorMessage } from "@/lib/api";

export default function CouponsPage() {
  const [couponName, setCouponName] = React.useState("");
  const [discount, setDiscount] = React.useState("");
  const [expiresAt, setExpiresAt] = React.useState("");
  const [postalCodes, setPostalCodes] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["coupons", page, search],
    queryFn: () => getCoupons({ page, limit: 8, search }),
  });

  const mutation = useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      toast.success("Coupon generated");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setCouponName("");
      setDiscount("");
      setExpiresAt("");
      setPostalCodes("");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-[#1f2937]">Coupon Making</h1>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="space-y-4 rounded-2xl bg-[#f4f6f8] p-6">
          <p className="text-base text-[#374151]">Coupon code must be 6 characters long and include both letters and numbers.</p>
          <Input value={couponName} onChange={(e) => setCouponName(e.target.value)} placeholder="Coupon code" className="bg-white text-base" />

          <label className="text-lg font-semibold">Set Coupon %</label>
          <Input value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Input Percentage%" className="bg-white text-base" />

          <label className="text-lg font-semibold">Validation</label>
          <Input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="max-w-[200px] bg-white text-base" />

          <label className="text-lg font-semibold">Allowed Postal Codes (comma separated)</label>
          <Input
            value={postalCodes}
            onChange={(e) => setPostalCodes(e.target.value)}
            placeholder="E1 6AN, B10 0AD"
            className="bg-white text-base"
          />

          <Button
            className="h-12 text-lg"
            onClick={() =>
              mutation.mutate({
                couponName,
                discountPercentage: Number(discount),
                expiresAt,
                allowedPostalCodes: postalCodes.split(",").map((item) => item.trim()).filter(Boolean),
              })
            }
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Generating..." : "Generate Coupon"}
          </Button>
        </div>

        <div className="space-y-4 rounded-2xl bg-[#f4f6f8] p-6">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users" className="bg-white text-base" />

          <div className="max-h-[560px] overflow-auto rounded-xl border border-[#d2d7dc]">
            <table className="min-w-full">
              <thead className="bg-[#cce5f5] text-left text-lg font-semibold">
                <tr>
                  <th className="px-4 py-3">Coupon</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Expires</th>
                  <th className="px-4 py-3">Codes</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, index) => (
                      <tr key={index}>
                        <td colSpan={4} className="px-4 py-3">
                          <Skeleton className="h-10 w-full" />
                        </td>
                      </tr>
                    ))
                  : data?.data.map((coupon) => (
                      <tr key={coupon._id} className="border-b border-[#d2d7dc] text-base">
                        <td className="px-4 py-3">
                          <p className="font-semibold">{coupon.couponCode}</p>
                          <p className="text-[#6b7280]">{coupon.couponName}</p>
                        </td>
                        <td className="px-4 py-3">{coupon.discountPercentage}%</td>
                        <td className="px-4 py-3">{coupon.expiresAt ? format(new Date(coupon.expiresAt), "dd MMM yyyy") : "N/A"}</td>
                        <td className="px-4 py-3">{coupon.allowedPostalCodes.join(", ")}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Pagination page={page} totalPages={data?.totalPages || 1} onChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
}


