import { type FC } from "react";
import { Stack, Box } from "@mui/joy";
import { InitLayout } from "../layouts/InitLayout";
import { CreateListButton } from "../components/CreateListButton";
import { JoinListButton } from "../components/JoinListButton";

export const HomePage: FC = () => {
  return (
    <InitLayout>
      <Stack spacing={2}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <CreateListButton />
        </Box>
        <Box textAlign="center">или</Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <JoinListButton />
        </Box>
      </Stack>
    </InitLayout>
  );
};
