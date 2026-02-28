"use client";

import { useQuery } from "@tanstack/react-query";
import { CircleDollarSign, Users, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardStats } from "@/lib/api";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-[#1f2937]">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-44 w-full rounded-2xl" />)
          : [
              {
                label: "Total Revenue",
                value: `$${data?.totalRevenue.toLocaleString()}`,
                icon: CircleDollarSign,
                color: "text-[#278ee2]",
              },
              { label: "Total User", value: data?.totalUsers.toLocaleString(), icon: Users, color: "text-[#24a148]" },
              {
                label: "Total Washer",
                value: data?.totalWashers.toLocaleString(),
                icon: UsersRound,
                color: "text-[#ffcb00]",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.label} className="border-none bg-[#f3f5f7]">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#6b7280]">{card.label}</CardTitle>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-[#1f2937]">{card.value}</p>
                      <Icon className={`h-10 w-10 ${card.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-[#6b7280]">All Time</p>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      <Card className="bg-[#f3f5f7]">
        <CardHeader>
          <CardTitle className="text-base">Total Wash Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-96 w-full rounded-xl" />
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2">
                {data?.monthlySeries.map((item) => (
                  <div key={item.month} className="flex flex-col items-center gap-2">
                    <div className="relative h-56 w-full rounded bg-[#dbe7f0]">
                      <div
                        className="absolute bottom-0 w-full rounded bg-[#8ec7ea]"
                        style={{ height: `${Math.max(item.washes / 4, 12)}px` }}
                      />
                    </div>
                    <span className="text-xs text-[#6b7280]">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#f3f5f7]">
        <CardHeader>
          <CardTitle className="text-base">Top Washer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#cce5f5]">
                <TableRow>
                  <TableHead>Service ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Work Done</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 3 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell colSpan={6}>
                          <Skeleton className="h-12 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : data?.topWashers.map((washer, index) => (
                      <TableRow key={washer._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{washer.name}</TableCell>
                        <TableCell>{washer.email}</TableCell>
                        <TableCell>{washer.totalWorkDone}</TableCell>
                        <TableCell>${washer.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge>Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


