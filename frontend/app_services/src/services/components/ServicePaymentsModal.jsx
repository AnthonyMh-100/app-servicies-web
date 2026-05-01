import React, { useMemo } from "react";
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

const formatDate = (value) => {
  if (!value) return "-";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("es-PE");
};

export const ServicePaymentsModal = ({ service, onClose }) => {
  const serviceId = service?.id || null;
  const { payments, paymentsLoading, paymentsError } = usePayments({
    serviceId,
    skipPayments: !serviceId,
  });

  const stats = useMemo(() => {
    const safePayments = Array.isArray(payments) ? payments : [];
    const count = safePayments.length;
    const totalPaid = safePayments.reduce(
      (acc, payment) => acc + (Number(payment?.amount) || 0),
      0,
    );
    const lastPaidDate = safePayments?.[0]?.paidDate || null;
    return {
      count,
      totalPaid,
      totalPaidFormatted: formatterCurrency.format(totalPaid),
      lastPaidDateFormatted: formatDate(lastPaidDate),
    };
  }, [payments]);

  const rows = useMemo(() => {
    if (!payments?.length) return [];
    return payments.map((payment) => ({
      ...payment,
      paidDateFormatted: formatDate(payment.paidDate),
      amountFormatted: formatterCurrency.format(Number(payment.amount) || 0),
      noteFormatted: payment.note || "-",
    }));
  }, [payments]);

  const errorMessage = paymentsError?.errors?.[0]?.message || null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Pagos del servicio</Title>
          <CloseButton onClick={onClose} aria-label="Cerrar">
            ×
          </CloseButton>
        </Header>

        <Subheader>
          <ServiceName>{service?.name || "-"}</ServiceName>
          <StatsRow>
            <Stat>
              <StatLabel>Total pagado</StatLabel>
              <StatValue>{stats.totalPaidFormatted}</StatValue>
            </Stat>
            <Stat>
              <StatLabel>N° pagos</StatLabel>
              <StatValue>{stats.count}</StatValue>
            </Stat>
            <Stat>
              <StatLabel>Último pago</StatLabel>
              <StatValue>{stats.lastPaidDateFormatted}</StatValue>
            </Stat>
          </StatsRow>
        </Subheader>

        {paymentsLoading && <InfoText>Cargando pagos...</InfoText>}
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

        {!paymentsLoading && !errorMessage && (
          <>
            {!rows.length ? (
              <InfoText>No hay pagos registrados para este servicio.</InfoText>
            ) : (
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Monto</th>
                      <th>Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td>{row.paidDateFormatted}</td>
                        <td>{row.amountFormatted}</td>
                        <td title={row.noteFormatted}>{row.noteFormatted}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>
            )}
          </>
        )}

        <Footer>
          <CloseFooterButton onClick={onClose}>Cerrar</CloseFooterButton>
        </Footer>
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
  width: min(980px, 96vw);
  max-height: 88vh;
  overflow: hidden;
  background: ${TOKENS.surface};
  border: 1px solid ${TOKENS.border};
  border-radius: 16px;
  padding: 18px;
  animation: ${fadeIn} 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #eef2f7;
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

const Subheader = styled.div`
  display: grid;
  gap: 10px;
`;

const ServiceName = styled.div`
  font-size: 14px;
  color: ${TOKENS.textStrong};
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  @media (max-width: 820px) {
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

const InfoText = styled.div`
  font-size: 14px;
  color: ${TOKENS.textSoft};
  padding: 8px 0;
`;

const ErrorText = styled.div`
  font-size: 13px;
  color: #b42318;
  background: #fef2f2;
  padding: 10px 12px;
  border-radius: 10px;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow: auto;
  border-radius: 12px;
  border: 1px solid #e6ebf1;
  max-height: 56vh;
  background: #f9fbfd;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    position: sticky;
    top: 0;
    background: #f3f7fb;
    z-index: 1;

    th {
      padding: 10px 12px;
      text-align: left;
      font-size: 12px;
      color: ${TOKENS.textSoft};
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    th:nth-child(2) {
      text-align: right;
    }
  }

  tbody {
    tr:hover {
      background: #f4f8fc;
    }

    td {
      padding: 10px 12px;
      font-size: 13px;
      color: ${TOKENS.textStrong};
      border-bottom: 1px solid #eef2f6;
    }

    td:nth-child(2) {
      text-align: right;
      font-weight: 700;
    }

    tr:last-child td {
      border-bottom: none;
    }
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseFooterButton = styled.button`
  min-height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #c8d9ea;
  background: ${TOKENS.accentSoft};
  color: ${TOKENS.accent};
  font-weight: 600;
  cursor: pointer;
`;
