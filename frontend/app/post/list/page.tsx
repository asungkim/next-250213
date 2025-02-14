import { paths } from "@/src/lib/backend/apiV1/schema";
import createClient from "openapi-fetch";
import ClientPage from "./ClientPage";
import client from "@/src/lib/client";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    keywordType?: "title" | "content";
    keyword: string;
    pageSize: number;
    page: number;
  };
}) {
  const {
    keywordType = "title",
    keyword = "",
    pageSize = 10,
    page = 1,
  } = await searchParams;

  const response = await client.GET("/api/v1/posts", {
    params: {
      query: {
        keyword,
        keywordType,
        pageSize,
        page,
      },
    },
  });

  const rsData = response.data!!; // 여기는 null이나 undefined가 절대 들어오지 않는다
  const pageDto = rsData.data;

  return (
    <ClientPage
      rsData={rsData}
      pageSize={pageSize}
      keyword={keyword}
      keywordType={keywordType}
      page={page}
    />
  );
}
