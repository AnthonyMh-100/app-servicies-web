import React, { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useQuery } from "@apollo/client/react";
import { SERVICE_HISTORY } from "../../graphql/queries";
import { formatterCurrency, maxLength } from "../../utils/utils";
import { MAX_LENGTH } from "../../utils/constants";
import { InformativeModal } from "../../components";

export const History = ({ dateFilter, setDateFilter }) => {
  const [expandedHistoryIds, setExpandedHistoryIds] = useState(new Set());
  const [showInformative, setShowInformative] = useState(false);
  const [description, setDescription] = useState("");

  const { data: historyData, loading: historyLoading } = useQuery(
    SERVICE_HISTORY,
    {
      variables: { date: dateFilter },
      skip: !dateFilter,
      fetchPolicy: "cache-and-network",
    },
  );

  const historyServices = useMemo(() => {
    return historyData?.serviceHistory || [];
  }, [historyData]);

  const toggleHistoryRow = (serviceId) => {
    setExpandedHistoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) {
        next.delete(serviceId);
      } else {
        next.add(serviceId);
      }
      return next;
    });
  };

  return (
    <Container>
      <TopContainer>
        <DateInputWrapper>
          <Label>Fecha:</Label>
          <DateInput
            type="date"
            value={dateFilter}
            onChange={({ target: { value } }) => setDateFilter(value)}
          />
        </DateInputWrapper>
      </TopContainer>

      <HistorySection>
        <HistoryHeader>
          <Title>History</Title>
          <HistorySubtitle>
            {historyLoading ? "Cargando historial..." : "Pagos por fecha"}
          </HistorySubtitle>
        </HistoryHeader>

        <HistoryTableWrapper>
          <HistoryTable>
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Descripcion</th>
                <th>Entrega</th>
                <th>Total</th>
                <th>Pagado</th>
                <th>Pendiente</th>
                <th>Estado</th>
                <th>Pagos</th>
              </tr>
            </thead>
            <tbody>
              {!historyServices.length && !historyLoading && (
                <tr>
                  <td colSpan={8}>
                    <EmptyState>No hay historial para esta fecha.</EmptyState>
                  </td>
                </tr>
              )}

              {historyServices.map((service) => {
                const isExpanded = expandedHistoryIds.has(service.id);
                const payments = service.payments || [];

                return (
                  <React.Fragment key={`history-${service.id}`}>
                    <tr>
                      <td>{service.name}</td>
                      <td>
                        <TextDescription
                          $isMaxlength={service.description.length > MAX_LENGTH}
                          onClick={() => {
                            setShowInformative(true);
                            setDescription(service.description);
                          }}
                        >
                          {maxLength({
                            text: service.description,
                            length: MAX_LENGTH,
                          })}
                        </TextDescription>
                      </td>
                      <td>{service.delivery_date}</td>
                      <td>{formatterCurrency.format(service.total)}</td>
                      <td>{formatterCurrency.format(service.total_advance)}</td>
                      <td>{formatterCurrency.format(service.total_pending)}</td>
                      <td>
                        <TextPaid $status={Boolean(service.isCompleted)}>
                          {service.isCompleted ? "Pagado" : "No pagado"}
                        </TextPaid>
                      </td>
                      <td>
                        <ToggleButton
                          type="button"
                          $active={isExpanded}
                          onClick={() => toggleHistoryRow(service.id)}
                        >
                          {isExpanded ? "Ocultar" : "Ver pagos"}
                        </ToggleButton>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={8}>
                          <PaymentsWrapper>
                            {payments.length ? (
                              <PaymentsTable>
                                <thead>
                                  <tr>
                                    <th>Fecha</th>
                                    <th>Monto</th>
                                    <th>Nota</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {payments.map((payment) => (
                                    <tr key={`payment-${payment.id}`}>
                                      <td>{payment.paidDate}</td>
                                      <td>
                                        {formatterCurrency.format(
                                          payment.amount,
                                        )}
                                      </td>
                                      <td>{payment.note || "-"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </PaymentsTable>
                            ) : (
                              <EmptyPayments>
                                Este servicio no tiene pagos en esta fecha.
                              </EmptyPayments>
                            )}
                          </PaymentsWrapper>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </HistoryTable>
        </HistoryTableWrapper>
      </HistorySection>

      {showInformative && (
        <InformativeModal
          title="Descripcion"
          description={description}
          onClose={() => setShowInformative(false)}
        />
      )}
    </Container>
  );
};

export default History;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Container = styled.div`
  width: 100%;
  min-height: 600px;
  padding: 32px;
  background: #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${fadeIn} 0.6s ease;
`;

const TopContainer = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 20px;
  display: flex;
  justify-content: flex-start;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const DateInput = styled.input`
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  outline: none;
  transition: all 0.25s ease;
  cursor: pointer;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

const DateInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #4f46e5;
`;

const HistorySection = styled.section`
  background: #ffffff;
  padding: 24px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.3px;
`;

const HistorySubtitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  background: #f3f4f6;
  padding: 6px 12px;
  border-radius: 999px;
`;

const HistoryTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 14px;
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;

  thead {
    th {
      padding: 12px 18px;
      text-align: left;
      font-weight: 700;
      font-size: 12px;
      color: #111827;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
  }

  tbody {
    tr {
      transition: background 0.2s ease;
      &:hover {
        background: #f8fafc;
      }
    }

    td {
      padding: 14px 18px;
      font-size: 14px;
      color: #111827;
      border-bottom: 1px solid #eef2f7;
      vertical-align: top;
    }
  }
`;

const ToggleButton = styled.button`
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid ${({ $active }) => ($active ? "#111827" : "#e5e7eb")};
  background: ${({ $active }) => ($active ? "#111827" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#111827")};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const PaymentsWrapper = styled.div`
  padding: 12px 0;
`;

const PaymentsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    th {
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #6b7280;
      padding: 6px 0 10px;
    }
  }

  tbody td {
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
    font-size: 14px;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const EmptyState = styled.div`
  padding: 24px;
  font-size: 14px;
  color: #6b7280;
  text-align: center;
`;

const EmptyPayments = styled.div`
  font-size: 13px;
  color: #6b7280;
  padding: 10px 0;
`;

const TextDescription = styled.div`
  cursor: pointer;
  text-align: ${({ $isMaxlength }) => ($isMaxlength ? "left" : "center")};
  max-width: 200px;

  &:hover {
    color: #3c70be;
  }
`;

const TextPaid = styled.div`
  background: ${({ $status }) => ($status ? "#3e9922b5" : "#a32828bc")};
  color: #fff;
  border-radius: 20px;
  padding: 4px 20px;
  display: flex;
  justify-content: center;
  font-weight: 600;
`;
