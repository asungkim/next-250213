import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ClientLayout from "./ClientLayout";
import client from "@/src/lib/client";
import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const myCookie = await cookies();
  const { isLogin, payload } = parseAccessToken(myCookie.get("accessToken"));

  const me = isLogin
    ? {
        id: payload.id,
        nickname: payload.nickname,
      }
    : {
        id: 0,
        nickname: "",
      };

  return <ClientLayout me={me}>{children}</ClientLayout>;
}

function parseAccessToken(accessToken: RequestCookie | undefined) {
  let isExpired = true;
  let payload = null;

  if (accessToken) {
    try {
      const tokenParts = accessToken.value.split(".");
      payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString());
      const expTimestamp = payload.exp * 1000;
      isExpired = Date.now() > expTimestamp;
    } catch (e) {
      console.error("파싱 중 오류 발생 : ", e);
    }
  }

  let isLogin = payload != null;

  return { isLogin, isExpired, payload };
}
