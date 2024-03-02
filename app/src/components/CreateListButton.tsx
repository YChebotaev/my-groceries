import { type FC } from "react";
import { Button, ListItemButton } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { List } from "@my-groceries/service/types";
import { useApiClient } from "../hooks/useApiClient";

export const CreateListButton: FC<{ inList?: boolean }> = ({
  inList = false,
}) => {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    async mutationFn() {
      const { data } = await apiClient.post<List>("/lists");

      return data;
    },
    onSuccess({ id }) {
      localStorage.setItem("currentListId", String(id));

      navigate(`/${id}/rename`);
    },
  });

  if (inList) {
    return (
      <ListItemButton onClick={() => mutate()}>Создать список</ListItemButton>
    );
  }

  return (
    <Button disabled={isPending} onClick={() => mutate()}>
      Создать список
    </Button>
  );
};
