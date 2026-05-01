import React, { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useQuery } from "@apollo/client/react";
import { SERVICE_HISTORY } from "../../graphql/queries";
import { formatterCurrency, maxLength } from "../../utils/utils";
import { MAX_LENGTH, DEFAULT_PAGE_SIZE } from "../../utils/constants";
import { InformativeModal } from "../../components";
import { usePagedLoad } from "../hooks/usePagedLoad";

const TOKENS = {
  surface: "#ffffff",
  border: "#dce2e9",
  textStrong: "#0f1724",
  textSoft: "#60758f",
  accent: "#0f4c81",
  accentSoft: "#e5eef7",
  success: "#127a56",
  successSoft: "#e8f7f1",
  warning: "#9a5a17",
  warningSoft: "#fdf1e4",
};

const FILTERS = {
  ALL: "Todo",
  PAID: "Pagado",
  UNPAID: "No pagado",
};

const formatGroupLabel = (value) => {
  if (!value) return "Sin fecha";
  const now = new Date();
  const target = new Date(`${value}T00:00:00`);
  if (Number.isNaN(target.getTime())) return value;

  const dayMs = 24 * 60 * 60 * 1000;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const compare = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diff = Math.round((today - compare) / dayMs);

  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";
  if (diff <= 7 && diff > 1) return "Esta semana";

  return target.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeEventType = (service) => {
  if (service.isCompleted) return "Pago completo";
  if ((service.payments || []).length > 0) return "Pago parcial";
  return "Creación";
};

export const History = ({ dateFilter, setDateFilter }) => {
  const [expandedHistoryIds, setExpandedHistoryIds] = useState(new Set());
  const [showInformative, setShowInformative] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(FILTERS.ALL);
  const [search, setSearch] = useState("");

  const {
    data: historyData,
    loading: historyLoading,
    error: historyError,
  } = useQuery(SERVICE_HISTORY, {
    variables: { date: dateFilter },
    skip: !dateFilter,
    fetchPolicy: "cache-and-network",
  });

  const historyServices = useMemo(() => {
    return historyData?.serviceHistory || [];
  }, [historyData]);

  const filteredHistory = useMemo(() => {
    const term = search.trim().toLowerCase();

    return historyServices.filter((service) => {
      const isPaid = Boolean(service.isCompleted);
      const passesFilter =
        selectedFilter === FILTERS.ALL ||
        (selectedFilter === FILTERS.PAID && isPaid) ||
        (selectedFilter === FILTERS.UNPAID && !isPaid);

      if (!passesFilter) return false;
      if (!term) return true;

      return [service.name, service.description, service.delivery_date]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [historyServices, selectedFilter, search]);

  const { paginatedData: pagedHistoryServices, observeIntersection } =
    usePagedLoad({
      data: filteredHistory,
      pageSize: DEFAULT_PAGE_SIZE,
    });

  const groupedEvents = useMemo(() => {
    return pagedHistoryServices.reduce((acc, service) => {
      const dateKey = service.createdDate || service.delivery_date || "Sin fecha";
      const group = formatGroupLabel(dateKey);
      if (!acc[group]) acc[group] = [];
      acc[group].push(service);
      return acc;
    }, {});
  }, [pagedHistoryServices]);

  const toggleHistoryRow = (serviceId) => {
    setExpandedHistoryIds((currentIds) => {
      const updatedIds = new Set(currentIds);
      updatedIds.has(serviceId)
        ? updatedIds.delete(serviceId)
        : updatedIds.add(serviceId);
      return updatedIds;
    });
  };

  return (
    <Container>
      <HeaderPanel>
        <TopRow>
          <div>
            <Title>Historial</Title>
            <Subtitle>Actividad de servicios, pagos y estados por fecha.</Subtitle>
          </div>
          <DateField>
            <Label htmlFor="history-date">Fecha de análisis</Label>
            <DateInput
              id="history-date"
              type="date"
              value={dateFilter}
              onChange={({ target: { value } }) => setDateFilter(value)}
            />
          </DateField>
        </TopRow>

        <ControlsRow>
          <PillsRow>
            {Object.values(FILTERS).map((filter) => (
              <FilterPill
                key={filter}
                type="button"
                $active={selectedFilter === filter}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </FilterPill>
            ))}
          </PillsRow>

          <SearchField>
            <SearchIcon viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.6-3.6" />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Buscar por servicio o descripción"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchField>
        </ControlsRow>
      </HeaderPanel>

      <FeedPanel>
        <FeedHeader>
          <FeedTitle>Eventos registrados</FeedTitle>
          <FeedMeta>
            {historyLoading ? "Cargando..." : `${filteredHistory.length} resultados`}
          </FeedMeta>
        </FeedHeader>

        {historyLoading && (
          <SkeletonList>
            {[1, 2, 3].map((item) => (
              <SkeletonItem key={item} />
            ))}
          </SkeletonList>
        )}

        {!historyLoading && !Object.keys(groupedEvents).length && !historyError && (
          <EmptyState>
            <EmptyTitle>No hay actividad aún</EmptyTitle>
            <EmptyText>Prueba cambiando filtros o creando nuevos movimientos.</EmptyText>
          </EmptyState>
        )}

        {!historyLoading &&
          Object.entries(groupedEvents).map(([groupLabel, events]) => (
            <Group key={groupLabel}>
              <GroupTitle>{groupLabel}</GroupTitle>

              {events.map((service, index) => {
                const isExpanded = expandedHistoryIds.has(service.id);
                const payments = service.payments || [];
                const isLastGroupItem = index === events.length - 1;

                return (
                  <HistoryItem
                    key={`history-${service.id}`}
                    ref={isLastGroupItem ? observeIntersection : null}
                  >
                    <ItemTop>
                      <LeftBlock>
                        <EventIcon $paid={Boolean(service.isCompleted)}>
                          {service.isCompleted ? "✓" : "●"}
                        </EventIcon>
                        <div>
                          <ServiceName>{service.name}</ServiceName>
                          <Secondary>
                            {maxLength({
                              text: service.description,
                              length: MAX_LENGTH,
                            })}
                          </Secondary>
                        </div>
                      </LeftBlock>

                      <RightBlock>
                        <TypeBadge $paid={Boolean(service.isCompleted)}>
                          {normalizeEventType(service)}
                        </TypeBadge>
                        <Amount>{formatterCurrency.format(service.total)}</Amount>
                      </RightBlock>
                    </ItemTop>

                    <MetaRow>
                      <MetaText>Entrega: {service.delivery_date || "-"}</MetaText>
                      <MetaText>
                        Estado: {service.isCompleted ? "Pagado" : "No pagado"}
                      </MetaText>
                      <Actions>
                        <GhostButton
                          type="button"
                          onClick={() => {
                            setShowInformative(true);
                            setDescription(service.description || "-");
                          }}
                        >
                          Ver descripción
                        </GhostButton>
                        <GhostButton
                          type="button"
                          onClick={() => toggleHistoryRow(service.id)}
                        >
                          {isExpanded ? "Ocultar pagos" : "Ver pagos"}
                        </GhostButton>
                      </Actions>
                    </MetaRow>

                    {isExpanded && (
                      <ExpandedArea>
                        {!payments.length && (
                          <InlineNote>No hay pagos asociados a este servicio.</InlineNote>
                        )}

                        {!!payments.length && (
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
                                  <td>{formatterCurrency.format(payment.amount)}</td>
                                  <td>{payment.note || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </PaymentsTable>
                        )}
                      </ExpandedArea>
                    )}
                  </HistoryItem>
                );
              })}
            </Group>
          ))}

        {historyError && (
          <ErrorMessage>No se pudo cargar el historial para esta fecha.</ErrorMessage>
        )}
      </FeedPanel>

      {showInformative && (
        <InformativeModal
          title="Descripción"
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
  gap: 14px;
  animation: ${fadeIn} 0.35s ease;

  @media (max-width: 900px) {
    padding: 6px;
  }
`;

const HeaderPanel = styled.section`
  background: ${TOKENS.surface};
  border: 1px solid ${TOKENS.border};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 26px;
  color: ${TOKENS.textStrong};
  letter-spacing: -0.03em;
`;

const Subtitle = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: ${TOKENS.textSoft};
`;

const DateField = styled.div`
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
  min-height: 40px;
  border-radius: 10px;
  border: 1px solid ${TOKENS.border};
  padding: 8px 12px;

  &:focus {
    outline: none;
    border-color: ${TOKENS.accent};
    box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.13);
  }
`;

const ControlsRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const PillsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterPill = styled.button`
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${(props) => (props.$active ? "#c9dceb" : TOKENS.border)};
  background: ${(props) => (props.$active ? TOKENS.accentSoft : "#fff")};
  color: ${(props) => (props.$active ? TOKENS.accent : TOKENS.textSoft)};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;

const SearchField = styled.div`
  min-height: 40px;
  border: 1px solid ${TOKENS.border};
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;

  &:focus-within {
    border-color: ${TOKENS.accent};
    box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.13);
  }
`;

const SearchIcon = styled.svg`
  width: 16px;
  height: 16px;
  stroke: #7389a3;
  stroke-width: 2;
  fill: none;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  background: transparent;
  color: ${TOKENS.textStrong};
  font-size: 14px;
`;

const FeedPanel = styled.section`
  background: ${TOKENS.surface};
  border: 1px solid ${TOKENS.border};
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FeedTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: ${TOKENS.textStrong};
`;

const FeedMeta = styled.span`
  font-size: 12px;
  color: ${TOKENS.textSoft};
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GroupTitle = styled.h4`
  margin: 6px 0 0;
  font-size: 12px;
  color: ${TOKENS.textSoft};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const HistoryItem = styled.article`
  border: 1px solid #e6ebf1;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:hover {
    border-color: #cad8e6;
    background: #fbfdff;
  }
`;

const ItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`;

const LeftBlock = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
`;

const EventIcon = styled.span`
  margin-top: 2px;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  color: ${({ $paid }) => ($paid ? TOKENS.success : TOKENS.warning)};
  background: ${({ $paid }) => ($paid ? TOKENS.successSoft : TOKENS.warningSoft)};
`;

const ServiceName = styled.h5`
  margin: 0;
  font-size: 14px;
  color: ${TOKENS.textStrong};
`;

const Secondary = styled.p`
  margin: 4px 0 0;
  font-size: 12px;
  color: ${TOKENS.textSoft};
`;

const RightBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const TypeBadge = styled.span`
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ $paid }) => ($paid ? TOKENS.success : TOKENS.warning)};
  background: ${({ $paid }) => ($paid ? TOKENS.successSoft : TOKENS.warningSoft)};
`;

const Amount = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${TOKENS.textStrong};
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`;

const MetaText = styled.span`
  font-size: 12px;
  color: ${TOKENS.textSoft};
`;

const Actions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
`;

const GhostButton = styled.button`
  border: 1px solid #dce2e9;
  background: #fff;
  border-radius: 999px;
  min-height: 30px;
  padding: 0 10px;
  font-size: 12px;
  color: ${TOKENS.textSoft};
  cursor: pointer;

  &:hover {
    color: ${TOKENS.accent};
    border-color: #c8d9ea;
    background: #f7fbff;
  }
`;

const ExpandedArea = styled.div`
  border-top: 1px solid #eef2f6;
  padding-top: 10px;
`;

const InlineNote = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${TOKENS.textSoft};
`;

const PaymentsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    text-align: left;
    padding: 8px 0;
    font-size: 12px;
    color: ${TOKENS.textStrong};
    border-bottom: 1px solid #eef2f6;
  }

  th {
    font-size: 11px;
    color: ${TOKENS.textSoft};
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const SkeletonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonItem = styled.div`
  height: 72px;
  border-radius: 12px;
  border: 1px solid #e9edf2;
  background: linear-gradient(90deg, #f7f9fb, #eef2f6, #f7f9fb);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const EmptyState = styled.div`
  border: 1px dashed #dce2e9;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
`;

const EmptyTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  color: ${TOKENS.textStrong};
`;

const EmptyText = styled.p`
  margin: 8px 0 0;
  font-size: 13px;
  color: ${TOKENS.textSoft};
`;

const ErrorMessage = styled.div`
  padding: 10px 12px;
  border-radius: 10px;
  background: #fef2f2;
  color: #b42318;
  font-size: 13px;
`;
