import { type FC } from "react";
import { useForm } from "react-hook-form";
import { Stack, Button } from "@mui/joy";
import { TextField } from "./TextField";

type FormValues = {
  name: string;
};

export const EditGroceryForm: FC<{
  defaultValues: FormValues;
  onSubmit(values: FormValues): void;
  onDelete(): void;
}> = ({ defaultValues, onSubmit, onDelete }) => {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Новое название"
        placeholder="Новое название"
        {...register("name")}
      />
      <Stack direction="row" spacing={2} marginTop={2}>
        <Button type="submit">Сохранить</Button>
        <Button
          color="danger"
          onClick={(e) => {
            e.preventDefault();

            onDelete();
          }}
        >
          Удалить
        </Button>
      </Stack>
    </form>
  );
};
