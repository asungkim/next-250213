"use client";

import { components } from "@/src/lib/backend/apiV1/schema";

export default function ClientPage({
  me,
}: {
  me: components["schemas"]["MemberDto"];
}) {
  return (
    <>
      <div>내 정보 페이지</div>
      <div>번호 : {me.id}</div>
      <div>닉네임 : {me.nickname}</div>
    </>
  );
}
