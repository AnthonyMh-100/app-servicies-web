import React from "react";
import styled, { keyframes } from "styled-components";

const TOKENS = {
  overlay: "rgba(15, 23, 36, 0.45)",
  surface: "#ffffff",
  border: "#dce2e9",
  textStrong: "#0f1724",
  textSoft: "#60758f",
  accent: "#0f4c81",
  accentSoft: "#e5eef7",
};

export const InformativeModal = ({
  title = "Descripción",
  description,
  onClose,
}) => {
  return (
    <Overlay onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
        </Header>

        <Content>{description}</Content>

        <Footer>
          <CloseButton onClick={onClose}>Cerrar</CloseButton>
        </Footer>
      </Card>
    </Overlay>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${TOKENS.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
`;

const Card = styled.div`
  width: min(560px, 96vw);
  max-height: 72vh;
  padding: 20px;
  background: ${TOKENS.surface};
  border: 1px solid ${TOKENS.border};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: ${fadeIn} 0.2s ease;
`;

const Header = styled.div`
  text-align: left;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${TOKENS.textStrong};
`;

const Content = styled.div`
  font-size: 14px;
  line-height: 1.65;
  color: ${TOKENS.textSoft};
  overflow-y: auto;
  padding-right: 4px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  min-height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #c8d9ea;
  background: ${TOKENS.accentSoft};
  color: ${TOKENS.accent};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
