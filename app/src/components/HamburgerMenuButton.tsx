import { useState, type FC } from "react";
import {
  Box,
  Button,
  Drawer,
  ModalClose,
  Typography,
  List as JoyList,
  ListItem,
  ListItemButton,
} from "@mui/joy";
import { Menu } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { List } from "@my-groceries/service/types";
import { useApiClient } from "../hooks/useApiClient";
import { CreateListButton } from "./CreateListButton";
import { JoinListButton } from "./JoinListButton";

export const HamburgerMenuButton: FC = () => {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: lists } = useQuery({
    queryKey: ["my", "lists"],
    async queryFn() {
      const { data } = await apiClient.get<List[]>("/my/lists");

      return data;
    },
  });

  return (
    <Box>
      <Button variant="plain" onClick={() => setDrawerOpen(true)}>
        <Menu />
      </Button>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <ModalClose />
        <Box marginTop={2} px={2}>
          <Typography level="body-xs">Мои списки</Typography>
          {lists && (
            <JoyList>
              {lists.map((list) => (
                <ListItem key={list.id}>
                  <ListItemButton
                    onClick={() => {
                      localStorage.setItem("currentListId", String(list.id));

                      navigate(`/${list.id}/groceries`);

                      setDrawerOpen(false);
                    }}
                  >
                    {list.name}
                  </ListItemButton>
                </ListItem>
              ))}
            </JoyList>
          )}
        </Box>
        <Box marginTop={2} px={2}>
          <Typography level="body-xs">Меню</Typography>
          <JoyList>
            <ListItem>
              <JoinListButton inList />
            </ListItem>
            <ListItem>
              <CreateListButton inList />
            </ListItem>
          </JoyList>
        </Box>
      </Drawer>
    </Box>
  );
};
