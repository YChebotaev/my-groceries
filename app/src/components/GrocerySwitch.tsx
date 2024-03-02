import { type FC } from "react";
import { Switch } from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../hooks/useApiClient";

export const GrocerySwitch: FC<{
  checked: boolean;
  listId: string;
  groceryId: number;
}> = ({ checked: initialChecked, listId, groceryId }) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
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
  const { mutate: fromShortageMutate } = useMutation({
    async mutationFn() {
      await apiClient.post<void>(
        `/lists/${listId}/groceries/${groceryId}/from_shortages`,
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
      checked={initialChecked}
      onChange={(e) => {
        const { checked } = e.target;

        if (checked) {
          toShortageMutate();
        } else {
          fromShortageMutate();
        }
      }}
    />
  );
};
