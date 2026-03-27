import React, { useState } from "react";
import App from "../../App";
import { useAuthentication } from "../../context/AuthContext";
import { MENUS, MENUS_KEYS } from "../../Constants";
import { Home } from "./Home";
import { Services } from "./Services";
import { History } from "./History";

const { HOME, SERVICES, HISTORY } = MENUS_KEYS;

export const ScreenServices = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [collapsed, setCollapsed] = useState(false);

  const { user } = useAuthentication();
  const screens = {
    [HOME]: {
      screen: Home,
    },
    [SERVICES]: {
      screen: Services,
    },
    [HISTORY]: {
      screen: History,
    },
  };

  return (
    <App
      activeTab={activeTab}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
      menus={MENUS}
      setActiveTab={setActiveTab}
      screenContent={screens}
    />
  );
};
