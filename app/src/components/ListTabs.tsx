import { type FC, type ReactNode } from "react";
import { Tabs, TabList, Tab, TabPanel } from "@mui/joy";
import { useNavigate } from "react-router";

export const ListTabs: FC<{
  listId: string;
  defaultValue: number;
  children: ReactNode;
}> = ({ listId, defaultValue, children }) => {
  const navigate = useNavigate();

  return (
    <Tabs
      value={defaultValue}
      size="lg"
      onChange={(_e, index) => {
        switch (index) {
          case 0:
            return navigate(`/${listId}/groceries`);
          case 1:
            return navigate(`/${listId}/shortages`);
        }
      }}
    >
      <TabList>
        <Tab value={0}>Продукты</Tab>
        <Tab value={1}>Список покупок</Tab>
      </TabList>
      <TabPanel value={defaultValue}>{children}</TabPanel>
    </Tabs>
  );
};
