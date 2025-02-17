import createClient from "openapi-fetch";
import ClientPage from "./ClientPage";
import { paths } from "@/src/lib/backend/apiV1/schema";
import client from "@/src/lib/client";
import { cookies } from "next/headers";

export default async function Page({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const { id } = await params;

  const response = await client.GET("/api/v1/posts/{id}", {
    params: {
      path: {
        id,
      },
    },
    headers: {
      cookie: (await cookies()).toString(),
    },
  });

  const fetchMe = await client.GET("/api/v1/members/me", {
    headers: {
      cookie: (await cookies()).toString(),
    },
  });

  if (fetchMe.error) {
    return <div>{fetchMe.error.msg}</div>;
  }

  if (response.error) {
    return <div>{response.error.msg}</div>;
  }

  const post = response.data.data;
  const me = fetchMe.data.data;

  return <ClientPage post={post} me={me} />;
}
