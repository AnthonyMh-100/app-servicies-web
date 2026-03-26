import React, { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import moment from "moment";
import { formatterCurrency } from "../../utils/utils";
import { usePayments } from "../hooks/usePayments";

const currentDate = () => moment().format("YYYY-MM-DD");

export const ServicePaymentModal = ({
  service,
  onClose,
  setShowPaymentModal,
}) => {
  const [paidDate, setPaidDate] = useState(currentDate());
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { payments, createServicePayment, paymentLoading, paymentError } =
    usePayments({
      serviceId: service?.id,
      skipPayments: !service?.id,
    });

  const errorMessage = paymentError?.errors?.[0]?.message || null;

  const summary = useMemo(() => {
    const total = Number(service?.total) || 0;
    const paid = (payments || []).reduce(
      (acc, payment) => acc + (Number(payment?.amount) || 0),
      0,
    );
    const pending = Math.max(total - paid, 0);
    return { total, paid, pending };
  }, [service, payments]);

  const amountNumber = useMemo(() => {
    if (amount == null || amount === "") return 0;
    const parsed = Number(amount);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [amount]);

  const amountExceedsPending = amountNumber > summary.pending;
  const canSubmit =
    Boolean(service?.id) &&
    Boolean(paidDate) &&
    Number(amountNumber) > 0 &&
    !amountExceedsPending &&
    !paymentLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service?.id) return;

    setSuccessMessage("");
    await createServicePayment({
      variables: {
        serviceId: service.id,
        paymentInfo: {
          paidDate,
          amount: Number(amount),
          ...(note.trim() ? { note: note.trim() } : {}),
        },
      },
      onCompleted: () => {
        setSuccessMessage("Pago registrado correctamente.");
        setAmount("");
        setNote("");
        setShowPaymentModal(false);
      },
    });
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Pagar servicio</Title>
          <CloseButton onClick={onClose} aria-label="Cerrar">
            ×
          </CloseButton>
        </Header>

        <ServiceHeaderCard>
          <ServiceName>{service?.name || "-"}</ServiceName>
          <ServiceMeta>
            <Stat>
              <StatLabel>Total</StatLabel>
              <StatValue>{formatterCurrency.format(summary.total)}</StatValue>
            </Stat>
            <Stat>
              <StatLabel>Pagado</StatLabel>
              <StatValue>{formatterCurrency.format(summary.paid)}</StatValue>
            </Stat>
            <Stat $variant="pending">
              <StatLabel>Pendiente</StatLabel>
              <StatValue>{formatterCurrency.format(summary.pending)}</StatValue>
            </Stat>
          </ServiceMeta>
        </ServiceHeaderCard>

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
                aria-invalid={amountExceedsPending}
              />
            </Field>

            <PayAllField>
              <Label>&nbsp;</Label>
              <GhostButton
                type="button"
                onClick={() =>
                  setAmount(
                    summary.pending > 0 ? summary.pending.toFixed(2) : "",
                  )
                }
                disabled={summary.pending <= 0}
              >
                Pagar todo
              </GhostButton>
            </PayAllField>
          </Grid>

          <GridSubRow aria-hidden="true">
            <div />
            <Hint>Máximo: {formatterCurrency.format(summary.pending)}</Hint>
            <div />
          </GridSubRow>

          <FullWidthRow>
            <Field>
              <Label>Nota (opcional)</Label>
              <Textarea
                placeholder="Escribe una nota..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Field>
          </FullWidthRow>

          {amountExceedsPending && (
            <ErrorText>
              El monto no puede ser mayor al pendiente (
              {formatterCurrency.format(summary.pending)}).
            </ErrorText>
          )}

          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
          {successMessage && <SuccessText>{successMessage}</SuccessText>}

          <Actions>
            <CancelButton type="button" onClick={onClose}>
              Cerrar
            </CancelButton>
            <ConfirmButton type="submit" disabled={!canSubmit}>
              {paymentLoading ? "Guardando..." : "Registrar pago"}
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
  padding: 18px;
`;

const Modal = styled.div`
  width: min(820px, 96vw);
  max-height: 90vh;
  overflow: auto;
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
  margin-bottom: 14px;
`;

const Title = styled.h3`
  font-size: 20px;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  font-size: 30px;
  line-height: 1;
  color: #6b7280;
  cursor: pointer;
`;

const ServiceHeaderCard = styled.div`
  background: linear-gradient(135deg, #eef2ff 0%, #ffffff 55%);
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 14px;
`;

const ServiceName = styled.div`
  font-size: 15px;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ServiceMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 10px 12px;
  display: grid;
  gap: 4px;
  ${({ $variant }) =>
    $variant === "pending"
      ? `border-color: rgba(245, 158, 11, 0.45); background: rgba(255, 251, 235, 0.85);`
      : ""}
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #4f46e5;
`;

const StatValue = styled.div`
  font-size: 14px;
  color: #111827;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FullWidthRow = styled.div`
  width: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 140px;
  gap: 16px;
  align-items: end;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const GridSubRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 140px;
  gap: 16px;
  margin-top: -10px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    margin-top: -6px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PayAllField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;

  @media (max-width: 640px) {
    align-items: stretch;
  }
`;

const Label = styled.label`
  font-size: 13px;
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

  &[aria-invalid="true"] {
    border-color: rgba(220, 38, 38, 0.6);
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
  }
`;

const Hint = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
`;

const GhostButton = styled.button`
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 999px;
  height: 44px;
  padding: 0 14px;
  font-weight: 700;
  font-size: 12px;
  color: #111827;
  cursor: pointer;
  white-space: nowrap;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  color: #dc2626;
  background: rgba(220, 38, 38, 0.08);
  padding: 10px 12px;
  border-radius: 12px;
`;

const SuccessText = styled.div`
  font-size: 13px;
  color: #065f46;
  background: rgba(16, 185, 129, 0.12);
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
  cursor: pointer;
`;

const ConfirmButton = styled.button`
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
