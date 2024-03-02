import { type FC } from "react";
import { useNavigate } from "react-router";
import { Button, Stack, Box, ModalClose } from "@mui/joy";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import type { JoinListResult } from "@my-groceries/service/types";
import { InitLayout } from "../layouts/InitLayout";
import { TextField } from "../components/TextField";
import { useApiClient } from "../hooks/useApiClient";
import { useSearchParams } from "react-router-dom";

type FormValues = {
  code: string;
};

export const JoinPage: FC = () => {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      code: "",
    },
  });
  const { mutate } = useMutation({
    async mutationFn(vars: FormValues) {
      const { data } = await apiClient.post<JoinListResult>(
        "/lists/joinByPin",
        vars,
      );

      return data;
    },
    onSuccess({ listId }) {
      localStorage.setItem("currentListId", String(listId));

      navigate(`/${listId}/groceries`);
    },
  });

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
        onSubmit={handleSubmit((values) => {
          mutate(values);
        })}
      >
        <TextField
          label="Код списка"
          placeholder="Код списка"
          {...register("code")}
        />
        <Box>
          <Button type="submit">Присоединиться</Button>
        </Box>
      </Stack>
    </InitLayout>
  );
};
