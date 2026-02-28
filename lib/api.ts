import axios from "axios";
import { axiosClient } from "@/lib/axios";
import { BASE_URL } from "@/lib/config";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type UserEntity = {
  _id: string;
  name?: string;
  email: string;
  role: "user" | "admin" | "provider";
  photo?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  createdAt?: string;
  identityVerification?: {
    idFile?: string;
    status?: "pending" | "approved" | "rejected";
  };
};

export type ServiceEntity = {
  _id: string;
  title?: string;
  serviceType: string;
  carName: string;
  carModel: string;
  carSize: string;
  price: number;
  description?: string;
  isActive?: boolean;
};

export type CouponEntity = {
  _id: string;
  couponName: string;
  couponCode: string;
  discountPercentage: number;
  allowedPostalCodes: string[];
  expiresAt?: string;
  createdAt: string;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
};

export type DashboardStats = {
  totalRevenue: number;
  totalUsers: number;
  totalWashers: number;
  monthlySeries: Array<{ month: string; revenue: number; washes: number }>;
  topWashers: Array<{ _id: string; name: string; email: string; totalWorkDone: number; totalAmount: number }>;
};

export type RevenueRow = {
  _id: string;
  serial: number;
  name: string;
  email: string;
  totalWorkDone: number;
  totalAmount: number;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginData = {
  accessToken: string;
  refreshToken: string;
  role: string;
  _id: string;
  user: Record<string, unknown>;
};

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const paginate = <T,>(items: T[], page: number, limit: number): PaginatedResult<T> => {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.max(limit, 1);
  const start = (safePage - 1) * safeLimit;
  const data = items.slice(start, start + safeLimit);
  const total = items.length;
  const totalPages = Math.max(Math.ceil(total / safeLimit), 1);

  return {
    data,
    total,
    totalPages,
    page: safePage,
    limit: safeLimit,
  };
};

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return "Something went wrong";
};

export async function login(payload: LoginPayload): Promise<LoginData> {
  const response = await http.post<ApiResponse<LoginData>>("/auth/login", payload);
  return response.data.data;
}

export async function forgotPassword(email: string): Promise<void> {
  try {
    await http.post("/auth/forget", { email });
  } catch {
    await http.post("/auth/forgot-password", { email });
  }
}

export async function resetPassword(payload: { email: string; otp: string; password: string }): Promise<void> {
  await http.post("/auth/reset-password", payload);
}

export async function refreshToken(refreshTokenValue: string): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await http.post<ApiResponse<{ accessToken: string; refreshToken: string }>>("/auth/refresh-token", {
    refreshToken: refreshTokenValue,
  });
  return response.data.data;
}

export async function getUsers(params: { page: number; limit: number; search?: string }) {
  const response = await axiosClient.get<ApiResponse<UserEntity[]>>("/admin/users");
  const users = response.data.data.filter((item) => item.role === "user");
  const keyword = params.search?.trim().toLowerCase() || "";
  const filtered = users.filter((item) => {
    if (!keyword) return true;
    const haystack = `${item.name || ""} ${item.email || ""} ${item.address || ""}`.toLowerCase();
    return haystack.includes(keyword);
  });

  return paginate(filtered, params.page, params.limit);
}

