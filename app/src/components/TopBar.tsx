import { type FC } from "react";
import { Button, Chip, Sheet, Stack, Typography, Box } from "@mui/joy";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { HamburgerMenuButton } from "./HamburgerMenuButton";
import { AddGroceryButton } from "./AddGroceryButton";

export type TopBarProps = {
  title: string;
  editButton?: string;
  plusButton?: {
    listId: number;
  };
  backButton?: string;
  chip?: string;
};

export const TopBar: FC<TopBarProps> = ({
  title,
  backButton,
  editButton,
  plusButton,
  chip,
}) => {
  const navigate = useNavigate();

  return (
    <Sheet sx={{ paddingY: 2 }}>
      <Stack direction="row">
        <Stack direction="row" spacing={1}>
          {backButton ? (
            <Button variant="plain" onClick={() => navigate(backButton)}>
              <ArrowBack />
            </Button>
          ) : (
            <HamburgerMenuButton />
          )}
          <Typography display="flex" alignItems="center">
            {title}
          </Typography>
          {chip && (
            <Box display="flex" alignItems="center">
              <Chip>{chip}</Chip>
            </Box>
          )}
        </Stack>
        <Box flexGrow="1" />
        {(editButton || plusButton) && (
          <Stack direction="row" spacing={1} paddingX={2}>
            {editButton && (
              <Button variant="outlined" onClick={() => navigate(editButton)}>
                <Edit />
              </Button>
            )}
            {plusButton && <AddGroceryButton listId={plusButton.listId} />}
          </Stack>
        )}
      </Stack>
    </Sheet>
  );
};
