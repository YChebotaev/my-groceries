import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Grocery } from "@my-groceries/service/types";
import { useApiClient } from "./useApiClient";
import { useSocketIO } from "./useSocketIO";

export const useGrocery = (listId: number | string, groceryId: number | string) => {
  listId = String(listId)
  groceryId = String(groceryId)
  const apiClient = useApiClient()
  const socket = useSocketIO()

  const { data, refetch } = useQuery({
    queryKey: ["lists", listId, "groceries", groceryId],
    async queryFn() {
      const { data } = await apiClient.get<Grocery>(
        `/lists/${listId}/groceries/${groceryId}`,
      );

      return data;
    },
  });

  useEffect(() => {
    socket.on('grocery-renamed', refetch)

    return () => {
      socket.off('grocery-renamed', refetch)
    }
  }, [socket, refetch])

  return { data }
}