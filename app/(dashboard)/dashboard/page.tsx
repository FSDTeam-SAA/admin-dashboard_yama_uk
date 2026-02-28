"use client";

import { useQuery } from "@tanstack/react-query";
import { CircleDollarSign, Users, UsersRound, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getDashboardStats } from "@/lib/api";
// import { Select } from "@/components/ui/select";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  const stats = [
    { 
      label: "Total Revenue", 
      value: `$${data?.totalRevenue?.toLocaleString() ?? "11,020"}`, 
      icon: CircleDollarSign, 
      color: "text-blue-500", 
      bgColor: "bg-blue-50", 
      border: "border-blue-500" 
    },
    { 
      label: "Total User", 
      value: data?.totalUsers?.toLocaleString() ?? "8,020", 
      icon: Users, 
      color: "text-green-500", 
      bgColor: "bg-green-50", 
      border: "border-green-500" 
    },
    { 
      label: "Total Washer", 
      value: data?.totalWashers?.toLocaleString() ?? "400", 
      icon: UsersRound, 
      color: "text-yellow-500", 
      bgColor: "bg-yellow-50", 
      border: "border-yellow-500" 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Title and Profile (mimicking the top bar in your image) */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
          : stats.map((stat) => (
              <Card key={stat.label} className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-slate-400 font-medium">All Time</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className={`mt-4 h-1 w-2/3 rounded-full bg-slate-100`}>
                    <div className={`h-full rounded-full border-b-2 ${stat.border}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Chart Section */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800">Total wash overview</CardTitle>
          <Select defaultValue="year">
            <SelectTrigger className="w-[120px] bg-slate-50 border-none">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year">This year</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.monthlySeries ?? mockChartData}>
              <defs>
                <linearGradient id="colorWash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="washes" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorWash)" 
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#10b981" 
                strokeWidth={3} 
                fill="transparent" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Top Washer</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-none">
                <TableHead className="font-semibold">Service ID</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Total Work Done</TableHead>
                <TableHead className="font-semibold">Total Amount</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.topWashers ?? mockTableData).map((washer, idx) => (
                <TableRow key={idx} className="border-slate-50 hover:bg-slate-50/50">
                  <TableCell className="text-slate-600">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{washer.name}</TableCell>
                  <TableCell className="text-slate-500">{washer.email}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{washer.totalWorkDone}</TableCell>
                  <TableCell className="text-slate-600 font-medium">${washer.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-600 hover:bg-green-100 border-none px-3 py-1">
                      Active
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Mock data for visual consistency if API is loading/empty
const mockChartData = [
  { month: "Jan", washes: 400, users: 240 },
  { month: "Feb", washes: 300, users: 139 },
  { month: "Mar", washes: 200, users: 980 },
  { month: "Apr", washes: 278, users: 390 },
  { month: "May", washes: 189, users: 480 },
  { month: "Jun", washes: 239, users: 380 },
  { month: "Jul", washes: 349, users: 430 },
];

const mockTableData = [
  { name: "Jon Roy", email: "jon@gmail.com", totalWorkDone: 200, totalAmount: 5000 },
  { name: "Doe Ran", email: "jon@gmail.com", totalWorkDone: 400, totalAmount: 5000 },
  { name: "Yean Jii", email: "jon@gmail.com", totalWorkDone: 100, totalAmount: 5000 },
];