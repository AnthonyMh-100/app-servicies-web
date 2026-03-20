import { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import moment from "moment";
import { useReactiveVar } from "@apollo/client/react";
import {
  companyIdVar,
  companyNameVar,
  companyUserNameVar,
} from "./graphql/reactiveVars";
import { useLogout } from "./services/hooks/useLogout";

const colors = {
  primary: "#6366f1",
  primaryLight: "#818cf8",
  secondary: "#4f46e5",
  secondaryBg: "#eef2ff",
  secondaryHover: "#e0e7ff",
  secondaryActive: "#c7d2fe",
  textDark: "#111827",
  textGray: "#6b7280",
  inputBg: "#f9fafb",
  inputBgFocus: "#ffffff",
  borderFocus: "rgba(99, 102, 241, 0.18)",
};

function App({
  menus,
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  screenContent,
}) {
  const logout = useLogout();
  const [dateFilter, setDateFilter] = useState(moment().format("YYYY-MM-DD"));
  const companyName = useReactiveVar(companyNameVar);
  const companyUserName = useReactiveVar(companyUserNameVar);

  const ScreenCurrent = useMemo(
    () => screenContent[activeTab]?.screen,
    [activeTab, screenContent],
  );
  return (
    <Container>
      <Sidebar $collapsed={collapsed}>
        <div>
          <CompanyName $collapsed={collapsed}>
            {companyName}-{companyUserName}
          </CompanyName>
          <CollapseButton onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "➤" : "⬅"}
          </CollapseButton>
          <Menu>
            {menus?.map((menu) => {
              return (
                <MenuItem
                  key={menu.key}
                  $active={activeTab === menu.key}
                  $collapsed={collapsed}
                  onClick={() => setActiveTab(menu.key)}
                >
                  <menu.Icon />
                  <span>{menu.name}</span>
                </MenuItem>
              );
            })}
          </Menu>
        </div>
        <LogoutButton $collapsed={collapsed} onClick={() => logout()}>
          Logout
        </LogoutButton>
      </Sidebar>

      <Content>
        <ScreenCurrent dateFilter={dateFilter} setDateFilter={setDateFilter} />
      </Content>
    </Container>
  );
}

export default App;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-24px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f3f4f6;
`;

const Sidebar = styled.div`
  width: ${(props) => (props.$collapsed ? "80px" : "200px")};
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px 20px;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.4s ease;
  transition: width 0.4s ease;
`;

const CompanyName = styled.h2`
  color: ${colors.primary};
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  display: ${(props) => (props.$collapsed ? "none" : "block")};
`;

const CollapseButton = styled.button`
  margin-bottom: 20px;
  width: 100%;
  border: none;
  background: ${colors.secondaryBg};
  color: ${colors.secondary};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.25s ease;

  &:hover {
    background: ${colors.secondaryHover};
  }

  &:active {
    background: ${colors.secondaryActive};
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$collapsed ? "0" : "12px")};
  justify-content: ${(props) => (props.$collapsed ? "center" : "flex-start")};
  padding: 14px 20px;
  border-radius: 12px;
  border: none;
  background: ${(props) => (props.$active ? colors.primary : "transparent")};
  color: ${(props) => (props.$active ? "#ffffff" : colors.textDark)};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;

  svg {
    width: 24px;
    height: 24px;
  }

  span {
    display: ${(props) => (props.$collapsed ? "none" : "inline")};
  }

  &:hover {
    background: ${(props) =>
      props.$active ? colors.primary : colors.secondaryBg};
    color: ${(props) => (props.$active ? "#fff" : colors.secondary)};
  }
`;

const LogoutButton = styled.button`
  padding: 14px 20px;
  border-radius: 12px;
  border: none;
  background: ${colors.secondaryBg};
  color: ${colors.secondary};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: center;

  &:hover {
    background: ${colors.secondaryHover};
  }

  &:active {
    background: ${colors.secondaryActive};
  }

  span {
    display: ${(props) => (props.$collapsed ? "none" : "inline")};
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px 40px;
  background: #f3f4f6;
`;
