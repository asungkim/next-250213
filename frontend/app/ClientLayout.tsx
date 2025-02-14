"use client";

import client from "@/src/lib/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <html lang="en">
      <body className="min-h-[100dvh] flex flex-col">
        <header className="flex gap-3">
          <Link href="/">메인</Link>
          <Link href="/about">소개</Link>
          <Link href="/post/list">글 목록</Link>
          <Link href="/member/login">로그인</Link>
          <Link
            href=""
            onClick={async (e) => {
              e.preventDefault();
              const response = await client.DELETE("/api/v1/members/logout", {
                credentials: "include",
              });

              if (response.error) {
                alert(response.error.msg);
                return;
              }

              router.push(`/post/list`);
            }}
          >
            로그아웃
          </Link>
          <Link href="/member/me">내 정보</Link>
        </header>
        <div className="flex-grow">{children}</div>
        <footer>푸터</footer>
      </body>
    </html>
  );
}
