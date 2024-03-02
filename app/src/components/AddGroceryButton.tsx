import { Add } from "@mui/icons-material";
import {
  Button,
  Box,
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Sheet,
} from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { useApiClient } from "../hooks/useApiClient";
import { TextField } from "./TextField";

type FormValues = {
  name: string;
};

export const AddGroceryButton: FC<{ listId: number }> = ({ listId }) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
    },
  });
  const { mutate } = useMutation({
    async mutationFn(vars: FormValues) {
      await apiClient.post(`/lists/${listId}/groceries`, vars);
    },
    onSuccess() {
      reset();

      setModalOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["lists", String(listId), "groceries"],
      });
    },
  });

  return (
    <Box>
      <Button onClick={() => setModalOpen(true)}>
        <Add />
      </Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography>Добавить в список</Typography>
          <Sheet
            component="form"
            onSubmit={handleSubmit((values) => mutate(values))}
          >
            <TextField
              label="Название"
              placeholder="Название"
              {...register("name", {
                required: true,
              })}
            />
            <Box marginTop={2}>
              <Button type="submit" color="success">
                Добавить
              </Button>
            </Box>
          </Sheet>
        </ModalDialog>
      </Modal>
    </Box>
  );
};
