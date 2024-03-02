import { type FC } from "react";
import { Button, ListItemButton } from "@mui/joy";
import { useLocation, useNavigate } from "react-router";

export const JoinListButton: FC<{ inList?: boolean }> = ({
  inList = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (inList) {
    return (
      <ListItemButton
        onClick={() =>
          navigate(`/join?backLink=${encodeURIComponent(location.pathname)}`)
        }
      >
        Присоединиться к списку
      </ListItemButton>
    );
  }

  return (
    <Button onClick={() => navigate("/join")}>Присоединиться к списку</Button>
  );
};
