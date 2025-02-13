import axios from "axios";

export default async function Page() {
  // api 호출
  const response = await fetch("http://localhost:8080/api/v1/posts");

  if (!response.ok) {
    throw new Error("에러");
  }

  const rsData = await response.json();

  console.log(rsData.code);
  console.log(rsData.msg);
  console.log(rsData.data);

  return (
    <div>
      <h1>글 목록</h1>

      <hr />

      <ul>
        <li>글1</li>
        <li>글2</li>
      </ul>
    </div>
  );
}
