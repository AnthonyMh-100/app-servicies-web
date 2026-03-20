import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { SECCTION_LOGIN_KEY } from "../Constants";
const { REGISTER } = SECCTION_LOGIN_KEY;
import { useServices } from "../services/hooks";

export const FormLogin = ({ setTabIndex }) => {
  const [user, setUser] = useState({});

  const { handleSubmit } = useServices({});

  const handleFieldsUser = ({ target }) => {
    const { name, value } = target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card>
      <Title>Bienvenido</Title>
      <Subtitle>Ingresa tus credenciales</Subtitle>

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

const Card = styled.div`
  width: 520px;
  min-height: 580px;
  padding: 48px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 24px;
  animation: ${fadeIn} 0.6s ease;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 15px;
  color: #6b7280;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Input = styled.input`
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid transparent;
  background: linear-gradient(180deg, #f9fafb, #f3f4f6);
  font-size: 15px;
  color: #111827;
  outline: none;
  transition: all 0.25s ease;

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
  padding: 18px;
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
`;

const SecondaryButton = styled.button`
  margin-top: 4px;
  padding: 16px;
  border: none;
  border-radius: 16px;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #e0e7ff;
    border-color: #a5b4fc;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    background: #c7d2fe;
  }
`;
