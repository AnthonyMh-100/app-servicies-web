import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { SECCTION_LOGIN_KEY } from "../Constants";
import { useServices } from "../services/hooks";

const { LOGIN } = SECCTION_LOGIN_KEY;

export const FormRegister = ({ setTabIndex }) => {
  const [userRegister, setUserRegister] = useState({
    code: "",
    name: "",
    username: "",
    password: "",
    phone: "",
  });

  const { handleSubmitRegister } = useServices({});
  const handleFieldsUser = ({ target }) => {
    const { name, value } = target;
    setUserRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isDisabled = !(
    userRegister.code?.trim().length &&
    userRegister.name?.trim().length &&
    userRegister.username?.trim().length &&
    userRegister.password?.trim().length &&
    userRegister.phone?.trim().length
  );

  return (
    <Card aria-label="Formulario de registro de empresa">
      <Header>
        <Eyebrow>Registro</Eyebrow>
        <Title>Crea tu empresa</Title>
        <Subtitle>
          Configura tu espacio para empezar a gestionar servicios.
        </Subtitle>
      </Header>

      <Form onSubmit={(e) => handleSubmitRegister(e, userRegister)}>
        <Field>
          <Label htmlFor="company-code">Código de la empresa</Label>
          <Input
            id="company-code"
            type="text"
            placeholder="Ej. WS-001"
            autoComplete="off"
            name="code"
            value={userRegister.code}
            onChange={handleFieldsUser}
          />
        </Field>

        <Field>
          <Label htmlFor="company-name">Nombre de la empresa</Label>
          <Input
            id="company-name"
            type="text"
            placeholder="Nombre comercial"
            autoComplete="organization"
            name="name"
            value={userRegister.name}
            onChange={handleFieldsUser}
          />
        </Field>

        <Field>
          <Label htmlFor="username">Ususario</Label>
          <Input
            id="username"
            type="text"
            placeholder="Tu ususario"
            autoComplete="username"
            name="username"
            value={userRegister.username}
            onChange={handleFieldsUser}
          />
        </Field>

        <Field>
          <Label htmlFor="company-password">Contraseña</Label>
          <Input
            id="company-password"
            type="password"
            placeholder="Crea una contraseña segura"
            autoComplete="new-password"
            name="password"
            value={userRegister.password}
            onChange={handleFieldsUser}
          />
        </Field>

        <Field>
          <Label htmlFor="company-phone">Teléfono</Label>
          <Input
            id="company-phone"
            type="tel"
            placeholder="+51 999 999 999"
            autoComplete="tel"
            name="phone"
            value={userRegister.phone}
            onChange={handleFieldsUser}
          />
        </Field>

        <Button type="submit" disabled={isDisabled}>
          Crear Empresa
        </Button>
        <SecondaryButton type="button" onClick={() => setTabIndex(LOGIN)}>
          Volver al login
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
  width: min(420px, 100%);
  padding: 4px;
  background: transparent;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeIn} 0.6s ease;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Eyebrow = styled.span`
  font-size: 12px;
  color: #60758f;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 34px;
  font-weight: 700;
  color: #0f1724;
  letter-spacing: -0.04em;
  line-height: 1.05;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 15px;
  color: #60758f;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #243446;
`;

const Input = styled.input`
  width: 100%;
  padding: 13px 14px;
  border-radius: 11px;
  border: 1px solid #ccd6e2;
  background: #ffffff;
  font-size: 15px;
  color: #0f1724;
  outline: none;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #8ea2bf;
  }

  &:focus {
    border-color: #0f4c81;
    box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.18);
  }

  &::placeholder {
    color: #8da0b6;
  }
`;

const Button = styled.button`
  margin-top: 6px;
  min-height: 46px;
  border-radius: 11px;
  border: 1px solid #0f4c81;
  background: #0f4c81;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #0c3d69;
  }

  &:disabled {
    cursor: not-allowed;
    background: #8da0b6;
    border-color: #8da0b6;
  }

  &:focus-visible {
    outline: 3px solid rgba(15, 76, 129, 0.25);
    outline-offset: 1px;
  }
`;

const SecondaryButton = styled.button`
  min-height: 46px;
  border: 1px solid #ccd6e2;
  border-radius: 11px;
  background: #f2f5f8;
  color: #243446;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #e9eef3;
  }

  &:focus-visible {
    outline: 3px solid rgba(15, 76, 129, 0.18);
    outline-offset: 1px;
  }
`;
