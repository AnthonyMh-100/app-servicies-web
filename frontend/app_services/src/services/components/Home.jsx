import React, { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useQuery } from "@apollo/client/react";
import { EARNINGS } from "../../graphql/queries";
import { formatterCurrency } from "../../utils/utils";

export const Home = ({ dateFilter, setDateFilter }) => {
  const {
    data: earningsData,
    loading,
    error,
  } = useQuery(EARNINGS, {
    variables: { date: dateFilter },
  });

  const earnings = useMemo(() => {
    return (
      earningsData?.earnings || {
        totalPaid: 0,
        totalPending: 0,
        totalServices: 0,
      }
    );
  }, [earningsData]);

  return (
    <Container>
      <TopSection>
        <Header>
          <Title>Dashboard</Title>
          <DateInputWrapper>
            <Label>Fecha:</Label>
            <DateInput
              type="date"
              value={dateFilter}
              onChange={({ target: { value } }) => setDateFilter(value)}
            />
          </DateInputWrapper>
        </Header>
      </TopSection>

      <CardsContainer>
        <Card $gradient="linear-gradient(135deg, #6366f1 0%, #a885f8 100%)">
          <CardIcon>
            <PaidIcon />
          </CardIcon>
          <CardContent>
            <CardLabel>Total Pagado</CardLabel>
            <CardValue>
              {loading ? "..." : formatterCurrency.format(earnings.totalPaid)}
            </CardValue>
          </CardContent>
        </Card>

        <Card $gradient="linear-gradient(135deg, #f97316 0%, #fb923c 100%)">
          <CardIcon>
            <PendingIcon />
          </CardIcon>
          <CardContent>
            <CardLabel>Total Pendiente</CardLabel>
            <CardValue>
              {loading
                ? "..."
                : formatterCurrency.format(earnings.totalPending)}
            </CardValue>
          </CardContent>
        </Card>

        <Card $gradient="linear-gradient(135deg, #10b981 0%, #34d399 100%)">
          <CardIcon>
            <TotalIcon />
          </CardIcon>
          <CardContent>
            <CardLabel>Total Servicios</CardLabel>
            <CardValue>
              {loading
                ? "..."
                : formatterCurrency.format(earnings.totalServices)}
            </CardValue>
          </CardContent>
        </Card>
      </CardsContainer>

      {error && <ErrorMessage>Error al cargar los datos</ErrorMessage>}
    </Container>
  );
};

const PaidIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8M12 8v8" />
  </svg>
);

const PendingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const TotalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
  </svg>
);

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  width: 100%;
  min-height: 600px;
  padding: 32px;
  background: #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 32px;
  animation: ${fadeIn} 0.6s ease;
`;

const TopSection = styled.div`
  background: #ffffff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.5px;
  margin: 0;
`;

const DateInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #4f46e5;
`;

const DateInput = styled.input`
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 14px;
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

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  width: 100%;
`;

const Card = styled.div`
  background: ${(props) => props.$gradient};
  padding: 28px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
`;

const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;

  svg {
    width: 32px;
    height: 32px;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const CardLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardValue = styled.p`
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.5px;
`;

const ErrorMessage = styled.div`
  padding: 16px 20px;
  background: #fee2e2;
  border-left: 4px solid #dc2626;
  border-radius: 8px;
  color: #991b1b;
  font-size: 14px;
  font-weight: 600;
`;