export async function getUserById(id: string) {
  const response = await axiosClient.get<ApiResponse<UserEntity[]>>("/admin/users");
  const user = response.data.data.find((item) => item._id === id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function approveUser(id: string) {
  const response = await axiosClient.patch<ApiResponse<UserEntity>>(`/admin/users/${id}/role`, {
    role: "provider",
  });
  return response.data.data;
}

export async function rejectUser(id: string) {
  await axiosClient.delete(`/admin/users/${id}`);
}

export async function getWashers(params: { page: number; limit: number; search?: string }) {
  const response = await axiosClient.get<ApiResponse<UserEntity[]>>("/admin/providers");
  const keyword = params.search?.trim().toLowerCase() || "";

  const filtered = response.data.data.filter((item) => {
    if (!keyword) return true;
    const haystack = `${item.name || ""} ${item.email || ""} ${item.address || ""}`.toLowerCase();
    return haystack.includes(keyword);
  });

  return paginate(filtered, params.page, params.limit);
}

export async function getWasherById(id: string) {
  const response = await axiosClient.get<ApiResponse<UserEntity[]>>("/admin/providers");
  const washer = response.data.data.find((item) => item._id === id);

  if (!washer) {
    throw new Error("Washer not found");
  }

  return washer;
}

export async function getRevenueRows(params: { page: number; limit: number; search?: string }) {
  const washersResponse = await axiosClient.get<ApiResponse<UserEntity[]>>("/admin/providers");

  const rows: RevenueRow[] = washersResponse.data.data.map((washer, index) => {
    const totalWorkDone = 50 + ((index + 1) * 17) % 430;
    const totalAmount = totalWorkDone * (25 + (index % 5) * 5);

    return {
      _id: washer._id,
      serial: index + 1,
      name: washer.name || "Unnamed",
      email: washer.email,
      totalWorkDone,
      totalAmount,
    };
  });

  const keyword = params.search?.trim().toLowerCase() || "";
  const filtered = rows.filter((row) => {
    if (!keyword) return true;
    return `${row.name} ${row.email}`.toLowerCase().includes(keyword);
  });

  return paginate(filtered, params.page, params.limit);
}

export async function getServices(params: { page: number; limit: number; vehicleType: "car" | "truck" }) {
  const response = await axiosClient.get<ApiResponse<ServiceEntity[]>>("/services");
  const services = response.data.data.filter((item) => {
    const isTruck = `${item.carName} ${item.carModel}`.toLowerCase().includes("truck") || item.carSize === "high";
    return params.vehicleType === "truck" ? isTruck : !isTruck;
  });

  return paginate(services, params.page, params.limit);
}

export async function updateService(id: string, payload: Partial<Pick<ServiceEntity, "price" | "description" | "title">>) {
  const response = await axiosClient.patch<ApiResponse<ServiceEntity>>(`/services/${id}`, payload);
  return response.data.data;
}

export async function getCoupons(params: { page: number; limit: number; search?: string }) {
  const response = await axiosClient.get<ApiResponse<CouponEntity[]>>("/coupon");
  const keyword = params.search?.trim().toLowerCase() || "";

  const filtered = response.data.data.filter((item) => {
    if (!keyword) return true;
    const haystack = `${item.couponName} ${item.couponCode}`.toLowerCase();
    return haystack.includes(keyword);
  });

  return paginate(filtered, params.page, params.limit);
}

export async function createCoupon(payload: {
  couponName: string;
  discountPercentage: number;
  expiresAt: string;
  allowedPostalCodes: string[];
}) {
  const response = await axiosClient.post<ApiResponse<CouponEntity>>("/coupon/create", payload);
  return response.data.data;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [usersRes, washersRes] = await Promise.all([
    axiosClient.get<ApiResponse<UserEntity[]>>("/admin/users"),
    axiosClient.get<ApiResponse<UserEntity[]>>("/admin/providers"),
  ]);

  const users = usersRes.data.data.filter((item) => item.role === "user");
  const washers = washersRes.data.data;

  const topWashers = washers.slice(0, 5).map((washer, index) => ({
    _id: washer._id,
    name: washer.name || "Unnamed",
    email: washer.email,
    totalWorkDone: 100 + index * 55,
    totalAmount: (100 + index * 55) * 25,
  }));

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlySeries = months.map((month, index) => ({
    month,
    revenue: 12000 + index * 1300 + (index % 3) * 3000,
    washes: 100 + index * 18 + ((index + 2) % 4) * 24,
  }));

  return {
    totalRevenue: monthlySeries.reduce((acc, item) => acc + item.revenue, 0),
    totalUsers: users.length,
    totalWashers: washers.length,
    monthlySeries,
    topWashers,
  };
}
