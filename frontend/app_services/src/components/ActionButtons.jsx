import React from "react";
import styled from "styled-components";

export const ActionButtons = ({
  onEdit,
  onDelete,
  onPay,
  onViewPayments,
  payDisabled = false,
}) => {
  return (
    <ButtonContainer>
      {onPay && (
        <IconButton
          type="button"
          onClick={onPay}
          disabled={payDisabled}
          title={payDisabled ? "Este servicio ya está pagado" : "Registrar pago"}
          aria-label="Registrar pago"
        >
          <PayIcon />
        </IconButton>
      )}

      {onViewPayments && (
        <IconButton
          type="button"
          onClick={onViewPayments}
          title="Ver pagos"
          aria-label="Ver pagos"
        >
          <ViewIcon />
        </IconButton>
      )}

      <IconButton type="button" onClick={onEdit} title="Editar" aria-label="Editar">
        <EditIcon />
      </IconButton>

      <DangerButton
        type="button"
        onClick={onDelete}
        title="Eliminar"
        aria-label="Eliminar"
      >
        <DeleteIcon />
      </DangerButton>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ButtonBase = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid #dce2e9;
  background: #ffffff;
  color: #60758f;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  svg {
    width: 17px;
    height: 17px;
    stroke: currentColor;
    strokeWidth: 1.9;
    fill: none;
  }

  &:hover {
    background: #f5f8fc;
    border-color: #c3d2e2;
    color: #0f4c81;
  }

  &:focus-visible {
    outline: none;
    border-color: rgba(15, 76, 129, 0.5);
    box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.14);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const IconButton = styled(ButtonBase)``;

const DangerButton = styled(ButtonBase)`
  color: #8e2d2d;

  &:hover {
    background: #fef2f2;
    border-color: #edcaca;
    color: #b42318;
  }
`;

const EditIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 20h4l10-10-4-4L4 16v4z" />
    <path d="M13.5 6.5l4 4" />
  </svg>
);

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 7h16" />
    <path d="M10 11v6M14 11v6" />
    <path d="M6 7l1 12h10l1-12" />
    <path d="M9 7V4h6v3" />
  </svg>
);

const PayIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2v20" />
    <path d="M17 6.5a4.5 4.5 0 0 0-3.9-2.2h-2.2a3.9 3.9 0 0 0 0 7.8h2.2a3.9 3.9 0 0 1 0 7.8h-2.2A4.5 4.5 0 0 1 7 17.7" />
  </svg>
);

const ViewIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);
