import styled from "styled-components";
import { FormLogin } from "./FormLogin";
import { FormRegister } from "./FormRegister";
import { useState } from "react";
import { SECCTION_LOGIN_KEY } from "../Constants";
const { LOGIN } = SECCTION_LOGIN_KEY;

const forms = {
  login: FormLogin,
  register: FormRegister,
};

export const Login = () => {
  const [tabIndex, setTabIndex] = useState(LOGIN);
  const ActiveForm = forms[tabIndex];

  return (
    <Container>
      <Content>
        <BrandPanel>
          <BrandTop>
            <BrandTag>Workspace Services</BrandTag>
            <BrandTitle>Gestiona servicios y cobros con claridad.</BrandTitle>
            <BrandDescription>
              Plataforma para centralizar operaciones, controlar ingresos y dar
              seguimiento a entregas desde un solo lugar.
            </BrandDescription>
          </BrandTop>

          <BrandHighlights>
            <li>Panel diario de ingresos pagados y pendientes.</li>
            <li>Historial por fecha con trazabilidad de pagos.</li>
            <li>Control de servicios activos y finalizados.</li>
          </BrandHighlights>
        </BrandPanel>

        <FormPanel>
          <ActiveForm setTabIndex={setTabIndex} />
        </FormPanel>
      </Content>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: 32px;
  background: #eef1f5;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) {
    padding: 14px;
    align-items: stretch;
  }
`;

const Content = styled.div`
  width: min(1160px, 100%);
  min-height: 740px;
  display: flex;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid #dce2e9;
  box-shadow: 0 24px 56px rgba(20, 31, 46, 0.08);
  background: #f8fafc;

  @media (max-width: 900px) {
    min-height: auto;
    flex-direction: column;
    border-radius: 20px;
  }
`;

const BrandPanel = styled.aside`
  flex: 1;
  background: #0f1724;
  color: #f8fafc;
  padding: 56px 52px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 900px) {
    padding: 34px 24px 26px;
    gap: 28px;
  }
`;

const BrandTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BrandTag = styled.span`
  width: fit-content;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8ea2bf;
`;

const BrandTitle = styled.h1`
  margin: 0;
  font-size: clamp(32px, 3.6vw, 48px);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -0.03em;
`;

const BrandDescription = styled.p`
  margin: 0;
  max-width: 500px;
  color: #b8c4d5;
  font-size: 16px;
  line-height: 1.65;
`;

const BrandHighlights = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    position: relative;
    padding-left: 18px;
    color: #d4deea;
    font-size: 14px;
    line-height: 1.55;
  }

  li::before {
    content: "";
    position: absolute;
    top: 9px;
    left: 0;
    width: 6px;
    height: 6px;
    border-radius: 99px;
    background: #2dd4bf;
  }
`;

const FormPanel = styled.section`
  width: min(520px, 100%);
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 48px;

  @media (max-width: 900px) {
    width: 100%;
    padding: 28px 20px 30px;
  }
`;
