import React from "react";
import styled from "styled-components";

export const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <ButtonContainer>
      <EditButton onClick={onEdit}>Editar</EditButton>
      <DeleteButton onClick={onDelete}>Eliminar</DeleteButton>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
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
