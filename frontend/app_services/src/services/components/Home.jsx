import React, { useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { useQuery } from "@apollo/client/react";
import { EARNINGS, SERVICE_HISTORY } from "../../graphql/queries";
import { formatterCurrency } from "../../utils/utils";

const TOKENS = {
  bg: "#eef1f5",
  surface: "#ffffff",
  border: "#dce2e9",
  textStrong: "#0f1724",
  textSoft: "#60758f",
  accent: "#0f4c81",
  accentSoft: "#e5eef7",
  success: "#127a56",
  warning: "#9a5a17",
};

export const Home = ({ dateFilter, setDateFilter }) => {
  const {
    data: earningsData,
    loading: earningsLoading,
    error,
  } = useQuery(EARNINGS, {
    variables: { date: dateFilter },
  });

  const { data: historyData } = useQuery(SERVICE_HISTORY, {
    variables: { date: dateFilter },
    skip: !dateFilter,
    fetchPolicy: "cache-and-network",
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

  const paidRatio = useMemo(() => {
    const denominator = earnings.totalPaid + earnings.totalPending;
    if (!denominator) return 0;
    return Math.round((earnings.totalPaid / denominator) * 100);
  }, [earnings]);

  const pendingRatio = 100 - paidRatio;

  const recentItems = useMemo(() => {
    const services = historyData?.serviceHistory || [];
    return services.slice(0, 5);
  }, [historyData]);

  const metrics = [
    {
      key: "paid",
      label: "Total pagado",
      value: earningsLoading ? "..." : formatterCurrency.format(earnings.totalPaid),
      tone: "success",
      badge: `${paidRatio}% del total`,
      icon: <PaidIcon />,
    },
    {
      key: "pending",
      label: "Total pendiente",
      value: earningsLoading
        ? "..."
        : formatterCurrency.format(earnings.totalPending),
      tone: "warning",
      badge: `${pendingRatio}% pendiente`,
      icon: <PendingIcon />,
    },
    {
      key: "services",
      label: "Servicios del periodo",
      value: earningsLoading ? "..." : `${earnings.totalServices}`,
      tone: "neutral",
      badge: "Corte por fecha",
      icon: <ServicesIcon />,
    },
  ];

  return (
    <Container>
      <HeaderCard>
        <HeaderTop>
          <div>
            <Title>Dashboard</Title>
            <Subtitle>Vista consolidada de cobros, pendientes y actividad.</Subtitle>
          </div>
          <DateControls>
            <Label htmlFor="dashboard-date">Fecha de analisis</Label>
            <DateInput
              id="dashboard-date"
              type="date"
              value={dateFilter}
              onChange={({ target: { value } }) => setDateFilter(value)}
            />
          </DateControls>
        </HeaderTop>
      </HeaderCard>

      <MetricGrid>
        {metrics.map((metric) => (
          <MetricCard key={metric.key}>
            <MetricHeader>
              <MetricIcon $tone={metric.tone}>{metric.icon}</MetricIcon>
              <MetricBadge $tone={metric.tone}>{metric.badge}</MetricBadge>
            </MetricHeader>
            <MetricLabel>{metric.label}</MetricLabel>
            <MetricValue>{metric.value}</MetricValue>
          </MetricCard>
        ))}
      </MetricGrid>

      <BottomGrid>
        <Panel>
          <PanelTitle>Estado financiero</PanelTitle>
          <PanelSubtitle>Distribucion de ingresos segun la fecha seleccionada.</PanelSubtitle>

          <BarGroup>
            <BarRow>
              <BarLabel>Pagado</BarLabel>
              <BarValue>{paidRatio}%</BarValue>
            </BarRow>
            <ProgressTrack>
              <ProgressFill $type="success" style={{ width: `${paidRatio}%` }} />
            </ProgressTrack>
          </BarGroup>

          <BarGroup>
            <BarRow>
              <BarLabel>Pendiente</BarLabel>
              <BarValue>{pendingRatio}%</BarValue>
            </BarRow>
            <ProgressTrack>
              <ProgressFill $type="warning" style={{ width: `${pendingRatio}%` }} />
            </ProgressTrack>
          </BarGroup>

          <SummaryGrid>
            <SummaryCard>
              <SummaryLabel>Ingreso total</SummaryLabel>
              <SummaryValue>
                {formatterCurrency.format(earnings.totalPaid + earnings.totalPending)}
              </SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel>Ticket promedio</SummaryLabel>
              <SummaryValue>
                {earnings.totalServices
                  ? formatterCurrency.format(
                      (earnings.totalPaid + earnings.totalPending) /
                        earnings.totalServices,
                    )
                  : formatterCurrency.format(0)}
              </SummaryValue>
            </SummaryCard>
          </SummaryGrid>
        </Panel>

        <Panel>
          <PanelTitle>Actividad reciente</PanelTitle>
          <PanelSubtitle>Ultimos registros visibles en el historial.</PanelSubtitle>

          <ActivityList>
            {!recentItems.length && (
              <EmptyMessage>No hay actividad para la fecha seleccionada.</EmptyMessage>
            )}

            {recentItems.map((service) => (
              <ActivityItem key={service.id}>
                <ActivityTitle>{service.name}</ActivityTitle>
                <ActivityMeta>
                  <span>Entrega: {service.delivery_date}</span>
                  <span>
                    {service.isCompleted ? "Completado" : "Pendiente"}
                  </span>
                </ActivityMeta>
                <ActivityAmount>
                  {formatterCurrency.format(service.total || 0)}
                </ActivityAmount>
              </ActivityItem>
            ))}
          </ActivityList>
        </Panel>
      </BottomGrid>

      {error && <ErrorMessage>Error al cargar los datos del dashboard.</ErrorMessage>}
    </Container>
  );
};

const PaidIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}>
    <path d="M12 2v20" />
    <path d="M17 6.5a4.5 4.5 0 0 0-3.9-2.2h-2.2a3.9 3.9 0 0 0 0 7.8h2.2a3.9 3.9 0 0 1 0 7.8h-2.2A4.5 4.5 0 0 1 7 17.7" />
  </svg>
);

const PendingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.2 1.9" />
  </svg>
);

const ServicesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M7.5 9h9M7.5 13h9M7.5 17h5" />
  </svg>
);

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  width: 100%;
  min-height: 600px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${fadeIn} 0.35s ease;

  @media (max-width: 900px) {
    padding: 6px;
    gap: 12px;
  }
`;

const HeaderCard = styled.section`
  background: ${TOKENS.surface};
  border: 1px solid ${TOKENS.border};
  border-radius: 16px;
  padding: 20px;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 860px) {
    flex-direction: column;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: ${TOKENS.textStrong};
  font-size: 28px;
  line-height: 1.04;
  letter-spacing: -0.03em;
`;

const Subtitle = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  color: ${TOKENS.textSoft};
`;

const DateControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${TOKENS.textSoft};
`;

const DateInput = styled.input`
  min-width: 210px;
  min-height: 40px;
  border-radius: 10px;
  border: 1px solid ${TOKENS.border};
  padding: 8px 12px;
  color: ${TOKENS.textStrong};
  background: #fff;

  &:focus {
    outline: none;
    border-color: ${TOKENS.accent};
    box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.15);
  }
`;

const MetricGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.article`
  background: ${TOKENS.surface};
  border: 1px solid ${TOKENS.border};
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: #c5d4e4;
  }
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const MetricIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: ${(props) => {
    if (props.$tone === "success") return TOKENS.success;
    if (props.$tone === "warning") return TOKENS.warning;
    return TOKENS.accent;
  }};
  background: ${(props) => {
    if (props.$tone === "success") return "#e7f7f1";
    if (props.$tone === "warning") return "#fdf1e4";
    return TOKENS.accentSoft;
  }};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MetricBadge = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 600;
  color: ${(props) => {
    if (props.$tone === "success") return TOKENS.success;
    if (props.$tone === "warning") return TOKENS.warning;
    return TOKENS.accent;
  }};
  background: ${(props) => {
    if (props.$tone === "success") return "#e7f7f1";
    if (props.$tone === "warning") return "#fdf1e4";
    return TOKENS.accentSoft;
  }};
`;

const MetricLabel = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${TOKENS.textSoft};
  font-weight: 600;
`;

const MetricValue = styled.p`
  margin: 0;
  font-size: 24px;
  color: ${TOKENS.textStrong};
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const BottomGrid = styled.section`
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 12px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.article`
  background: ${TOKENS.surface};
  border: 1px solid ${TOKENS.border};
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: ${TOKENS.textStrong};
`;

const PanelSubtitle = styled.p`
  margin: -6px 0 0;
  font-size: 13px;
  color: ${TOKENS.textSoft};
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BarRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BarLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${TOKENS.textSoft};
`;

const BarValue = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${TOKENS.textStrong};
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 99px;
  background: #edf2f7;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 99px;
  background: ${(props) =>
    props.$type === "success" ? TOKENS.success : TOKENS.warning};
  transition: width 0.25s ease;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  border: 1px solid ${TOKENS.border};
  border-radius: 12px;
  padding: 12px;
  background: #fafcfe;
`;

const SummaryLabel = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${TOKENS.textSoft};
  font-weight: 600;
`;

const SummaryValue = styled.p`
  margin: 6px 0 0;
  font-size: 18px;
  color: ${TOKENS.textStrong};
  font-weight: 700;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ActivityItem = styled.div`
  border: 1px solid ${TOKENS.border};
  border-radius: 12px;
  background: #fbfcfd;
  padding: 12px;
`;

const ActivityTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  color: ${TOKENS.textStrong};
`;

const ActivityMeta = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: ${TOKENS.textSoft};
`;

const ActivityAmount = styled.p`
  margin: 8px 0 0;
  color: ${TOKENS.accent};
  font-size: 14px;
  font-weight: 700;
`;

const EmptyMessage = styled.p`
  margin: 0;
  padding: 12px;
  border: 1px dashed ${TOKENS.border};
  border-radius: 12px;
  font-size: 13px;
  color: ${TOKENS.textSoft};
`;

const ErrorMessage = styled.div`
  padding: 12px 14px;
  border: 1px solid #f2c8c5;
  background: #fef2f2;
  border-radius: 10px;
  color: #8e2d2d;
  font-size: 13px;
  font-weight: 600;
`;
