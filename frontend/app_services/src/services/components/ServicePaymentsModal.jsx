import React, { useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { formatterCurrency } from "../../utils/utils";
import { usePayments } from "../hooks/usePayments";

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
      methodFormatted: payment.method || "-",
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
                      <th>Método</th>
                      <th>Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td>{row.paidDateFormatted}</td>
                        <td>{row.amountFormatted}</td>
                        <td>{row.methodFormatted}</td>
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
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
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
  width: min(980px, 96vw);
  max-height: 88vh;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #fbfbff 100%);
  border: 1px solid rgba(229, 231, 235, 0.9);
  border-radius: 24px;
  padding: 22px 24px 20px;
  animation: ${fadeIn} 0.3s ease;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eef2f7;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 650;
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
  border-radius: 12px;
  padding: 6px 10px;

  &:hover {
    background: rgba(17, 24, 39, 0.06);
  }
`;

const Subheader = styled.div`
  display: grid;
  gap: 10px;
`;

const ServiceName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #4f46e5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media (max-width: 820px) {
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
  box-shadow: 0 1px 0 rgba(17, 24, 39, 0.04);
`;

const StatLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

const StatValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
`;

const InfoText = styled.div`
  font-size: 14px;
  color: #374151;
  padding: 10px 0;
`;

const ErrorText = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #dc2626;
  background: rgba(220, 38, 38, 0.08);
  padding: 10px 12px;
  border-radius: 12px;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow: auto;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  max-height: 56vh;
  background: rgba(249, 250, 251, 0.55);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(107, 114, 128, 0.35);
    border-radius: 999px;
    border: 2px solid rgba(249, 250, 251, 0.9);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(107, 114, 128, 0.5);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    position: sticky;
    top: 0;
    background: #eef2ff;
    z-index: 1;
    box-shadow: 0 1px 0 rgba(17, 24, 39, 0.06);

    th {
      padding: 12px 14px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      color: #4f46e5;
      white-space: nowrap;
    }

    th:nth-child(2) {
      text-align: right;
    }
  }

  tbody {
    tr:nth-child(even) {
      background: #f9fafb;
    }

    tr {
      transition: background 120ms ease;
    }

    tr:hover {
      background: rgba(238, 242, 255, 0.65);
    }

    td {
      padding: 12px 14px;
      font-size: 13px;
      color: #111827;
      text-align: left;
      border-bottom: 1px solid #eef2f7;
      white-space: nowrap;
    }

    td:nth-child(2) {
      text-align: right;
      font-weight: 700;
    }

    td:nth-child(4) {
      max-width: 420px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
  padding: 10px 18px;
  border-radius: 12px;
  border: none;
  background: #eef2ff;
  color: #4f46e5;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: rgba(99, 102, 241, 0.14);
  }
`;
