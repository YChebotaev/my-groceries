import { useEffect, type FC } from "react";
import { Button, Stack, Box, ModalClose } from "@mui/joy";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useApiClient } from "../hooks/useApiClient";
import { InitLayout } from "../layouts/InitLayout";
import { TextField } from "../components/TextField";
import { useList } from "../hooks/useList";

type FormValues = {
  name: string;
};

export const RenameListPage: FC = () => {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { listId } = useParams() as { listId: string };
  const { data: list } = useList(listId);
  const { setValue, register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      name: "",
    },
  });
  const { mutate, isPending } = useMutation({
    async mutationFn(vars: FormValues) {
      const { data } = await apiClient.post(`/lists/${listId}`, vars);

      return data;
    },
    onSuccess() {
      navigate(`/${listId}/groceries`);
    },
  });

  useEffect(() => {
    if (list) {
      setValue("name", list.name);
    }
  }, [list, setValue]);

  return (
    <InitLayout>
      {searchParams.has("backLink") && (
        <ModalClose
          ref={(el) => {
            el?.addEventListener("click", () => {
              const backLink = searchParams.get("backLink")!;

              navigate(backLink);
            });
          }}
        />
      )}
      <Stack
        component="form"
        spacing={2}
        padding={3}
        onSubmit={handleSubmit((values) => {
          if (values.name) {
            mutate(values);
          } else {
            navigate(`/${listId}/groceries`);
          }
        })}
      >
        <TextField
          disabled={isPending}
          label="Название списка"
          placeholder="Название списка"
          {...register("name")}
        />
        <TextField
          disabled
          label="Код списка"
          value={list?.code ?? ""}
          helperText="Поделитесь кодом с тем человеком, который должен иметь доступ к списку"
        />
        <Box>
          <Button type="submit">Продолжить</Button>
        </Box>
      </Stack>
    </InitLayout>
  );
};
