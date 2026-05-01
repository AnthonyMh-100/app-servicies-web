import { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import moment from "moment";
import { useReactiveVar } from "@apollo/client/react";
import { companyNameVar, companyUserNameVar } from "./graphql/reactiveVars";
import { useLogout } from "./services/hooks/useLogout";

const colors = {
  bg: "#eef1f5",
  surface: "#f8fafc",
  surfaceElevated: "#ffffff",
  border: "#dce2e9",
  textStrong: "#0f1724",
  textSoft: "#60758f",
  accent: "#0f4c81",
  accentSoft: "#e5eef7",
  accentSoftHover: "#dbe8f5",
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const companyName = useReactiveVar(companyNameVar);
  const companyUserName = useReactiveVar(companyUserNameVar);

  const brandInitials = (companyName || companyUserName || "WS")
    .toString()
    .trim()
    .slice(0, 2)
    .toUpperCase();

  const ScreenCurrent = useMemo(
    () => screenContent[activeTab]?.screen,
    [activeTab, screenContent],
  );

  const menusBySection = useMemo(() => {
    return menus?.reduce(
      (acc, currentMenu) => {
        const sectionKey = currentMenu.section || "general";
        if (!acc[sectionKey]) acc[sectionKey] = [];
        acc[sectionKey].push(currentMenu);
        return acc;
      },
      { general: [], workspace: [] },
    );
  }, [menus]);

  const handleSelectMenu = (menuKey) => {
    setActiveTab(menuKey);
    setIsMobileSidebarOpen(false);
  };

  return (
    <Container>
      <MobileOverlay
        $visible={isMobileSidebarOpen}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      <Sidebar $collapsed={collapsed} $mobileOpen={isMobileSidebarOpen}>
        <SidebarTop>
          <Brand $collapsed={collapsed}>
            <BrandMark aria-hidden="true">{brandInitials}</BrandMark>
            <BrandContent $collapsed={collapsed}>
              <BrandText title={companyName}>
                {companyName || "Workspace Services"}
              </BrandText>
              <BrandMeta>Panel Operativo</BrandMeta>
            </BrandContent>
            <CollapseButton
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
              title={collapsed ? "Expandir" : "Colapsar"}
              $collapsed={collapsed}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
              </svg>
            </CollapseButton>
          </Brand>

          <MenuSection>
            <NavLabel $collapsed={collapsed}>General</NavLabel>
            <Menu>
              {menusBySection.general?.map((menu) => (
                <MenuItem
                  key={menu.key}
                  $active={activeTab === menu.key}
                  $collapsed={collapsed}
                  onClick={() => handleSelectMenu(menu.key)}
                >
                  <MenuIconWrap $active={activeTab === menu.key}>
                    <menu.Icon />
                  </MenuIconWrap>
                  <span title={menu.name}>{menu.name}</span>
                </MenuItem>
              ))}
            </Menu>
          </MenuSection>

          {!!menusBySection.workspace?.length && (
            <MenuSection>
              <NavLabel $collapsed={collapsed}>Workspace</NavLabel>
              <Menu>
                {menusBySection.workspace.map((menu) => (
                  <MenuItem
                    key={menu.key}
                    $active={activeTab === menu.key}
                    $collapsed={collapsed}
                    onClick={() => handleSelectMenu(menu.key)}
                  >
                    <MenuIconWrap $active={activeTab === menu.key}>
                      <menu.Icon />
                    </MenuIconWrap>
                    <span title={menu.name}>{menu.name}</span>
                  </MenuItem>
                ))}
              </Menu>
            </MenuSection>
          )}
        </SidebarTop>

        <LogoutButton
          type="button"
          $collapsed={collapsed}
          onClick={() => logout()}
          aria-label="Cerrar sesión"
          title="Logout"
        >
          <ContainerLogout>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
              <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" />
            </svg>
            <span>Logout</span>
          </ContainerLogout>
        </LogoutButton>
      </Sidebar>

      <Content>
        <MobileTopbar>
          <MobileMenuButton
            type="button"
            aria-label="Abrir menú"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
            </svg>
          </MobileMenuButton>
          <MobileTitle>{companyName || "Workspace Services"}</MobileTitle>
        </MobileTopbar>

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
  background: ${colors.bg};
`;

const MobileOverlay = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: ${(props) => (props.$visible ? "block" : "none")};
    position: fixed;
    inset: 0;
    z-index: 15;
    background: rgba(15, 23, 36, 0.45);
  }
`;

const Sidebar = styled.div`
  width: ${(props) => (props.$collapsed ? "86px" : "266px")};
  background: ${colors.surfaceElevated};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${(props) => (props.$collapsed ? "18px 14px" : "20px 16px")};
  border-right: 1px solid ${colors.border};
  animation: ${fadeIn} 0.4s ease;
  transition: width 0.25s ease;

  @media (max-width: 900px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 20;
    width: 276px;
    transform: translateX(${(props) => (props.$mobileOpen ? "0" : "-104%")});
    transition: transform 0.25s ease;
  }
`;

const SidebarTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Brand = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 6px;
  border-radius: 14px;

  ${(props) =>
    props.$collapsed
      ? `
    grid-template-columns: 1fr;
    justify-items: center;
  `
      : ""}
`;

const BrandMark = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${colors.accent};
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
`;

const BrandContent = styled.div`
  display: ${(props) => (props.$collapsed ? "none" : "flex")};
  flex-direction: column;
  gap: 2px;
`;

const BrandText = styled.div`
  color: ${colors.textStrong};
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const BrandMeta = styled.span`
  color: ${colors.textSoft};
  font-size: 12px;
  font-weight: 500;
`;

const CollapseButton = styled.button`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid ${colors.border};
  background: ${colors.surface};
  color: ${colors.textSoft};
  cursor: pointer;
  border-radius: 10px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #b9c8d8;
    color: ${colors.textStrong};
  }

  ${(props) => (props.$collapsed ? "margin-top: 10px;" : "")}

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.95;
  }
`;

const MenuSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NavLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${colors.textSoft};
  text-transform: uppercase;
  letter-spacing: 0.09em;
  padding: 0 10px;
  ${(props) => (props.$collapsed ? "display:none;" : "")}
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MenuItem = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$collapsed ? "0" : "12px")};
  justify-content: ${(props) => (props.$collapsed ? "center" : "flex-start")};
  padding: ${(props) => (props.$collapsed ? "10px 8px" : "10px 12px")};
  border-radius: 12px;
  border: 1px solid transparent;
  background: ${(props) => (props.$active ? colors.accentSoft : "transparent")};
  color: ${(props) => (props.$active ? colors.textStrong : colors.textSoft)};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease;

  span {
    display: ${(props) => (props.$collapsed ? "none" : "inline")};
  }

  &:hover {
    background: ${(props) =>
      props.$active ? colors.accentSoftHover : "#eef3f8"};
  }

  &:focus-visible {
    outline: none;
    border-color: rgba(15, 76, 129, 0.35);
  }
`;

const MenuIconWrap = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: ${(props) => (props.$active ? colors.accent : colors.textSoft)};
  background: ${(props) => (props.$active ? "#f3f7fc" : "transparent")};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ContainerLogout = styled.div`
  min-height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #8e2d2d;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$collapsed ? "center" : "flex-start")};
  gap: ${(props) => (props.$collapsed ? "0" : "12px")};
  padding: ${(props) => (props.$collapsed ? "10px 8px" : "10px 12px")};
  border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  color: #8e2d2d;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #fbefef;
  }

  span {
    display: ${(props) => (props.$collapsed ? "none" : "inline")};
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 22px 32px;
  background: ${colors.bg};

  @media (max-width: 900px) {
    padding: 14px;
  }
`;

const MobileTopbar = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    padding: 10px 4px;
  }
`;

const MobileMenuButton = styled.button`
  border: 1px solid ${colors.border};
  background: ${colors.surfaceElevated};
  color: ${colors.textStrong};
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const MobileTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.textStrong};
`;
