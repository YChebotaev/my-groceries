import { type FC } from "react";
import { Switch } from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../hooks/useApiClient";

export const ShortageSwitch: FC<{
  checked: boolean;
  listId: string;
  groceryId: number;
  shortageId: number;
}> = ({ checked: initialChecked, listId, groceryId, shortageId }) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { mutate: fromShortageMutate } = useMutation({
    async mutationFn() {
      await apiClient.delete(`/lists/${listId}/shortages/${shortageId}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["lists", listId, "groceries"],
      });
    },
  });
  const { mutate: toShortageMutate } = useMutation({
    async mutationFn() {
      await apiClient.post<void>(
        `/lists/${listId}/groceries/${groceryId}/to_shortages`,
      );
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["lists", listId, "groceries"],
      });
    },
  });

  return (
    <Switch
      defaultChecked={initialChecked}
      onChange={(e) => {
        const { checked } = e.target;

        if (!checked) {
          fromShortageMutate();
        } else {
          toShortageMutate();
        }
      }}
    />
  );
};
