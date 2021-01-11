import AppBar from "@material-ui/core/AppBar";
import CircularProgress from "@material-ui/core/CircularProgress";
import { FC } from "react";
import { FirebaseDatabaseNode } from "@react-firebase/database";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { toggleDrawerEvent } from "../effector/drawer";
import { useCredential } from "../hooks/useCredential";
import { useEvent } from "effector-react";

export const TopBar: FC<{}> = () => {
  const { sub } = useCredential() || {};
  const toggleDrawer = useEvent(toggleDrawerEvent);

  const handleLeftMenuToggle = () => {
    toggleDrawer();
  };

  return (
    <AppBar>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleLeftMenuToggle}
        >
          <MenuIcon />
        </IconButton>
        <FirebaseDatabaseNode path={`/users/${sub}/active_list`}>
          {({
            isLoading,
            value: listPin,
          }: {
            isLoading: boolean;
            value: string;
          }) => {
            if (isLoading) return <CircularProgress color="secondary" />;

            if (!listPin) return null;

            return (
              <FirebaseDatabaseNode path={`/lists/${listPin}/name`}>
                {({
                  isLoading,
                  value: listName,
                }: {
                  isLoading: boolean;
                  value: string;
                }) => {
                  if (isLoading) return <CircularProgress color="secondary" />;

                  if (!listName) return null;

                  return (
                    <Typography variant="h6">
                      {listName} ({listPin})
                    </Typography>
                  );
                }}
              </FirebaseDatabaseNode>
            );
          }}
        </FirebaseDatabaseNode>
      </Toolbar>
    </AppBar>
  );
};
