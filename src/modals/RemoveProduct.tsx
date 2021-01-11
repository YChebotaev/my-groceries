import {
  removeProductStore,
  toggleRemoveProductEvent,
} from "../effector/removeProduct";
import { useEvent, useStore } from "effector-react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FC } from "react";
import { FirebaseGroceriesListItem } from "../types.d";
import firebase from "firebase/app";
import { useTranslation } from "react-i18next";

export const RemoveProduct: FC<{}> = () => {
  const { t } = useTranslation();
  const { open, index, listPin } = useStore(removeProductStore);
  const toggleRemoveProduct = useEvent(toggleRemoveProductEvent);

  const handleCancel = () => {
    toggleRemoveProduct(false);
  };

  const handleOK = async () => {
    if (index) {
      const snapshot = await firebase
        .database()
        .ref(`lists/${listPin}/items`)
        .get();
      const items: FirebaseGroceriesListItem[] = snapshot.val();
      items.splice(index, 1);
      await firebase.database().ref(`lists/${listPin}/items`).set(items);
      toggleRemoveProduct(false);
    } else {
      // TODO: To implement
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="remove-product-title"
    >
      <DialogTitle id="remove-product-title">
        {t("Are You sure about remove product?")}
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleCancel}>{t("Cancel")}</Button>
        <Button onClick={handleOK} color="primary">
          {t("Remove this product")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
