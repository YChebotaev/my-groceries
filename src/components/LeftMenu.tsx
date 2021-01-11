import { drawerStore, toggleDrawerEvent } from "../effector/drawer";
import { useEvent, useStore } from "effector-react";

import Drawer from "@material-ui/core/Drawer";
import { FC } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { MyListsList } from "./MyListsList";
import { SharedListsList } from "./SharedListsList";
import { toggleEnterListNameEvent } from "../effector/enterListname";
import { toggleEnterListPinEvent } from "../effector/enterListPin";
import { useTranslation } from "react-i18next";

export const LeftMenu: FC<{}> = () => {
  const { t } = useTranslation();
  const { open } = useStore(drawerStore);
  const toggleDrawer = useEvent(toggleDrawerEvent);
  const toggleEnterListName = useEvent(toggleEnterListNameEvent);
  const toggleEnterListPin = useEvent(toggleEnterListPinEvent);

  const handleClose = () => {
    toggleDrawer(!open);
  };

  const handleCreate = () => {
    toggleEnterListName(true);
  };

  const handleConnect = () => {
    toggleEnterListPin(true);
  };

  return (
    <Drawer anchor="left" open={open} onClose={handleClose}>
      <MyListsList />
      <SharedListsList />
      <List subheader={<ListSubheader>{t("Other")}</ListSubheader>}>
        <ListItem button onClick={handleConnect}>
          <ListItemText>{t("Connect to list")}</ListItemText>
        </ListItem>
        <ListItem button onClick={handleCreate}>
          <ListItemText>{t("Create list")}</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
};
