import { ChangeEvent, FC } from "react";
import { setListPinEvent, toggleAddProductEvent } from "../effector/addProduct";

import AddIcon from "@material-ui/icons/Add";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Fab from "@material-ui/core/Fab";
import { LeftMenu } from "../components/LeftMenu";
import { ListDetailsParams } from "../types.d";
import { ProductsTab } from "../components/ProductsTab";
import { ShortageTab } from "../components/ShortageTab";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { TopBar } from "../components/TopBar";
import { useEvent } from "effector-react";
import { useParams } from "react-router-dom";
import { useState } from "react";

export const ListDetails: FC<{}> = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { listPin } = useParams() as ListDetailsParams;
  const toggleAddProduct = useEvent(toggleAddProductEvent);
  const setListPin = useEvent(setListPinEvent);

  const handleTabChange = (e: ChangeEvent<{}>, nextActiveTab: any) => {
    setActiveTab(nextActiveTab);
  };

  const handleAdd = () => {
    setListPin(listPin);
    toggleAddProduct(true);
  };

  return (
    <>
      <Fab
        color="secondary"
        style={{ position: "fixed", top: 60, right: 40, zIndex: 1101 }}
        onClick={handleAdd}
      >
        <AddIcon />
      </Fab>
      <LeftMenu />
      <TopBar />
      <AppBar position="relative" color="default" style={{ marginTop: 64 }}>
        <Container>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Продукты" />
            <Tab label="Нужно купить" />
          </Tabs>
        </Container>
      </AppBar>
      <Container>
        {activeTab === 0 && <ProductsTab key={listPin} />}
        {activeTab === 1 && <ShortageTab key={listPin} />}
      </Container>
    </>
  );
};
