import React from "react";
import styled, { keyframes } from "styled-components";

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
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Card = styled.div`
  width: 520px;
  max-height: 70vh;
  padding: 32px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeIn} 0.35s ease;
`;

const Header = styled.div`
  text-align: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
`;

const Content = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: #374151;
  overflow-y: auto;
  padding-right: 4px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;

const CloseButton = styled.button`
  padding: 14px 28px;
  border-radius: 16px;
  border: none;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #e0e7ff;
    transform: translateY(-1px);
  }

  &:active {
    background: #c7d2fe;
    transform: translateY(0);
  }
`;
