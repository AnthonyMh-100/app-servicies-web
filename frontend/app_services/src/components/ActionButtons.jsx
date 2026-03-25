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
        <PayButton
          type="button"
          onClick={onPay}
          disabled={payDisabled}
          title={payDisabled ? "Este servicio ya está pagado" : "Registrar pago"}
        >
          Pagar
        </PayButton>
      )}
      {onViewPayments && (
        <ViewButton type="button" onClick={onViewPayments}>
          Ver pagos
        </ViewButton>
      )}
      <EditButton type="button" onClick={onEdit}>
        Editar
      </EditButton>
      <DeleteButton type="button" onClick={onDelete}>
        Eliminar
      </DeleteButton>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ButtonBase = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const EditButton = styled(ButtonBase)`
  background-color: #6366f1;
  color: #ffffff;

  &:hover {
    background-color: #4f46e5;
  }

  &:active {
    background-color: #3730a3;
  }
`;

const PayButton = styled(ButtonBase)`
  background-color: #10b981;
  color: #ffffff;

  &:hover {
    background-color: #059669;
  }

  &:active {
    background-color: #047857;
  }

  &:disabled:hover {
    background-color: #10b981;
  }
`;

const ViewButton = styled(ButtonBase)`
  background-color: #eef2ff;
  color: #4f46e5;
  border: 1px solid #c7d2fe;

  &:hover {
    background-color: #e0e7ff;
  }

  &:active {
    background-color: #c7d2fe;
  }
`;

const DeleteButton = styled(ButtonBase)`
  background-color: #f87171;
  color: #ffffff;

  &:hover {
    background-color: #ef4444;
  }

  &:active {
    background-color: #b91c1c;
  }
`;
