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
import moment from "moment";
import { MAX_LENGTH } from "../../utils/constants";

const { ALL, PAID, UNPAID } = KEYS_FILTERS;

export const Services = () => {
  const [selectedFilter, setSelectedFilter] = useState(ALL);
  const [serviceInfoEdit, setServiceInfoEdit] = useState({});
  const [showInformative, setShowInformative] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showServiceModalEdit, setShowServiceModalEdit] = useState(false);
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [deletedServiceId, setDeletedServiceId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dateFilter, setDateFilter] = useState(moment().format("YYYY-MM-DD"));

  const variablesQuery = {
    date: dateFilter,
    withPagination: false,
  };

  const { handleDeleteService, paginatedData, observeIntersection } =
    useServices({
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
          <TextPaid $status={status}>
            {status ? "Pagado" : "No pagado"}
          </TextPaid>
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
    if (!paginatedData?.length) return [];

    const servicesInformation = paginatedData.map((serviceInfo) => ({
      ...serviceInfo,
      status: Number(serviceInfo.total_pending) === 0,
    }));

    return filterAndSearchServices({
      services: servicesInformation,
      selectedFilter,
      search,
      paidValue: PAID,
      unpaidValue: UNPAID,
    });
  }, [paginatedData, selectedFilter, search]);

  return (
    <Container>
      <TopContainer>
        <DateInput
          type="date"
          value={dateFilter}
          onChange={({ target: { value } }) => setDateFilter(value)}
        />
      </TopContainer>

      <MiddleContainer>
        <FilterGroup>
          {SERVICE_FILTERS.map(({ key, label }) => (
            <FilterLabel key={key}>
              <input
                type="radio"
                name="service-filter"
                checked={selectedFilter === label}
                onChange={() => setSelectedFilter(label)}
              />
              {label}
            </FilterLabel>
          ))}
        </FilterGroup>

        <SearchInput
          type="text"
          placeholder="Buscar servicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </MiddleContainer>

      <HeaderTable>
        <Title>Mis servicios</Title>
        <CreateButton
          onClick={() => {
            setServiceInfoEdit({});
            setShowServiceModal(true);
          }}
        >
          + Crear servicio
        </CreateButton>
      </HeaderTable>

      <BottomContainer>
        <TableService
          columns={columnsFormatted}
          data={servicesFormatted}
          observeIntersection={observeIntersection}
        />
      </BottomContainer>

      {showInformative && (
        <InformativeModal
          title="Descripcion"
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

      {showDeleteModal && (
        <DeleteModal
          title="Eliminar servicio"
          content="¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer."
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

const MiddleContainer = styled.div`
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #4f46e5;
  cursor: pointer;

  input {
    accent-color: #6366f1;
    width: 16px;
    height: 16px;
  }
`;

const SearchInput = styled.input`
  width: 320px;
  padding: 14px 18px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 15px;
  color: #111827;
  outline: none;
  transition: all 0.25s ease;

  &:focus {
    background: #ffffff;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 500;
  }
`;

const HeaderTable = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.3px;
`;

const CreateButton = styled.button`
  padding: 10px 18px;
  border-radius: 12px;
  border: none;
  background: #6366f1;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #4f46e5;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
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

const BottomContainer = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;
