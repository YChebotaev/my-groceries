import { type FC, type ReactNode } from "react";
import { Box } from "@mui/joy";

export const InitLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    minWidth="100vw"
    minHeight="100vh"
  >
    {children}
  </Box>
);
