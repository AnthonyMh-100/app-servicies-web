import React, { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useServices } from "../hooks/useServices";
import {
  ActionButtons,
  DeleteModal,
  TableService,
  InformativeModal,
} from "../../components";
import {
  COLUMNS_SERVICES,
  KEYS_FILTERS,
  SERVICE_FILTERS,
} from "../../Constants";
import {
  filterAndSearchServices,
  formatterCurrency,
  maxLength,
} from "../../utils/utils";
import { ServiceModal } from "./ServiceModal";
import { ServicePaymentModal } from "./ServicePaymentModal";
import { ServicePaymentsModal } from "./ServicePaymentsModal";
import { MAX_LENGTH } from "../../utils/constants";
import { usePagedLoad } from "../hooks/usePagedLoad";

const { ALL, PAID, UNPAID } = KEYS_FILTERS;

const TOKENS = {
  surface: "#ffffff",
  border: "#dce2e9",
  textStrong: "#0f1724",
  textSoft: "#60758f",
  accent: "#0f4c81",
  accentSoft: "#e5eef7",
  successBg: "#e8f7f1",
  successText: "#127a56",
  warningBg: "#fdf1e4",
  warningText: "#9a5a17",
};

export const Services = ({ dateFilter, setDateFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState(ALL);
  const [serviceInfoEdit, setServiceInfoEdit] = useState({});
  const [showInformative, setShowInformative] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showServiceModalEdit, setShowServiceModalEdit] = useState(false);
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [deletedServiceId, setDeletedServiceId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);

  const variablesQuery = {
    date: dateFilter,
    withPagination: false,
  };

  const { handleDeleteService, servicesData } = useServices({
    dateFilter,
    shouldFetchServices: true,
    setDeletedServiceId,
    setShowDeleteModal,
    variablesQuery,
  });

  const columnsFormatted = useMemo(() => {
    return COLUMNS_SERVICES.map((column) => ({
      ...column,
      ...(column.key === "actions" && {
        render: (row) => (
          <ActionButtons
            payDisabled={Boolean(row?.status)}
            onPay={() => {
              setSelectedService({ ...row });
              setShowPaymentModal(true);
            }}
            onViewPayments={() => {
              setSelectedService({ ...row });
              setShowPaymentsModal(true);
            }}
            onEdit={() => {
              setShowServiceModalEdit(true);
              setServiceInfoEdit({ ...row });
            }}
            onDelete={() => {
              setShowDeleteModal(true);
              setDeletedServiceId(row.id);
            }}
          />
        ),
      }),
      ...(column.key === "status" && {
        render: ({ status }) => (
          <StatusBadge $status={status}>{status ? "Pagado" : "No pagado"}</StatusBadge>
        ),
      }),
      ...(column.key === "description" && {
        render: ({ description: rowDescription }) => (
          <TextDescription
            $isMaxlength={rowDescription.length > MAX_LENGTH}
            onClick={() => {
              setShowInformative(true);
              setDescription(rowDescription);
            }}
          >
            {maxLength({ text: rowDescription, length: MAX_LENGTH })}
          </TextDescription>
        ),
      }),
      ...(column.key === "total_advance" && {
        render: ({ total_advance }) => formatterCurrency.format(total_advance),
      }),
      ...(column.key === "total_pending" && {
        render: ({ total_pending }) => formatterCurrency.format(total_pending),
      }),
      ...(column.key === "total" && {
        render: ({ total }) => formatterCurrency.format(total),
      }),
    }));
  }, []);

  const servicesFormatted = useMemo(() => {
    if (!servicesData?.length) return [];

    const servicesInformation = servicesData.map((serviceInfo) => ({
      ...serviceInfo,
      status: Boolean(serviceInfo.isCompleted),
    }));

    return filterAndSearchServices({
      services: servicesInformation,
      selectedFilter,
      search,
      paidValue: PAID,
      unpaidValue: UNPAID,
    });
  }, [servicesData, selectedFilter, search]);

  const {
    paginatedData: pagedServices,
    canGoNext,
    canGoPrev,
    currentPage,
    goToNextPage,
    goToPrevPage,
    loadedItemsCount,
    totalItemsCount,
    totalPages,
  } = usePagedLoad({
    data: servicesFormatted,
    pageSize: 6,
  });

  return (
    <Container>
      <HeaderPanel>
        <HeaderTop>
          <HeaderCopy>
            <Title>Servicios</Title>
            <Subtitle>Administra entregas, cobros y seguimiento operativo.</Subtitle>
          </HeaderCopy>

          <CreateButton
            onClick={() => {
              setServiceInfoEdit({});
              setShowServiceModal(true);
            }}
          >
            + Crear servicio
          </CreateButton>
        </HeaderTop>

        <ControlsRow>
          <DateField>
            <Label htmlFor="service-date">Fecha de análisis</Label>
            <DateInput
              id="service-date"
              type="date"
              value={dateFilter}
              onChange={({ target: { value } }) => setDateFilter(value)}
            />
          </DateField>

          <SearchField>
            <SearchIcon viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.6-3.6" />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Buscar por nombre o descripción"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchField>
        </ControlsRow>

        <PillsRow>
          {SERVICE_FILTERS.map(({ key, label }) => (
            <FilterPill
              key={key}
              $active={selectedFilter === label}
              onClick={() => setSelectedFilter(label)}
              type="button"
            >
              {label}
            </FilterPill>
          ))}
        </PillsRow>
      </HeaderPanel>

      <TablePanel>
        <TableHeader>
          <TableTitle>Listado de servicios</TableTitle>
          <TableCount>{servicesFormatted.length} resultados</TableCount>
        </TableHeader>

        <TableService
          columns={columnsFormatted}
          data={pagedServices}
        />
        {!!totalItemsCount && !!totalPages && (
          <PaginationRow>
            <PaginationMeta>
              Mostrando {loadedItemsCount} de {totalItemsCount}
            </PaginationMeta>

            <PaginationControls>
              <PageButton type="button" disabled={!canGoPrev} onClick={goToPrevPage}>
                Anterior
              </PageButton>

              <PageIndicator>
                Página {currentPage} de {totalPages}
              </PageIndicator>

              <PageButton type="button" disabled={!canGoNext} onClick={goToNextPage}>
                Siguiente
              </PageButton>
            </PaginationControls>
          </PaginationRow>
        )}
      </TablePanel>

      {showInformative && (
        <InformativeModal
          title="Descripción"
          description={description}
          onClose={() => setShowInformative(false)}
        />
      )}

      {(showServiceModal || showServiceModalEdit) && (
        <ServiceModal
          dateFilter={dateFilter}
          serviceInfoEdit={serviceInfoEdit}
          onClose={() => {
            setShowServiceModal(false);
            setShowServiceModalEdit(false);
            setServiceInfoEdit({});
          }}
          setShowServiceModal={setShowServiceModal}
        />
      )}

      {showPaymentModal && (
        <ServicePaymentModal
          service={selectedService}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedService(null);
          }}
          setShowPaymentModal={setShowPaymentModal}
        />
      )}

      {showPaymentsModal && (
        <ServicePaymentsModal
          service={selectedService}
          onClose={() => {
            setShowPaymentsModal(false);
            setSelectedService(null);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          title="Eliminar servicio"
          content="¿Estás seguro de eliminar este servicio? Esta acción no se puede deshacer."
          onConfirm={() => handleDeleteService(deletedServiceId)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </Container>
  );
};

export default Services;

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

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const HeaderCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 26px;
  letter-spacing: -0.03em;
  color: ${TOKENS.textStrong};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${TOKENS.textSoft};
`;

const CreateButton = styled.button`
  min-height: 42px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid ${TOKENS.accent};
  background: ${TOKENS.accent};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #0c3d69;
  }
`;

const ControlsRow = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 10px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
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
  color: ${TOKENS.textStrong};

  &:focus {
    outline: none;
    border-color: ${TOKENS.accent};
    box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.13);
  }
`;

const SearchField = styled.div`
  min-height: 40px;
  border: 1px solid ${TOKENS.border};
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  background: #fff;

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
  background: transparent;
  width: 100%;
  color: ${TOKENS.textStrong};
  font-size: 14px;

  &::placeholder {
    color: #8ca0b6;
  }
`;

const PillsRow = styled.div`
  display: flex;
  align-items: center;
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

  &:hover {
    border-color: #c9dceb;
    color: ${TOKENS.accent};
  }
`;

const TablePanel = styled.section`
  background: ${TOKENS.surface};
  border: 1px solid ${TOKENS.border};
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const TableTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: ${TOKENS.textStrong};
`;

const TableCount = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${TOKENS.textSoft};
  background: #f6f9fc;
  border: 1px solid #e6edf4;
  border-radius: 999px;
  padding: 4px 9px;
`;

const PaginationMeta = styled.span`
  font-size: 12px;
  color: ${TOKENS.textSoft};
`;

const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PageButton = styled.button`
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${TOKENS.border};
  background: #fff;
  color: ${TOKENS.textStrong};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: #c9dceb;
    color: ${TOKENS.accent};
    background: #f7fbff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

const PageIndicator = styled.span`
  font-size: 12px;
  color: ${TOKENS.textSoft};
`;

const TextDescription = styled.button`
  cursor: pointer;
  border: none;
  background: transparent;
  color: #324a63;
  text-align: left;
  max-width: 220px;
  padding: 0;
  text-decoration: ${({ $isMaxlength }) => ($isMaxlength ? "underline" : "none")};
  text-underline-offset: 3px;

  &:hover {
    color: ${TOKENS.accent};
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $status }) => ($status ? TOKENS.successText : TOKENS.warningText)};
  background: ${({ $status }) => ($status ? TOKENS.successBg : TOKENS.warningBg)};
`;
