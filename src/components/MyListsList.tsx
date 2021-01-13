import { useHistory, useParams } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";
import { FC } from "react";
import { FirebaseDatabaseNode } from "@react-firebase/database";
import List from "@material-ui/core/List";
import { ListDetailsParams } from "../types.d";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import firebase from "firebase/app";
import { toggleDrawerEvent } from "../effector/drawer";
import { useCredential } from "../hooks/useCredential";
import { useEvent } from "effector-react";
import { useTranslation } from "react-i18next";

export const MyListsList: FC<{}> = () => {
  const { sub } = useCredential() || {};
  const { t } = useTranslation();
  const history = useHistory();
  const params: ListDetailsParams = useParams();
  const toggleDrawer = useEvent(toggleDrawerEvent);

  const createHandleNavigate = (listPin: string) => async () => {
    await firebase.database().ref(`users/${sub}/active_list`).set(listPin);
    toggleDrawer(false);
    history.push(`/list/${listPin}`);
  };

  return (
    <FirebaseDatabaseNode path={`users/${sub}/my_lists`}>
      {({ isLoading, value }: { isLoading: boolean; value: string }): any => {
        if (isLoading) return <CircularProgress />;

        if (!value) return null;

        const items = Object.values(value).map((listPin: string) => {
          return (
            <FirebaseDatabaseNode path={`lists/${listPin}/name`}>
              {({ isLoading, value }): any => {
                if (isLoading) return <CircularProgress />;

                if (!value) return null;

                return (
                  <ListItem
                    button
                    disabled={params.listPin === listPin}
                    onClick={createHandleNavigate(listPin)}
                  >
                    <ListItemText>
                      {value} ({listPin})
                    </ListItemText>
                  </ListItem>
                );
              }}
            </FirebaseDatabaseNode>
          );
        });

        return (
          <List subheader={<ListSubheader>{t("My lists")}</ListSubheader>}>
            {items}
          </List>
        );
      }}
    </FirebaseDatabaseNode>
  );
};
