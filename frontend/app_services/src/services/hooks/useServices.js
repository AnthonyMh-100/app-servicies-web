import {
  CREATE_COMPANY,
  CREATE_SERVICE,
  EDIT_SERVICE,
  DELETE_SERVICE,
  LOGIN_COMPANY,
} from "../../graphql/mutations";
import { SERVICES } from "../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router";
import { usePagedLoad } from "./usePagedLoad";
import { DEFAULT_PAGE_SIZE } from "../../utils/constants";
import { useAuthentication } from "../../context/AuthContext";
import { useState } from "react";

const sortServicesByIdDesc = (services = []) =>
  [...services].sort((a, b) => Number(b?.id || 0) - Number(a?.id || 0));

export const useServices = ({
  dateFilter = "",
  setServiceInfo = () => {},
  setShowServiceModal = () => {},
  onClose = () => {},
  shouldFetchServices = false,
  setDeletedServiceId = () => {},
  setShowDeleteModal = () => {},
  variablesQuery = {},
}) => {
  const navigate = useNavigate();
  const { setToken, setUser, setCompanyId } = useAuthentication();

  const [isError, setIsError] = useState(null);

  const {
    data: servicesData,
    loading: servicesLoading,
    error: servicesError,
  } = useQuery(SERVICES, {
    fetchPolicy: "cache-first",
    skip: !Object.keys(variablesQuery).length,
    variables: variablesQuery,
  });

  const { paginatedData, observeIntersection } = usePagedLoad({
    data: servicesData?.services || [],
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const [loginUser, { loading: userLoading, error: userError }] = useMutation(
    LOGIN_COMPANY,
    {
      onCompleted: ({ loginCompany }) => {
        const { token, ...userInfo } = loginCompany;
        const { id, name, username } = userInfo;

        localStorage.setItem("token", token);
        localStorage.setItem("companyId", id);

        setToken(token);
        setCompanyId(id);
        setUser({ id, name, username });

        navigate("/home", { replace: true });
      },
      onError: (error) => {
        console.error("Error de autenticación hook:", error);
        setIsError(error);
      },
    },
  );

  const [
    createUser,
    { loading: userRegisterLoading, error: userRegisterError },
  ] = useMutation(CREATE_COMPANY, {
    onCompleted: ({ createCompany }) => {
      const { token, ...userInfo } = createCompany;
      const { id, name } = userInfo;

      localStorage.setItem("token", token);
      localStorage.setItem("companyId", id);

      setToken(token);
      setCompanyId(id);
      setUser({ id, name });

      navigate("/home", { replace: true });
    },
  });

  const [createService, { loading: createServiceLoading }] = useMutation(
    CREATE_SERVICE,
    {
    onCompleted: () => {
      setServiceInfo({});
      setShowServiceModal(false);
      onClose();
    },

    update: (cache, { data }) => {
      const newService = data?.createService;
      if (!newService) return;

      const existing = cache.readQuery({
        query: SERVICES,
        variables: variablesQuery,
      });

      if (!existing) return;

      cache.writeQuery({
        query: SERVICES,
        variables: variablesQuery,
        data: {
          services: sortServicesByIdDesc([newService, ...existing.services]),
        },
      });

      cache.evict({ fieldName: "earnings" });
    },
  });

  const [editService, { loading: editServiceLoading }] = useMutation(
    EDIT_SERVICE,
    {
    onCompleted: () => {
      setServiceInfo({});
      setShowServiceModal(false);
      onClose();
    },

    update: (cache, { data }) => {
      const updatedService = data?.editService;
      if (!updatedService) return;

      const existing = cache.readQuery({
        query: SERVICES,
        variables: variablesQuery,
      });

      if (!existing) return;

      const updatedServices = existing.services.map((service) =>
        service.id === updatedService.id ? updatedService : service,
      );

      cache.writeQuery({
        query: SERVICES,
        variables: variablesQuery,
        data: {
          services: sortServicesByIdDesc(updatedServices),
        },
      });
      cache.evict({ fieldName: "earnings" });
    },
  });

  const [deleteService] = useMutation(DELETE_SERVICE, {
    onCompleted: () => {
      setDeletedServiceId(null);
      setShowDeleteModal(false);
      onClose();
    },
  });

  const handleSubmit = async (e, user) => {
    e.preventDefault();

    loginUser({
      variables: {
        ...user,
      },
    });
  };

  const handleSubmitRegister = async (e, user) => {
    e.preventDefault();

    createUser({
      variables: {
        companyInfo: {
          ...user,
        },
      },
    });
  };

  const handleSubmitServices = async (e, { id, ...serviceInfo }) => {
    e.preventDefault();

    createService({
      variables: {
        serviceInfo: {
          ...serviceInfo,
        },
      },
    });
  };

  const handleEditSubmitServices = async (
    e,
    { id: serviceId, ...serviceInfo },
  ) => {
    e.preventDefault();

    editService({
      variables: {
        serviceId,
        serviceInfo: {
          ...serviceInfo,
        },
      },
    });
  };

  const handleDeleteService = async (serviceId) => {
    deleteService({
      variables: {
        serviceId,
      },

      update: (cache) => {
        const existing = cache.readQuery({
          query: SERVICES,
          variables: variablesQuery,
        });

        if (!existing) return;

        const filteredServices = existing.services.filter(
          (service) => service.id !== serviceId,
        );

        cache.writeQuery({
          query: SERVICES,
          variables: variablesQuery,
          data: {
            services: filteredServices,
          },
        });
        cache.evict({ fieldName: "earnings" });
      },
    });
  };

  return {
    handleSubmit,
    handleDeleteService,
    handleEditSubmitServices,
    handleSubmitRegister,
    handleSubmitServices,
    isError,
    paginatedData,
    observeIntersection,
    createServiceLoading,
    editServiceLoading,
    servicesData: servicesData?.services || [],
    servicesLoading,
    servicesError,
    setIsError,
    userLoading,
    userRegisterLoading,
    userRegisterError,
    userError: userError?.errors[0]?.message,
  };
};
