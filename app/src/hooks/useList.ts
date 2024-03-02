import { useQuery } from "@tanstack/react-query";
import type { List as ListType } from "@my-groceries/service/types";
import { useApiClient } from "./useApiClient";
import { useSocketIO } from "./useSocketIO";
import { useEffect } from "react";

export const useList = (listId: string | number) => {
  listId = String(listId)

  const apiClient = useApiClient();
  const socket = useSocketIO()

  const { data, refetch } = useQuery({
    queryKey: ["lists", listId],
    async queryFn() {
      const { data } = await apiClient.get<ListType>(`/lists/${listId}`);

      return data;
    },
  });

  useEffect(() => {
    socket.on('list-renamed', refetch)

    return () => {
      socket.off('list-renamed', refetch)
    }
  }, [socket, refetch])

  return { data }
}
