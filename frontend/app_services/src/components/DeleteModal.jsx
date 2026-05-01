import styled, { keyframes } from "styled-components";

const TOKENS = {
  overlay: "rgba(15, 23, 36, 0.45)",
  surface: "#ffffff",
  border: "#dce2e9",
  textStrong: "#0f1724",
  textSoft: "#60758f",
  accent: "#0f4c81",
  danger: "#b42318",
  dangerSoft: "#fef2f2",
};

export const DeleteModal = ({ title, content, onConfirm, onCancel }) => {
  return (
    <Overlay onClick={onCancel}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Badge>Confirmación</Badge>
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
    transform: translateY(6px) scale(0.98);
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
`;

const Modal = styled.div`
  width: min(460px, 96vw);
  background: ${TOKENS.surface};
  border: 1px solid ${TOKENS.border};
  border-radius: 16px;
  padding: 20px;
  animation: ${fadeIn} 0.22s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Badge = styled.span`
  width: fit-content;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${TOKENS.danger};
  background: ${TOKENS.dangerSoft};
  border: 1px solid #f2d1ce;
  padding: 4px 8px;
  border-radius: 999px;
`;

const Title = styled.h3`
  margin: 0;
  color: ${TOKENS.textStrong};
  font-size: 20px;
`;

const Content = styled.p`
  margin: 0;
  color: ${TOKENS.textSoft};
  font-size: 14px;
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
`;

const ButtonBase = styled.button`
  min-height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const CancelButton = styled(ButtonBase)`
  border: 1px solid ${TOKENS.border};
  background: #fff;
  color: ${TOKENS.textStrong};
`;

const ConfirmButton = styled(ButtonBase)`
  border: 1px solid ${TOKENS.danger};
  background: ${TOKENS.danger};
  color: #fff;
`;
