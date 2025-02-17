"use client";

export default function ClientPage() {
  function write() {}

  return (
    <>
      <div>글 작성</div>

      <form onSubmit={write} className="flex flex-col w-1/4 gap-3">
        <input
          type="text"
          name="title"
          placeholder="제목 입력"
          className="border-2 border-black"
        />
        <textarea
          name="content"
          rows={10}
          className="border-2 border-black"
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
