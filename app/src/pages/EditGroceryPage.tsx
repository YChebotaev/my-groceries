import { type FC } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useApiClient } from "../hooks/useApiClient";
import { Sheet } from "@mui/joy";
import { EditGroceryForm } from "../components/EditGroceryForm";
import { useGrocery } from "../hooks/useGrocery";

export const EditGroceryPage: FC = () => {
  const { listId, groceryId } = useParams() as {
    listId: string;
    groceryId: string;
  };
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: grocery } = useGrocery(listId, groceryId);
  const { mutate: renameMutate } = useMutation({
    async mutationFn(vars: { name: string }) {
      await apiClient.post(`/lists/${listId}/groceries/${groceryId}`, vars);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["lists", listId, "groceries", groceryId],
      });

      navigate(`/${listId}/groceries`);
    },
  });
  const { mutate: deleteMutate } = useMutation({
    async mutationFn() {
      await apiClient.delete(`/lists/${listId}/groceries/${groceryId}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["lists", listId, "groceries", groceryId],
      });

      navigate(`/${listId}/groceries`);
    },
  });

  return (
    <AppLayout
      topBar={{
        backButton: `/${listId}/groceries`,
        title: `Редактировать ${grocery?.name ?? ""}`,
      }}
    >
      <Sheet sx={{ padding: 2 }}>
        {grocery && (
          <EditGroceryForm
            defaultValues={grocery}
            onSubmit={renameMutate}
            onDelete={deleteMutate}
          />
        )}
      </Sheet>
    </AppLayout>
  );
};
