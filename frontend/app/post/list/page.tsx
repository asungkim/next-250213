import { components, paths } from "@/src/lib/backend/apiV1/schema";
import axios from "axios";
import { SearchParams } from "next/dist/server/request/search-params";
import createClient from "openapi-fetch";

const client = createClient<paths>({
  baseUrl: "http://localhost:8080",
});

// searParams 라는 객체가 있어 근데 searchParams의 구조는 {} 형태야
export default async function Page({
  searchParams,
}: {
  searchParams: {
    keywordType?: "title" | "content";
    keyword: string;
  };
}) {
  const { keywordType = "title", keyword = "" } = await searchParams;

  const response = await client.GET("/api/v1/posts", {
    params: {
      query: {
        keyword: keyword,
        keywordType: keywordType,
      },
    },
  });

  const rsData = response.data!!;
  const pageDto = rsData.data;

  //   const response = await fetch(
  //     `http://localhost:8080/api/v1/posts?
  //     keywordType=${keywordType}&keyword=${keyword}`
  //   );

  //   if (!response.ok) {
  //     throw new Error("에러");
  //   }

  //   const rsData = await response.json();

  //   const pageDto: PostItemPageDto = rsData.data;

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

      <form>
        <select name="keywordType" defaultValue={keywordType}>
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>
        <input
          placeholder="검색어 입력"
          type="text"
          name="keyword"
          defaultValue={keyword}
        />
        <input type="submit" value="검색" />
      </form>

      <ul>
        {pageDto.items.map((item) => {
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
