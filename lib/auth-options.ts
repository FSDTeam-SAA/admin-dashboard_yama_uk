import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { BASE_URL } from "@/lib/config";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    role: string;
    _id: string;
    user: Record<string, unknown>;
  };
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const payload: LoginPayload = {
          email: String(credentials.email || ""),
          password: String(credentials.password || ""),
        };

        const response = await fetch(`${BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          cache: "no-store",
        });

        const result = (await response.json()) as LoginResponse;

        if (!response.ok || !result.success) {
          return null;
        }

        return {
          id: result.data._id,
          email: payload.email,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
          role: result.data.role,
          _id: result.data._id,
          user: result.data.user,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token._id = user._id;
        token.user = user.user;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.role = token.role as string;
      session._id = token._id as string;
      session.user = {
        ...session.user,
        role: token.role as string,
        _id: token._id as string,
        raw: (token.user as Record<string, unknown>) || {},
      };
      return session;
    },
  },
};
