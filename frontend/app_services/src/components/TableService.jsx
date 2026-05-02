import React from "react";
import styled from "styled-components";

const MOBILE_KEYS = {
  name: "Servicio",
  description: "Descripción",
  delivery_date: "Entrega",
  total: "Total",
  status: "Estado",
  actions: "Acciones",
};

export const TableService = ({ columns = [], data = [] }) => {
  if (!data?.length) {
    return (
      <EmptyStateWrapper>
        <EmptyStateTitle>Sin servicios para esta fecha</EmptyStateTitle>
        <EmptyStateText>
          Ajusta el filtro de fecha o crea un servicio nuevo para iniciar.
        </EmptyStateText>
      </EmptyStateWrapper>
    );
  }

  return (
    <Container>
      <DesktopTableWrapper>
        <Table>
          <thead>
            <tr>
              {columns?.map(({ key, label }) => (
                <th key={key}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              return (
                <tr key={row.id}>
                  {columns?.map(({ key, render }) => (
                    <td key={`${row.id}-${key}`}>
                      {render ? render(row) : row[key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </DesktopTableWrapper>

      <MobileCards>
        {data.map((row) => {
          return (
            <MobileCard key={`mobile-${row.id}`}>
              {columns
                .filter(({ key }) => key !== "id")
                .map(({ key, render }) => (
                  <MobileRow key={`${row.id}-mobile-${key}`}>
                    <MobileLabel>{MOBILE_KEYS[key] || key}</MobileLabel>
                    <MobileValue>{render ? render(row) : row[key]}</MobileValue>
                  </MobileRow>
                ))}
            </MobileCard>
          );
        })}
      </MobileCards>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const EmptyStateWrapper = styled.div`
  border: 1px dashed #dce2e9;
  border-radius: 14px;
  background: #fafcfe;
  padding: 28px 18px;
  text-align: center;
`;

const EmptyStateTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  color: #0f1724;
`;

const EmptyStateText = styled.p`
  margin: 8px 0 0;
  font-size: 13px;
  color: #60758f;
`;

const DesktopTableWrapper = styled.div`
  width: 100%;
  overflow: auto;
  border-radius: 14px;
  border: 1px solid #e6ebf1;

  @media (max-width: 860px) {
    display: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 920px;
  min-height: 500px;

  thead {
    background: #f7fafd;

    th {
      padding: 12px 14px;
      text-align: left;
      font-weight: 700;
      font-size: 11px;
      color: #60758f;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      border-bottom: 1px solid #e6ebf1;
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      transition: background-color 0.2s ease;

      &:hover {
        background: #f9fbfe;
      }
    }

    td {
      padding: 12px 14px;
      font-size: 13px;
      color: #0f1724;
      border-bottom: 1px solid #eef2f6;
      vertical-align: middle;
    }

    tr:last-child td {
      border-bottom: none;
    }
  }
`;

const MobileCards = styled.div`
  display: none;

  @media (max-width: 860px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const MobileCard = styled.article`
  border: 1px solid #e0e7ee;
  border-radius: 12px;
  background: #ffffff;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MobileRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const MobileLabel = styled.span`
  min-width: 86px;
  font-size: 11px;
  font-weight: 700;
  color: #60758f;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const MobileValue = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  color: #0f1724;
  font-size: 13px;
  text-align: right;
`;
