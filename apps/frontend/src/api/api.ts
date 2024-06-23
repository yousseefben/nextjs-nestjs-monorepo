import fetcher from "../helper/fetcher";
import { GetUserInfoType } from "../types/users.types";

export const getUserInfos = async (): Promise<GetUserInfoType> => {
  const result = await fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`
  );

  return await result.json();
};
