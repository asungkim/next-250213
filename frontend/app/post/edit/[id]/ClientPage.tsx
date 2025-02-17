"use client";

import { components } from "@/src/lib/backend/apiV1/schema";
import client from "@/src/lib/client";
import { useRouter } from "next/navigation";

export default function ClientPage({
  post,
}: {
  post: components["schemas"]["PostWithContentDto"];
}) {
  const router = useRouter();

  async function edit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const title = form._title.value;
    const content = form.content.value;
    const published = form.published.checked;
    const listed = form.published.checked;

    if (title.trim().length === 0) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (content.trim().length === 0) {
      alert("내용을 입력해주세요.");
      return;
    }

    const response = await client.PUT("/api/v1/posts/{id}", {
      params: {
        path: { id: post.id },
      },
      body: {
        title,
        content,
        published,
        listed,
      },
      credentials: "include",
    });

    if (response.error) {
      alert(response.error.msg);
      return;
    }

    alert("글 수정하였습니다.");
    // 글 목록으로 이동 or 내가 작성한 글 상세 페이지 이동 -> 선택
    router.push(`/post/${post.id}`);
  }

  return (
    <>
      <h1>글 수정 페이지</h1>
      <hr />

      <form onSubmit={edit} className="flex flex-col w-1/4 gap-3">
        <div className="flex gap-3">
          <label>공개 여부 : </label>
          <input
            type="checkbox"
            name="published"
            defaultChecked={post.published}
          />
        </div>
        <div className="flex gap-3">
          <label>검색 여부 : </label>
          <input type="checkbox" name="listed" defaultChecked={post.listed} />
        </div>
        <input
          type="text"
          name="_title"
          placeholder="제목 입력"
          className="border-2 border-black"
          defaultValue={post.title}
        />
        <textarea
          name="content"
          rows={10}
          className="border-2 border-black"
          defaultValue={post.content}
        ></textarea>
        <input
          type="submit"
          value="등록"
          className="cursor-pointer hover:curosr-wait"
        />
      </form>
    </>
  );
}
