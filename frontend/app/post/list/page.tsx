import { components } from "@/src/lib/backend/apiV1/schema";
import axios from "axios";
import { SearchParams } from "next/dist/server/request/search-params";

type PostDto = components["schemas"]["PostDto"];
type PostItemPageDto = components["schemas"]["PageDto"];

// searParams 라는 객체가 있어 근데 searchParams의 구조는 {} 형태야
export default async function Page({
  searchParams,
}: {
  searchParams: { keywordType: string; keyword: string };
}) {
  const { keywordType = "title", keyword = "" } = await searchParams;
  const response = await fetch(
    `http://localhost:8080/api/v1/posts?
    keywordType=${keywordType}&keyword=${keyword}`
  );

  if (!response.ok) {
    throw new Error("에러");
  }

  const rsData = await response.json();

  const pageDto: PostItemPageDto = rsData.data;

  return (
    <div>
      <h1>글 목록</h1>

      <div>응답 코드 : {rsData.code}</div>
      <div>메시지 : {rsData.msg}</div>
      <div>totalPages : {pageDto.totalPages}</div>
      <div>totalItems : {pageDto.totalItems}</div>
      <div>currentPageNo : {pageDto.currentPageNo}</div>
      <div>pageSize : {pageDto.pageSize}</div>

      <hr />

      <ul>
        {pageDto.items.map((item: PostDto) => {
          return (
            <li className="border-2 border-red-500 my-2 p-2" key={item.id}>
              <div>id : {item.id}</div>
              <div>title : {item.title}</div>
              <div>authorId : {item.authorId}</div>
              <div>authorName : {item.authorName}</div>
              <div>published : {`${item.published}`}</div>
              <div>listed : {`${item.listed}`}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
