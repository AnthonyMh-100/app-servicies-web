import React, { useMemo, useState } from "react";
import moment from "moment";
import styled, { keyframes } from "styled-components";
import { formatterCurrency } from "../../utils/utils";
import { usePayments } from "../hooks/usePayments";

const TOKENS = {
  overlay: "rgba(15, 23, 36, 0.45)",
  surface: "#ffffff",
  border: "#dce2e9",
  textStrong: "#0f1724",
  textSoft: "#60758f",
  accent: "#0f4c81",
  accentSoft: "#e5eef7",
};

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

          <Field>
            <Label>Nota (opcional)</Label>
            <Textarea
              placeholder="Escribe una nota..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>

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
  z-index: 9999;
  padding: 16px;
`;

const Modal = styled.div`
  width: min(820px, 96vw);
  max-height: 90vh;
  overflow: auto;
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
  margin-bottom: 10px;
`;

const Title = styled.h3`
  font-size: 20px;
  color: ${TOKENS.textStrong};
  margin: 0;
`;

const CloseButton = styled.button`
  border: 1px solid ${TOKENS.border};
  background: #fff;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: ${TOKENS.textSoft};
  cursor: pointer;
`;

const ServiceHeaderCard = styled.div`
  background: #f9fbfd;
  border: 1px solid ${TOKENS.border};
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
`;

const ServiceName = styled.div`
  font-size: 14px;
  color: ${TOKENS.textStrong};
`;

const ServiceMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.div`
  background: #fff;
  border: 1px solid ${TOKENS.border};
  border-radius: 10px;
  padding: 8px 10px;
  display: grid;
  gap: 4px;
  ${({ $variant }) =>
    $variant === "pending"
      ? `border-color: #f2d9bb; background: #fff8f0;`
      : ""}
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${TOKENS.textSoft};
`;

const StatValue = styled.div`
  font-size: 14px;
  color: ${TOKENS.textStrong};
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 130px;
  gap: 10px;
  align-items: end;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const GridSubRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 130px;
  gap: 10px;
  margin-top: -8px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    margin-top: -4px;
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
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${TOKENS.textSoft};
`;

const Input = styled.input`
  min-height: 40px;
  border-radius: 10px;
  border: 1px solid ${TOKENS.border};
  padding: 8px 12px;

  &:focus {
    outline: none;
    border-color: ${TOKENS.accent};
    box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.14);
  }

  &[aria-invalid="true"] {
    border-color: rgba(180, 35, 24, 0.6);
    box-shadow: 0 0 0 3px rgba(180, 35, 24, 0.12);
  }
`;

const Hint = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${TOKENS.textSoft};
`;

const GhostButton = styled.button`
  border: 1px solid #c8d9ea;
  background: ${TOKENS.accentSoft};
  border-radius: 999px;
  height: 40px;
  padding: 0 12px;
  font-weight: 700;
  font-size: 12px;
  color: ${TOKENS.accent};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  border-radius: 10px;
  border: 1px solid ${TOKENS.border};
  padding: 10px 12px;
  min-height: 90px;
  resize: none;

  &:focus {
    outline: none;
    border-color: ${TOKENS.accent};
    box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.14);
  }
`;

const ErrorText = styled.div`
  font-size: 13px;
  color: #b42318;
  background: #fef2f2;
  padding: 10px 12px;
  border-radius: 10px;
`;

const SuccessText = styled.div`
  font-size: 13px;
  color: #127a56;
  background: #e8f7f1;
  padding: 10px 12px;
  border-radius: 10px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
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
  border: 1px solid ${TOKENS.accent};
  background: ${TOKENS.accent};
  color: #fff;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
