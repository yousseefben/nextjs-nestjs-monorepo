import { getSession as getAuthSession } from "next-auth/react";
import { Session } from "next-auth";
import { getSession } from "./auth";

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
    typeof window === "undefined" ? await getSession() : await getAuthSession();

  const headers = {
    ...options.headers,
    ...(session?.accessToken
      ? { Authorization: `Bearer ${session.accessToken}` }
      : {}),
  };

  return fetch(url, { ...options, headers });
};

export default fetcher;
