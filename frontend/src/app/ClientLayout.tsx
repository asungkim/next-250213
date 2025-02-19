"use client";

import { components } from "@/src/lib/backend/apiV1/schema";
import client from "@/src/lib/client";
import Link from "next/link";
import { faBookBookmark, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ClientLayout({
  children,
  me,
  fontVariable,
  fontClassName,
}: Readonly<{
  children: React.ReactNode;
  me: components["schemas"]["MemberDto"];
  fontVariable: string;
  fontClassName: string;
}>) {
  const isLogined = me.id !== 0;

  return (
    <html lang="en" className={`${fontVariable}`}>
      <body className={`min-h-[100dvh] flex flex-col ${fontClassName}`}>
        <FontAwesomeIcon
          icon={faThumbsUp}
          className="fa-fw text-4xl text-[red]"
        />
        <FontAwesomeIcon icon={faBookBookmark} />
        <header className="flex gap-3">
          <Link href="/">메인</Link>
          <Link href="/about">소개</Link>
          <Link href="/post/list">글 목록</Link>
          {isLogined && <Link href="/post/write">글 작성</Link>}
          {!isLogined && <Link href="/member/login">로그인</Link>}
          {!isLogined && <Link href="/member/join">회원가입</Link>}
          {isLogined && (
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

                // router.push(`/post/list`); // 브라우저 방식 x, next.js 방식
                window.location.href = "/post/list";
              }}
            >
              로그아웃
            </Link>
          )}
          {isLogined && <Link href="/member/me">내 정보</Link>}
        </header>
        <div className="flex-grow">{children}</div>
        <footer>푸터</footer>
      </body>
    </html>
  );
}
