import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { Session } from "next-auth";

interface FetchOptions extends RequestInit {
  headers?: HeadersInit & {
    Authorization?: string;
  };
}

const fetcher = async (
  url: string,
  options: FetchOptions = {}
): Promise<Response> => {
  const session: Session | null =
    typeof window === "undefined"
      ? await getServerSession(authOptions)
      : await getSession();

  const headers = {
    ...options.headers,
    ...(session?.accessToken
      ? { Authorization: `Bearer ${session.accessToken}` }
      : {}),
  };

  return fetch(url, { ...options, headers });
};

export default fetcher;
