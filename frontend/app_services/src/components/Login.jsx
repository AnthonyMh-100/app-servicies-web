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
        <ActiveForm setTabIndex={setTabIndex} />
      </Content>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: 24px;
  background:
    radial-gradient(
        900px 520px at 20% 15%,
        rgba(99, 102, 241, 0.18),
        transparent 60%
      ),
    radial-gradient(
        720px 420px at 80% 75%,
        rgba(129, 140, 248, 0.16),
        transparent 58%
      ),
    linear-gradient(135deg, #f8fafc, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter", system-ui, sans-serif;
  overflow: hidden;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  > * {
    position: relative;
    z-index: 1;
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    filter: blur(40px);
    opacity: 0.55;
    pointer-events: none;
  }

  &::before {
    top: -220px;
    left: -220px;
    background: radial-gradient(
      circle at 30% 30%,
      rgba(99, 102, 241, 0.55),
      transparent 60%
    );
  }

  &::after {
    bottom: -240px;
    right: -240px;
    background: radial-gradient(
      circle at 30% 30%,
      rgba(129, 140, 248, 0.45),
      transparent 62%
    );
  }
`;
