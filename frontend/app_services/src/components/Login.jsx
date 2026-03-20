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
      <ActiveForm setTabIndex={setTabIndex} />
    </Container>
  );
};

export default Login;

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #f1f5f9, #d1d5db);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter", system-ui, sans-serif;
`;
