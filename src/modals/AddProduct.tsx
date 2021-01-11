import { ChangeEvent, FC } from "react";
import {
  addProductStore,
  changeProductNameEvent,
  toggleAddProductEvent,
} from "../effector/addProduct";
import { useEvent, useStore } from "effector-react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FirebaseGroceriesListItem } from "../types.d";
import TextField from "@material-ui/core/TextField";
import firebase from "firebase/app";
import { useTranslation } from "react-i18next";
import { v4 } from "uuid";

export const AddProduct: FC<{}> = () => {
  const { t } = useTranslation();
  const { open, productName, disabled, listPin } = useStore(addProductStore);
  const changeProductName = useEvent(changeProductNameEvent);
  const toggleAddProduct = useEvent(toggleAddProductEvent);

  const handleCancel = () => {
    toggleAddProduct(false);
  };

  const handleOK = async () => {
    const snapshot = await firebase
      .database()
      .ref(`lists/${listPin}/items`)
      .get();
    const items: FirebaseGroceriesListItem[] = snapshot.val();
    items.push({
      id: v4(),
      shortage: false,
      displayName: productName,
    });
    await firebase.database().ref(`lists/${listPin}/items`).set(items);
    toggleAddProduct(false);
  };

  const handleChangeProductName = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    changeProductName(e.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="enter-product-name-title"
    >
      <DialogTitle id="enter-product-name-title">
        {t("Enter product name")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("Enter product name to add new product")}
        </DialogContentText>
        <TextField
          value={productName}
          autoFocus
          fullWidth
          margin="dense"
          label={t("Product name")}
          onChange={handleChangeProductName}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>{t("Cancel")}</Button>
        <Button disabled={disabled} onClick={handleOK} color="primary">
          {t("Create new product")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
