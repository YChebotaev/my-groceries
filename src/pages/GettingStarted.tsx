import { FC, MouseEvent as ReactMouseEvent } from "react";

import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { toggleEnterListNameEvent } from "../effector/enterListname";
import { toggleEnterListPinEvent } from "../effector/enterListPin";
import { useEvent } from "effector-react";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  root: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexFlow: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonWrapper: {
    marginBottom: "2rem",
  },
});

export const GettingStarted: FC<{}> = () => {
  const toggleEnterListPin = useEvent(toggleEnterListPinEvent);
  const classes = useStyles();
  const { t } = useTranslation();
  const toggleEnterListName = useEvent(toggleEnterListNameEvent);

  const handleConnect = (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    toggleEnterListPin(true);
  };

  const handleCreate = async (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    toggleEnterListName(true);
  };

  return (
    <div className={classes.root}>
      <div className={classes.buttonWrapper}>
        <Button variant="contained" onClick={handleConnect}>
          {t("Connect to existing groceries list")}
        </Button>
      </div>
      <div>
        <Button variant="contained" onClick={handleCreate}>
          {t("Create my own groceries list")}
        </Button>
      </div>
    </div>
  );
};
