import {
  FirebaseDatabaseMutation,
  FirebaseDatabaseNode,
} from "@react-firebase/database";
import {
  setIndexEvent,
  setListPinEvent,
  toggleRemoveProductEvent,
} from "../effector/removeProduct";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteIcon from "@material-ui/icons/Delete";
import { FC } from "react";
import { FirebaseGroceriesListItem } from "../types.d";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import { useEvent } from "effector-react";
import { useParams } from "react-router-dom";

export const ProductsTab: FC<{}> = () => {
  const { listPin }: { listPin: string } = useParams();
  const setListPin = useEvent(setListPinEvent);
  const setIndex = useEvent(setIndexEvent);
  const toggleRemoveProduct = useEvent(toggleRemoveProductEvent);

  const createHandleDelete = (index: number) => async () => {
    setListPin(listPin);
    setIndex(index);
    toggleRemoveProduct(true);
  };

  return (
    <FirebaseDatabaseNode path={`lists/${listPin}/items`}>
      {({
        isLoading,
        value: items,
      }: {
        isLoading: boolean;
        value: FirebaseGroceriesListItem[];
      }) => {
        if (isLoading) return <CircularProgress />;

        if (!items) return null;

        return (
          <List>
            {items.map(
              (
                { id, displayName, shortage }: FirebaseGroceriesListItem,
                index: number
              ) => {
                return (
                  <ListItem key={id}>
                    <ListItemText>{displayName}</ListItemText>
                    <ListItemSecondaryAction>
                      <Button onClick={createHandleDelete(index)}>
                        <DeleteIcon />
                      </Button>
                      <FirebaseDatabaseMutation
                        type="set"
                        path={`lists/${listPin}/items/${index}/shortage`}
                      >
                        {({ runMutation }) => {
                          return (
                            <Switch
                              defaultChecked={shortage}
                              color="primary"
                              onChange={(e, nextValue: boolean) => {
                                runMutation(nextValue);
                              }}
                            />
                          );
                        }}
                      </FirebaseDatabaseMutation>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              }
            )}
          </List>
        );
      }}
    </FirebaseDatabaseNode>
  );
};
