import React, { useMemo } from "react";
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
        <PaidCard>
          <CardIcon>
            <PaidIcon />
          </CardIcon>
          <CardContent>
            <CardLabel>Total Pagado</CardLabel>
            <CardValue>
              {loading ? "..." : formatterCurrency.format(earnings.totalPaid)}
            </CardValue>
          </CardContent>
        </PaidCard>

        <PendingCard>
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
        </PendingCard>

        <TotalCard>
          <CardIcon>
            <TotalIcon />
          </CardIcon>
          <CardContent>
            <CardLabel>Total Servicios</CardLabel>
            <CardValue>{loading ? "..." : earnings.totalServices}</CardValue>
          </CardContent>
        </TotalCard>
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
  padding: 28px;

  display: flex;
  flex-direction: column;
  gap: 32px;
  animation: ${fadeIn} 0.6s ease;
`;

const TopSection = styled.div`
  background: #ffffff;
  padding: 22px 24px;
  border-radius: 22px;
  border: 1px solid rgba(229, 231, 235, 0.9);
  box-shadow: 0 12px 30px rgba(17, 24, 39, 0.06);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
  margin: 0;
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
  gap: 18px;
  width: 100%;
`;

const CardBase = styled.div`
  --accent: #4f46e5;
  --tint: rgba(79, 70, 229, 0.12);

  position: relative;
  padding: 28px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfbff 100%);
  border: 1px solid rgba(229, 231, 235, 0.9);
  box-shadow: 0 12px 28px rgba(17, 24, 39, 0.06);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 18px;
    background: radial-gradient(
      520px 160px at 22% 0%,
      var(--tint),
      transparent 60%
    );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 14px;
    bottom: 14px;
    width: 4px;
    border-radius: 999px;
    background: var(--accent);
    opacity: 0.9;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 42px rgba(17, 24, 39, 0.09);
  }
`;

const PaidCard = styled(CardBase)`
  --accent: #4f46e5;
  --tint: rgba(79, 70, 229, 0.12);
`;

const PendingCard = styled(CardBase)`
  --accent: #f97316;
  --tint: rgba(249, 115, 22, 0.12);
`;

const TotalCard = styled(CardBase)`
  --accent: #10b981;
  --tint: rgba(16, 185, 129, 0.12);
`;

const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(17, 24, 39, 0.03);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  flex-shrink: 0;
  border: 1px solid rgba(229, 231, 235, 0.9);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);

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
  color: #6b7280;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const CardValue = styled.p`
  font-size: 26px;
  font-weight: 750;
  color: #111827;
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
