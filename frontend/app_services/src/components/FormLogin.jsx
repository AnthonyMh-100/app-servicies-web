import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { SECCTION_LOGIN_KEY } from "../Constants";
import { useServices } from "../services/hooks";
import { InformativeModal } from "./InformativeModal";

const { REGISTER } = SECCTION_LOGIN_KEY;

export const FormLogin = ({ setTabIndex }) => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const { handleSubmit, isError, setIsError } = useServices({});

  const handleFieldsUser = ({ target }) => {
    const { name, value } = target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isDisabled =
    !user.username?.trim().length || !user.password?.trim().length;

  return (
    <>
      <Card aria-label="Formulario de inicio de sesión">
        <Header>
          <Eyebrow>Acceso</Eyebrow>
          <Title>Inicia sesion</Title>
          <Subtitle>
            Continua con tu cuenta para administrar servicios y cobros.
          </Subtitle>
        </Header>

        <Form onSubmit={(e) => handleSubmit(e, user)}>
          <Field>
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="Tu usuario"
              autoComplete="username"
              name="username"
              value={user.username}
              onChange={handleFieldsUser}
              aria-invalid={Boolean(isError)}
            />
          </Field>

          <Field>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              name="password"
              value={user.password}
              onChange={handleFieldsUser}
              aria-invalid={Boolean(isError)}
            />
          </Field>

          <Button type="submit" disabled={isDisabled}>
            Ingresar
          </Button>

          <Divider>
            <span>o</span>
          </Divider>

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

  &[aria-invalid="true"] {
    border-color: #b42318;
    box-shadow: 0 0 0 3px rgba(180, 35, 24, 0.16);
  }

  &::placeholder {
    color: #8da0b6;
  }
`;

const InlineRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const GhostLink = styled.button`
  border: none;
  background: transparent;
  color: #0f4c81;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 0;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: #0b3558;
  }

  &:focus-visible {
    outline: 2px solid #0f4c81;
    outline-offset: 2px;
    border-radius: 4px;
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

const Divider = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px 0;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: #d9e1ea;
  }

  span {
    position: relative;
    z-index: 1;
    padding: 0 10px;
    font-size: 12px;
    font-weight: 600;
    color: #7a8ea6;
    background: #f8fafc;
  }
`;

const GoogleButton = styled.button`
  min-height: 46px;
  border-radius: 11px;
  border: 1px solid #ccd6e2;
  background: #ffffff;
  color: #243446;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #8ea2bf;
  }

  &:focus-visible {
    outline: 3px solid rgba(15, 76, 129, 0.18);
    outline-offset: 1px;
  }
`;

const GoogleIcon = styled.svg`
  width: 18px;
  height: 18px;
  color: #334a63;
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
