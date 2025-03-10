import { NextRequest, NextResponse } from "next/server";
import client from "./lib/client";
import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function middleware(request: NextRequest) {
  const myCookies = await cookies();
  const { isLogin, isExpired, payload } = parseAccessToken(
    myCookies.get("accessToken")
  );

  if (isLogin && isExpired) {
    return refreshAccessToken();
  }

  if (!isLogin && isProtectedRoute(request.nextUrl.pathname)) {
    return createUnauthorizedResponse();
  }
}

async function refreshAccessToken() {
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

function createUnauthorizedResponse(): NextResponse {
  return new NextResponse("로그인이 필요합니다.", {
    status: 401,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

function isProtectedRoute(pathname: string) {
  return (
    pathname.startsWith("/post/write") || pathname.startsWith("/post/edit")
  );
}

export const config = {
  matchers: "/:path*",
};
