import { ChangeEvent, FC, useState } from "react";
import {
  changeListPinEvent,
  enterListPinStore,
  toggleEnterListPinEvent,
} from "../effector/enterListPin";
import { useEvent, useStore } from "effector-react";

import Alert from "@material-ui/lab/Alert";
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

export const EnterListPin: FC<{}> = () => {
  const { open, listPin, disabled } = useStore(enterListPinStore);
  const toggleEnterListPin = useEvent(toggleEnterListPinEvent);
  const changeListPin = useEvent(changeListPinEvent);
  const { t } = useTranslation();
  const history = useHistory();
  const [isShowListNotExistsAlert, setIsShowListNotExistsAlert] = useState(
    false
  );
  const toggleDrawer = useEvent(toggleDrawerEvent);
  const { sub } = useCredential() || {};

  const handleCancel = () => {
    toggleEnterListPin(false);
  };

  const handleOK = async () => {
    if (sub) {
      const snapshot = await firebase
        .database()
        .ref(`lists/${listPin}`)
        .once("value");
      if (snapshot.exists()) {
        await firebase
          .database()
          .ref(`users/${sub}/available_lists`)
          .push(listPin);
        await firebase.database().ref(`users/${sub}/active_list`).set(listPin);
        toggleEnterListPin(false);
        history.push(`/list/${listPin}`);
        toggleDrawer(false);
      } else {
        setIsShowListNotExistsAlert(true);
      }
    } else {
      // TODO: To implement
    }
  };

  const handleChangeListPin = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setIsShowListNotExistsAlert(false);
    changeListPin(e.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="enter-list-pin-title"
    >
      <DialogTitle id="enter-list-pin-title">{t("Enter list PIN")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t(
            "To connect to other's list You should ask that person about it's list PIN"
          )}
        </DialogContentText>
        {isShowListNotExistsAlert && (
          <Alert severity="error">
            {t("Entered PIN doen't correspond to any list")}
          </Alert>
        )}
        <TextField
          value={listPin}
          autoFocus
          fullWidth
          margin="dense"
          label={t("List PIN")}
          onChange={handleChangeListPin}
          error={isShowListNotExistsAlert}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>{t("Cancel")}</Button>
        <Button
          disabled={disabled || isShowListNotExistsAlert}
          onClick={handleOK}
          color="primary"
        >
          {t("Connect to list")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
