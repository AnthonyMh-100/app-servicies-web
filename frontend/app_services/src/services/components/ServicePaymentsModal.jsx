import React, { useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { formatterCurrency } from "../../utils/utils";
import { usePayments } from "../hooks/usePayments";

export const ServicePaymentsModal = ({ service, onClose }) => {
  const serviceId = service?.id || null;
  const { payments, paymentsLoading, paymentsError } = usePayments({
    serviceId,
    skipPayments: !serviceId,
  });

  const rows = useMemo(() => {
    if (!payments?.length) return [];
    return payments.map((payment) => ({
      ...payment,
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
          <CloseButton onClick={onClose}>x</CloseButton>
        </Header>

        <ServiceName>{service?.name || "-"}</ServiceName>

        {paymentsLoading && <InfoText>Cargando pagos...</InfoText>}
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

        {!paymentsLoading && !errorMessage && (
          <>
            {!rows.length ? (
              <InfoText>No hay pagos registrados.</InfoText>
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
                        <td>{row.paidDate}</td>
                        <td>{row.amountFormatted}</td>
                        <td>{row.methodFormatted}</td>
                        <td>{row.noteFormatted}</td>
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
`;

const Modal = styled.div`
  width: 860px;
  max-height: 80vh;
  overflow: hidden;
  background: #ffffff;
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
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  font-size: 26px;
  color: #6b7280;
  cursor: pointer;
`;

const ServiceName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #4f46e5;
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
  max-height: 52vh;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #eef2ff;

    th {
      padding: 12px 14px;
      text-align: center;
      font-weight: 700;
      font-size: 13px;
      color: #4f46e5;
      white-space: nowrap;
    }
  }

  tbody {
    tr:nth-child(even) {
      background: #f9fafb;
    }

    td {
      padding: 12px 14px;
      font-size: 13px;
      color: #111827;
      text-align: center;
      border-bottom: 1px solid #e5e7eb;
      white-space: nowrap;
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
  font-weight: 700;
  cursor: pointer;
`;
