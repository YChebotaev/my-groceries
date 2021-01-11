import {
  FirebaseDatabaseMutation,
  FirebaseDatabaseNode,
} from "@react-firebase/database";

import CircularProgress from "@material-ui/core/CircularProgress";
import { FC } from "react";
import { FirebaseGroceriesListItem } from "../types.d";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import { useParams } from "react-router-dom";

export const ShortageTab: FC<{}> = () => {
  const { listPin }: { listPin: string } = useParams();

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
                if (!shortage) return null;

                return (
                  <ListItem key={id}>
                    <ListItemText>{displayName}</ListItemText>
                    <ListItemSecondaryAction>
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
