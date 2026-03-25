import React, { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { formatterCurrency } from "../../utils/utils";
import { usePayments } from "../hooks/usePayments";

const todayISO = () => new Date().toISOString().slice(0, 10);

export const ServicePaymentModal = ({ service, onClose }) => {
  const [paidDate, setPaidDate] = useState(todayISO());
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const { createServicePayment, paymentLoading, paymentError } = usePayments({
    serviceId: service?.id,
    skipPayments: true,
  });

  const errorMessage = paymentError?.errors?.[0]?.message || null;

  const summary = useMemo(() => {
    const total = Number(service?.total) || 0;
    const advance = Number(service?.total_advance) || 0;
    const pending = Number(service?.total_pending) || 0;
    return { total, advance, pending };
  }, [service]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service?.id) return;

    await createServicePayment({
      variables: {
        serviceId: service.id,
        paymentInfo: {
          paidDate,
          amount: Number(amount),
          ...(note.trim() ? { note: note.trim() } : {}),
        },
      },
      onCompleted: () => onClose(),
    });
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Pagar servicio</Title>
          <CloseButton onClick={onClose}>x</CloseButton>
        </Header>

        <ServiceInfo>
          <InfoRow>
            <InfoLabel>Servicio</InfoLabel>
            <InfoValue>{service?.name || "-"}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Total</InfoLabel>
            <InfoValue>{formatterCurrency.format(summary.total)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Adelanto</InfoLabel>
            <InfoValue>{formatterCurrency.format(summary.advance)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Pendiente</InfoLabel>
            <InfoValue>{formatterCurrency.format(summary.pending)}</InfoValue>
          </InfoRow>
        </ServiceInfo>

        <Form onSubmit={handleSubmit}>
          <Grid>
            <Field>
              <Label>Fecha de pago</Label>
              <Input
                type="date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                required
              />
            </Field>
            <Field>
              <Label>Monto</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </Field>
          </Grid>

          <Field>
            <Label>Nota (opcional)</Label>
            <Textarea
              placeholder="Escribe una nota..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>

          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

          <Actions>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <ConfirmButton type="submit" disabled={paymentLoading}>
              {paymentLoading ? "Guardando..." : "Crear pago"}
            </ConfirmButton>
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
  z-index: 9999;
`;

const Modal = styled.div`
  width: 560px;
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
  margin-bottom: 16px;
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

const ServiceInfo = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 14px 16px;
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 10px;
  align-items: center;
`;

const InfoLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #4f46e5;
`;

const InfoValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
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

const ErrorText = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #dc2626;
  background: rgba(220, 38, 38, 0.08);
  padding: 10px 12px;
  border-radius: 12px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 6px;
`;

const CancelButton = styled.button`
  padding: 10px 18px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-weight: 600;
  cursor: pointer;
`;

const ConfirmButton = styled.button`
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

