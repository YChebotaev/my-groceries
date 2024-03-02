import { useEffect } from 'react'
import type { Shortage } from "@my-groceries/service/types";
import { useApiClient } from "./useApiClient";
import { useSocketIO } from "./useSocketIO";
import { useQuery } from "@tanstack/react-query";

export const useListShortages = (listId: number | string) => {
  listId = String(listId)
  const apiClient = useApiClient()
  const socket = useSocketIO()

  const { data, refetch } = useQuery({
    queryKey: ["lists", listId, "shortages"],
    async queryFn() {
      const { data } = await apiClient.get<Shortage[]>(
        `/lists/${listId}/shortages`,
      );

      return data;
    },
  });

  useEffect(() => {
    const eventNames = [
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
