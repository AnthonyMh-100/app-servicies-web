import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { SECCTION_LOGIN_KEY } from "../Constants";
import { useServices } from "../services/hooks";
import { InformativeModal } from "./InformativeModal";

const { REGISTER } = SECCTION_LOGIN_KEY;

export const FormLogin = ({ setTabIndex }) => {
  const [user, setUser] = useState({});

  const { handleSubmit, isError, setIsError } = useServices({});

  const handleFieldsUser = ({ target }) => {
    const { name, value } = target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Card>
        <Header>
          <Title>Bienvenido</Title>
          <Subtitle>Ingresa tus credenciales</Subtitle>
        </Header>

        <Form onSubmit={(e) => handleSubmit(e, user)}>
          <Input
            type="text"
            placeholder="Username"
            autoComplete="username"
            name="username"
            onChange={handleFieldsUser}
          />

          <Input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            name="password"
            onChange={handleFieldsUser}
          />

          <Button type="submit">Ingresar</Button>

          <SecondaryButton type="button" onClick={() => setTabIndex(REGISTER)}>
            Crear empresa
          </SecondaryButton>
        </Form>
      </Card>
      {isError && (
        <Container>
          <InformativeModal
            title="Error de autenticación"
            description="No se pudieron validar tus credenciales. Por favor, verifica tu username y password e intenta nuevamente."
            onClose={() => setIsError(null)}
          />
        </Container>
      )}
    </>
  );
};

export default FormLogin;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Container = styled.div`
  position: absolute;
`;

const Card = styled.div`
  width: min(520px, 94vw);
  padding: 44px 44px 36px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 26px;
  border: 1px solid rgba(229, 231, 235, 0.9);
  box-shadow:
    0 34px 80px rgba(17, 24, 39, 0.12),
    0 8px 24px rgba(17, 24, 39, 0.06);
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 22px;
  animation: ${fadeIn} 0.6s ease;
  position: relative;

  @supports (
    (-webkit-backdrop-filter: blur(10px)) or (backdrop-filter: blur(10px))
  ) {
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }

  &::before {
    content: "";
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 6px;
    border-radius: 999px;
    background: linear-gradient(90deg, #6366f1, #818cf8);
    opacity: 0.75;
    box-shadow: 0 10px 24px rgba(99, 102, 241, 0.22);
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
  padding-top: 6px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  color: #111827;
  text-align: center;
  letter-spacing: -0.4px;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 4px;
`;

const Input = styled.input`
  padding: 16px 16px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 15px;
  color: #111827;
  outline: none;
  transition: all 0.25s ease;

  &:hover {
    border-color: #d1d5db;
    background: #ffffff;
  }

  &:focus {
    background: #ffffff;
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.18);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Button = styled.button`
  margin-top: 12px;
  padding: 16px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #6366f1, #818cf8);
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 36px rgba(99, 102, 241, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.25);
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 18px 36px rgba(99, 102, 241, 0.34),
      0 0 0 4px rgba(99, 102, 241, 0.22);
  }
`;

const SecondaryButton = styled.button`
  margin-top: 6px;
  padding: 14px;
  border: 1px solid rgba(199, 210, 254, 0.95);
  border-radius: 16px;
  background: rgba(238, 242, 255, 0.75);
  color: #4f46e5;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(224, 231, 255, 0.85);
    border-color: rgba(165, 180, 252, 0.95);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    background: rgba(199, 210, 254, 0.9);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.14);
  }
`;
