import { NextRequest, NextResponse } from "next/server";
import client from "./src/lib/client";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const reqToken = request.cookies.get("accessToken");
  const nextResponse = NextResponse.next();

  const response = await client.GET("/api/v1/members/me", {
    headers: {
      cookie: (await cookies()).toString(),
    },
  });

  const spirngCookie = response.response.headers.getSetCookie();
  nextResponse.headers.set("set-cookie", String(spirngCookie));

  return nextResponse;
}

export const config = {
  matchers: "/:path*",
};
