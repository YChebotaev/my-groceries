import { useMemo, type FC } from "react";
import { useParams } from "react-router";
import {
  Alert,
  FormHelperText,
  List,
  ListItem,
  ListItemContent,
  Box,
} from "@mui/joy";
import { AppLayout } from "../layouts/AppLayout";
import { ListTabs } from "../components/ListTabs";
import { ShortageSwitch } from "../components/ShortageSwitch";
import { useListShortages } from "../hooks/useListShortages";
import { useList } from "../hooks/useList";

export const ShortagesPage: FC = () => {
  const { listId } = useParams() as { listId: string };
  const { data: shortages } = useListShortages(listId);
  const { data: list } = useList(listId);
  const content = useMemo(() => {
    if (shortages != null && shortages.length === 0) {
      return (
        <Box marginTop={2}>
          <Alert>В списке нет продуктов</Alert>
        </Box>
      );
    } else if (shortages != null) {
      return (
        <List>
          {shortages.map((shortage) => (
            <ListItem key={shortage.id}>
              <ListItemContent>{shortage.name}</ListItemContent>
              <ShortageSwitch
                checked={true}
                listId={listId}
                groceryId={shortage.groceryId}
                shortageId={shortage.id}
              />
            </ListItem>
          ))}
        </List>
      );
    } else {
      return null;
    }
  }, [shortages, listId]);

  return (
    <AppLayout
      topBar={{
        title: list?.name ?? "",
        chip: list?.code ? `Код: ${list.code}` : "",
      }}
    >
      <ListTabs defaultValue={1} listId={listId}>
        <FormHelperText>
          Отмечайте галочкой продукты, которые уже куплены
        </FormHelperText>
        {content}
      </ListTabs>
    </AppLayout>
  );
};
