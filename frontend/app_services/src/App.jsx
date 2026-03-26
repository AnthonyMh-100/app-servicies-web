import { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import moment from "moment";
import { useReactiveVar } from "@apollo/client/react";
import { companyNameVar, companyUserNameVar } from "./graphql/reactiveVars";
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

  const brandText = `${companyName || ""}${companyUserName ? ` · ${companyUserName}` : ""}`
    .trim()
    .replace(/^·\s*/, "");
  const brandInitials = (companyName || companyUserName || "WS")
    .toString()
    .trim()
    .slice(0, 2)
    .toUpperCase();

  const ScreenCurrent = useMemo(
    () => screenContent[activeTab]?.screen,
    [activeTab, screenContent],
  );
  return (
    <Container>
      <Sidebar $collapsed={collapsed}>
        <SidebarTop>
          <Brand $collapsed={collapsed}>
            <BrandMark aria-hidden="true">{brandInitials}</BrandMark>
            <BrandText $collapsed={collapsed} title={brandText}>
              {brandText || "Empresa"}
            </BrandText>
            <CollapseButton
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
              title={collapsed ? "Expandir" : "Colapsar"}
              $collapsed={collapsed}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
              </svg>
            </CollapseButton>
          </Brand>

          <NavLabel $collapsed={collapsed}>Menú</NavLabel>
          <Menu>
            {menus?.map((menu) => {
              return (
                <MenuItem
                  key={menu.key}
                  $active={activeTab === menu.key}
                  $collapsed={collapsed}
                  onClick={() => setActiveTab(menu.key)}
                >
                  <MenuIconWrap $active={activeTab === menu.key}>
                    <menu.Icon />
                  </MenuIconWrap>
                  <span title={menu.name}>{menu.name}</span>
                </MenuItem>
              );
            })}
          </Menu>
        </SidebarTop>

        <LogoutButton
          type="button"
          $collapsed={collapsed}
          onClick={() => logout()}
          aria-label="Cerrar sesión"
          title="Logout"
        >
          <span>Logout</span>
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
  width: ${(props) => (props.$collapsed ? "76px" : "240px")};
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${(props) => (props.$collapsed ? "18px 14px" : "18px 16px")};
  border-right: 1px solid #eef2f7;
  box-shadow: 2px 0 14px rgba(17, 24, 39, 0.04);
  animation: ${fadeIn} 0.4s ease;
  transition: width 0.4s ease;
`;

const SidebarTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Brand = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 6px 6px;
  border-radius: 14px;

  ${(props) =>
    props.$collapsed
      ? `
    grid-template-columns: 1fr;
    justify-items: center;
    padding: 6px 6px;
  `
      : ""}
`;

const BrandMark = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.04em;
  box-shadow: 0 10px 20px rgba(79, 70, 229, 0.22);
`;

const BrandText = styled.div`
  color: ${colors.textDark};
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  ${(props) => (props.$collapsed ? "display:none;" : "")}
`;

const CollapseButton = styled.button`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: none;
  background: rgba(17, 24, 39, 0.03);
  color: ${colors.textGray};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(17, 24, 39, 0.06);
    color: ${colors.textDark};
  }

  &:active {
    transform: translateY(1px);
  }

  ${(props) => (props.$collapsed ? "margin-top: 10px;" : "")}

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.95;
  }
`;

const NavLabel = styled.div`
  font-size: 11px;
  font-weight: 800;
  color: ${colors.textGray};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0 10px;
  ${(props) => (props.$collapsed ? "display:none;" : "")}
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MenuItem = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$collapsed ? "0" : "12px")};
  justify-content: ${(props) => (props.$collapsed ? "center" : "flex-start")};
  padding: ${(props) => (props.$collapsed ? "12px 10px" : "12px 12px")};
  border-radius: 12px;
  border: none;
  background: ${(props) => (props.$active ? "rgba(99, 102, 241, 0.10)" : "transparent")};
  color: ${colors.textDark};
  font-size: 14px;
  font-weight: 650;
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
      props.$active ? "rgba(99, 102, 241, 0.12)" : "rgba(17, 24, 39, 0.04)"};
  }
`;

const MenuIconWrap = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: ${(props) => (props.$active ? "rgba(99, 102, 241, 0.16)" : "transparent")};
  color: ${(props) => (props.$active ? colors.secondary : colors.textGray)};
`;

const LogoutButton = styled.button`
  padding: ${(props) => (props.$collapsed ? "12px 10px" : "12px 12px")};
  border-radius: 12px;
  border: none;
  background: rgba(17, 24, 39, 0.04);
  color: ${colors.secondary};
  font-size: 14px;
  font-weight: 650;
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: center;

  &:hover {
    background: rgba(17, 24, 39, 0.06);
  }

  &:active {
    transform: translateY(1px);
  }

  span {
    display: ${(props) => (props.$collapsed ? "none" : "inline")};
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 22px 32px;
  background: #f3f4f6;
`;
