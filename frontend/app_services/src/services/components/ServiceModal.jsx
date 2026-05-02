import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useServices } from "../hooks/useServices";

const TOKENS = {
  overlay: "rgba(15, 23, 36, 0.45)",
  surface: "#ffffff",
  border: "#dce2e9",
  textStrong: "#0f1724",
  textSoft: "#60758f",
  accent: "#0f4c81",
  accentSoft: "#e5eef7",
};

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

  const {
    handleEditSubmitServices,
    handleSubmitServices,
    createServiceLoading,
    editServiceLoading,
  } = useServices({
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
      isCompleted: Boolean(serviceInfoEdit?.isCompleted),
    };

    const timeoutId = setTimeout(() => {
      setServiceInfo(baseInfo);
      setIsPartialPayment(!baseInfo.isCompleted);
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

  const isDisabledFields = useMemo(() => {
    const { delivery_date, total } = serviceInfo;
    return !delivery_date || !total;
  }, [serviceInfo]);
  const isEditing = Boolean(serviceInfo?.id);
  const isSubmitting = isEditing ? editServiceLoading : createServiceLoading;

  return (
    <Overlay onClick={() => !isSubmitting && onClose()}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{isEditing ? "Editar servicio" : "Nuevo servicio"}</Title>
          <CloseButton onClick={onClose} aria-label="Cerrar" disabled={isSubmitting}>
            ×
          </CloseButton>
        </Header>

        <Form onSubmit={isEditing ? handleEditSubmit : handleSubmit}>
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
            <Label>Descripción</Label>
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
            <CancelButton type="button" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </CancelButton>
            <SubmitButton type="submit" disabled={isDisabledFields || isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </SubmitButton>
          </Actions>
        </Form>
      </Modal>
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
`;

const Modal = styled.div`
  width: min(620px, 96vw);
  background: ${TOKENS.surface};
  border-radius: 16px;
  border: 1px solid ${TOKENS.border};
  padding: 20px;
  animation: ${fadeIn} 0.22s ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  color: ${TOKENS.textStrong};
`;

const CloseButton = styled.button`
  border: 1px solid ${TOKENS.border};
  background: #fff;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: ${TOKENS.textSoft};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 12px;
  color: ${TOKENS.textSoft};
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const Input = styled.input`
  min-height: 40px;
  border-radius: 10px;
  border: 1px solid ${TOKENS.border};
  padding: 8px 12px;
  font-size: 14px;
  color: ${TOKENS.textStrong};

  &:focus {
    outline: none;
    border-color: ${TOKENS.accent};
    box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.14);
  }
`;

const Textarea = styled.textarea`
  border-radius: 10px;
  border: 1px solid ${TOKENS.border};
  padding: 10px 12px;
  min-height: 96px;
  resize: none;

  &:focus {
    outline: none;
    border-color: ${TOKENS.accent};
    box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.14);
  }
`;

const PaymentSelector = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const PaymentOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: ${TOKENS.textStrong};

  input {
    accent-color: ${TOKENS.accent};
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
`;

const ButtonBase = styled.button`
  min-height: 40px;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const CancelButton = styled(ButtonBase)`
  border: 1px solid ${TOKENS.border};
  background: #fff;
  color: ${TOKENS.textStrong};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const SubmitButton = styled(ButtonBase)`
  border: 1px solid ${TOKENS.accent};
  background: ${({ disabled }) => (disabled ? "#8da0b6" : TOKENS.accent)};
  color: #fff;
`;
