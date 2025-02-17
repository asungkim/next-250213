import { NextRequest, NextResponse } from "next/server";
import client from "./src/lib/client";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const myCookies = await cookies();
  const accessToken = myCookies.get("accessToken");

  let isExpired = true;
  let payload = null;

  if (accessToken) {
    try {
      const tokenParts = accessToken.value.split(".");
      payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString());
      const expTimestamp = payload.exp * 1000;
      isExpired = Date.now() > expTimestamp;
    } catch (e) {
      console.log("파싱 중 오류 발생 : ", e);
    }
  }

  let isLogin = payload != null;

  console.log("----------------------");
  console.log(isLogin, isExpired);

  if (isLogin && isExpired) {
    const nextResponse = NextResponse.next();

    const response = await client.GET("/api/v1/members/me", {
      headers: {
        cookie: (await cookies()).toString(),
      },
    });

    const spirngCookie = response.response.headers.getSetCookie();
    nextResponse.headers.set("set-cookie", String(spirngCookie));
  }

  if (!isLogin && isProtectedRoute(request.nextUrl.pathname)) {
    return createUnauthorizedResponse();
  }
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
