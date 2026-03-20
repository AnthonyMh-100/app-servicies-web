import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { SECCTION_LOGIN_KEY } from "../Constants";
const { LOGIN } = SECCTION_LOGIN_KEY;
import { useServices } from "../services/hooks";

export const FormRegister = ({ setTabIndex }) => {
  const [userRegister, setUserRegister] = useState({});

  const { handleSubmitRegister } = useServices({});
  const handleFieldsUser = ({ target }) => {
    const { name, value } = target;
    setUserRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card>
      <Title>Registrar Empresa</Title>
      <Subtitle>Completa los datos de la empresa</Subtitle>

      <Form onSubmit={(e) => handleSubmitRegister(e, userRegister)}>
        <Input
          type="text"
          placeholder="Código de la empresa"
          autoComplete="off"
          name="code"
          onChange={handleFieldsUser}
        />

        <Input
          type="text"
          placeholder="Nombre de la empresa"
          autoComplete="organization"
          name="name"
          onChange={handleFieldsUser}
        />

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
          autoComplete="new-password"
          name="password"
          onChange={handleFieldsUser}
        />

        <Input
          type="tel"
          placeholder="Teléfono"
          autoComplete="tel"
          name="phone"
          onChange={handleFieldsUser}
        />

        <Button type="submit">Crear Empresa</Button>
        <SecondaryButton type="button" onClick={() => setTabIndex(LOGIN)}>
          Volver
        </SecondaryButton>
      </Form>
    </Card>
  );
};

export default FormRegister;

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
  width: 560px;
  min-height: 720px;
  padding: 52px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 26px;
  animation: ${fadeIn} 0.6s ease;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 30px;
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
  margin-top: 16px;
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
