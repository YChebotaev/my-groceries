import { ChangeEvent, FC } from "react";
import {
  changeListNameEvent,
  enterListNameStore,
  toggleEnterListNameEvent,
} from "../effector/enterListname";
import { generateList, generateListPin } from "../lib";
import { useEvent, useStore } from "effector-react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import firebase from "firebase/app";
import { toggleDrawerEvent } from "../effector/drawer";
import { useCredential } from "../hooks/useCredential";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const EnterListName: FC<{}> = () => {
  const { t } = useTranslation();
  const { open, listName, disabled } = useStore(enterListNameStore);
  const toggleEnterListName = useEvent(toggleEnterListNameEvent);
  const changeListName = useEvent(changeListNameEvent);
  const history = useHistory();
  const toggleDrawer = useEvent(toggleDrawerEvent);
  const { sub } = useCredential() || {};

  const handleCancel = () => {
    toggleEnterListName(false);
  };

  const handleOK = async () => {
    toggleEnterListName(false);
    if (sub) {
      const listPin = generateListPin();
      const list = generateList(listPin, listName as string);
      await firebase.database().ref(`users/${sub}/my_lists`).push(listPin);
      await firebase.database().ref(`users/${sub}/active_list`).set(listPin);
      await firebase.database().ref(`lists/${listPin}`).set(list);
      history.push(`/list/${listPin}`);
      toggleDrawer(false);
    } else {
      // TODO: To implement branch
    }
  };

  const handleChangeListName = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    changeListName(e.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="enter-list-name-title"
    >
      <DialogTitle id="enter-list-name-title">
        {t("Enter list name")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("Enter list name to start new list")}
        </DialogContentText>
        <TextField
          value={listName}
          autoFocus
          fullWidth
          margin="dense"
          label={t("List name")}
          onChange={handleChangeListName}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>{t("Cancel")}</Button>
        <Button disabled={disabled} onClick={handleOK} color="primary">
          {t("Create new list")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
