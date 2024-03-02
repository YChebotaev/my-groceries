import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";
import type { Grocery } from "@my-groceries/service/types";
import { useSocketIO } from "./useSocketIO";

export const useListGroceries = (listId: string) => {
  const socket = useSocketIO()
  const apiClient = useApiClient()

  const { data, refetch } = useQuery({
    queryKey: ["lists", listId, "groceries"],
    async queryFn() {
      const { data } = await apiClient.get<Grocery[]>(
        `/lists/${listId}/groceries`,
      );

      return data;
    },
  });

  useEffect(() => {
    const eventNames = [
      'grocery-added',
      'grocery-renamed',
      'grocery-deleted',
      'grocery-shortaged',
      'grocery-abundanced'
    ]

    for (const eventName of eventNames) {
      socket.on(eventName, refetch)
    }

    return () => {
      for (const eventName of eventNames) {
        socket.off(eventName, refetch)
      }
    }
  }, [socket, refetch])

  return { data }
}
