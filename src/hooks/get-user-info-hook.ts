import { fetcher } from "@/util/api";
import useSWR from "swr";

export default function useGetUserInfo() {
  const { data, error, isLoading } = useSWR<{
    accountId: string;
    username: string;
    isAdmin: boolean;
  }>("/api/accounts/info", fetcher);

  return {
    userInfo: data,
    isLoading,
    error,
  };
}
