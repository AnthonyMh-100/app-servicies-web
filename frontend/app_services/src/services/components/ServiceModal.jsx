import React, { useCallback, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useServices } from "../hooks/useServices";

export const ServiceModal = ({
  dateFilter,
  serviceInfoEdit = {},
  onClose,
  setShowServiceModal,
}) => {
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({
    id: null,
    name: "",
    description: "",
    delivery_date: "",
    total: 0,
    total_advance: 0,
    total_pending: 0,
  });

  const variablesQuery = {
    date: dateFilter,
    withPagination: false,
  };

  const { handleEditSubmitServices, handleSubmitServices } = useServices({
    setServiceInfo,
    setShowServiceModal,
    onClose,
    variablesQuery,
  });

  useEffect(() => {
    const baseInfo = {
      id: serviceInfoEdit?.id || null,
      name: serviceInfoEdit?.name || "",
      description: serviceInfoEdit?.description || "",
      delivery_date: serviceInfoEdit?.delivery_date || "",
      total: Number(serviceInfoEdit?.total) || 0,
      total_advance: Number(serviceInfoEdit?.total_advance) || 0,
      total_pending: Number(serviceInfoEdit?.total_pending) || 0,
    };

    const timeoutId = setTimeout(() => {
      setServiceInfo(baseInfo);
      setIsPartialPayment(baseInfo.total_pending > 0);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [serviceInfoEdit]);

  const handleServices = ({ target }) => {
    const { name, type, value } = target;
    let finalValue = value;
    if (type === "number") {
      finalValue = value === "" ? "" : Number(value);
    }
    setServiceInfo((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = useCallback(
    (e) => {
      const total = Number(serviceInfo.total) || 0;
      const totalAdvance = isPartialPayment ? 0 : total;

      handleSubmitServices(e, {
        ...serviceInfo,
        createdDate: dateFilter,
        total,
        total_advance: totalAdvance,
        total_pending: isPartialPayment ? Math.max(total - totalAdvance, 0) : 0,
        isCompleted: !isPartialPayment,
      });
    },
    [serviceInfo, isPartialPayment, handleSubmitServices, dateFilter],
  );

  const handleEditSubmit = useCallback(
    (e) => {
      const total = Number(serviceInfo.total) || 0;
      const totalAdvance = isPartialPayment ? 0 : total;

      handleEditSubmitServices(e, {
        ...serviceInfo,
        total,
        total_advance: totalAdvance,
        total_pending: isPartialPayment ? Math.max(total - totalAdvance, 0) : 0,
        isCompleted: !isPartialPayment,
      });
    },
    [serviceInfo, isPartialPayment, handleEditSubmitServices],
  );

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>Nuevo servicio</Title>
          <CloseButton onClick={onClose}>x</CloseButton>
        </Header>

        <Form onSubmit={serviceInfo?.id ? handleEditSubmit : handleSubmit}>
          <Field>
            <Label>Nombre</Label>
            <Input
              placeholder="Nombre del servicio"
              onChange={handleServices}
              name="name"
              value={serviceInfo.name}
            />
          </Field>

          <Field>
            <Label>Descripcion</Label>
            <Textarea
              placeholder="Describe el servicio"
              onChange={handleServices}
              name="description"
              value={serviceInfo.description}
            />
          </Field>

          <Grid>
            <Field>
              <Label>Fecha de entrega</Label>
              <Input
                type="date"
                onChange={handleServices}
                name="delivery_date"
                value={serviceInfo.delivery_date}
              />
            </Field>

            <Field>
              <Label>Total</Label>
              <Input
                type="number"
                placeholder="0.00"
                onChange={handleServices}
                name="total"
                value={serviceInfo.total === 0 ? "" : serviceInfo.total}
                min="0"
              />
            </Field>
          </Grid>

          <PaymentSelector>
            <PaymentOption>
              <input
                type="radio"
                name="paymentType"
                checked={!isPartialPayment}
                onChange={() => setIsPartialPayment(false)}
              />
              <span>Pago completo</span>
            </PaymentOption>

            <PaymentOption>
              <input
                type="radio"
                name="paymentType"
                checked={isPartialPayment}
                onChange={() => setIsPartialPayment(true)}
              />
              <span>Pago parcial</span>
            </PaymentOption>
          </PaymentSelector>

          <Actions>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <SubmitButton type="submit">Guardar</SubmitButton>
          </Actions>
        </Form>
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

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  width: 520px;
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 28px 28px;
  animation: ${fadeIn} 0.3s ease;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  font-size: 26px;
  color: #6b7280;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #4f46e5;
`;

const Input = styled.input`
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

const Textarea = styled.textarea`
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  min-height: 90px;
  resize: none;
  outline: none;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

const PaymentSelector = styled.div`
  display: flex;
  gap: 20px;
  padding: 8px 4px;
`;

const PaymentOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  cursor: pointer;

  input {
    accent-color: #6366f1;
    width: 16px;
    height: 16px;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
`;

const CancelButton = styled.button`
  padding: 10px 18px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-weight: 600;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  background: #6366f1;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #4f46e5;
  }
`;
