"use client";
import { components } from "@/src/lib/backend/apiV1/schema";
import client from "@/src/lib/client";
import { useEffect, useState } from "react";

export default function ClientPage() {
  const [me, setMe] = useState<components["schemas"]["MemberDto"] | null>(null);

  async function getMe() {
    const response = await client.GET("/api/v1/members/me", {
      credentials: "include",
    });

    if (response.error) {
      alert(response.error.msg);
      return;
    }

    const rsData = response.data;
    const memberDto = rsData.data;

    setMe(memberDto);
  }

  useEffect(() => {
    getMe();
  }, []);

  if (me == null) {
    return <div>로딩중 .. </div>;
  }

  return (
    <>
      <div>내 정보 페이지</div>
      <div>번호 : {me.id}</div>
      <div>닉네임 : {me.nickname}</div>
      <div>가입일자 : {me.createdDate}</div>
      <div>수정일자 : {me.modifiedDate}</div>
    </>
  );
}
