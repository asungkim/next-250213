import client from "@/src/lib/client";
import ClientPage from "./ClientPage";
import { cookies } from "next/headers";

export default async function Page() {
  const response = await client.GET("/api/v1/members/me", {
    headers: {
      cookie: (await cookies()).toString(),
    },
  });

  if (response.error) {
    return <div>{response.error.msg}</div>;
  }

  const rsData = response.data;
  const memberDto = rsData.data;

  return <ClientPage me={memberDto} />;
}
