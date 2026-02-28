"use client";

import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { BASE_URL } from "@/lib/config";

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await signOut({ callbackUrl: "/login" });
    }

    return Promise.reject(error);
  },
);
