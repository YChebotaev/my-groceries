import { type FC } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Button,
  FormHelperText,
  List,
  ListItem,
  ListItemContent,
} from "@mui/joy";
import { AppLayout } from "../layouts/AppLayout";
import { ListTabs } from "../components/ListTabs";
import { GrocerySwitch } from "../components/GrocerySwitch";
import { Edit } from "@mui/icons-material";
import { useListGroceries } from "../hooks/useListGroceries";
import { useList } from "../hooks/useList";

export const GroceriesPage: FC = () => {
  const navigate = useNavigate();
  const { listId } = useParams() as { listId: string };
  const { data: list } = useList(listId);
  const { data: groceries } = useListGroceries(listId);

  return (
    <AppLayout
      topBar={{
        title: list?.name ?? "",
        chip: list?.code ? `Код: ${list.code}` : "",
        editButton: `/${listId}/rename?backLink=${encodeURIComponent(
          `/${listId}/groceries`,
        )}`,
        plusButton: list
          ? {
              listId: list?.id,
            }
          : undefined,
      }}
    >
      <ListTabs defaultValue={0} listId={listId}>
        <FormHelperText>
          Отмечайте галочкой продукты, которые необходимо купить
        </FormHelperText>
        <List>
          {groceries?.map((grocery) => (
            <ListItem key={grocery.id}>
              <ListItemContent>{grocery.name}</ListItemContent>
              <Button
                size="sm"
                variant="plain"
                onClick={() => navigate(`/${listId}/groceries/${grocery.id}`)}
              >
                <Edit />
              </Button>
              <GrocerySwitch
                checked={grocery.shortage}
                listId={listId}
                groceryId={grocery.id}
              />
            </ListItem>
          )) ?? null}
        </List>
      </ListTabs>
    </AppLayout>
  );
};
