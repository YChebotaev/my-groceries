import { type FC, type ReactNode } from "react";
import { Box } from "@mui/joy";
import { TopBar, type TopBarProps } from "../components/TopBar";

export type AppLayoutTopBarProps = Omit<TopBarProps, "">;

export const AppLayout: FC<{
  topBar: AppLayoutTopBarProps;
  children: ReactNode;
}> = ({ topBar, children }) => (
  <Box minWidth="100vw" minHeight="100vh">
    <TopBar {...topBar} />
    {children}
  </Box>
);
