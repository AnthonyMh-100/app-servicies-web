import styled, { keyframes } from "styled-components";

export const DeleteModal = ({ title, content, onConfirm, onCancel }) => {
  return (
    <Overlay onClick={onCancel}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <IconWrapper>
          <WarningIcon>!</WarningIcon>
        </IconWrapper>

        <Title>{title}</Title>
        <Content>{content}</Content>

        <Actions>
          <CancelButton onClick={onCancel}>Cancelar</CancelButton>
          <ConfirmButton onClick={onConfirm}>Eliminar</ConfirmButton>
        </Actions>
      </Modal>
    </Overlay>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideInWarning = keyframes`
  from {
    transform: scale(0.5) rotate(-10deg);
    opacity: 0;
  }
  to {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(1px);
`;

const Modal = styled.div`
  width: 420px;
  background: #ffffff;
  border-radius: 20px;
  padding: 32px 28px;
  animation: ${fadeIn} 0.3s ease;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const WarningIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  font-weight: 700;
  color: #ffffff;
  animation: ${slideInWarning} 0.4s ease;
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin: 0;
`;

const Content = styled.p`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin: 0;
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  width: 100%;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid #e5e7eb;
  background: #ffffff;
  color: #6b7280;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ConfirmButton = styled.button`
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;
