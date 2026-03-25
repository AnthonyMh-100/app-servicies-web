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

  const [createService] = useMutation(CREATE_SERVICE, {
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
          services: [newService, ...existing.services],
        },
      });

      cache.evict({ fieldName: "earnings" });
    },
  });

  const [editService] = useMutation(EDIT_SERVICE, {
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

      const filteredServices = existing.services.filter(
        (service) => service.id !== updatedService.id,
      );

      cache.writeQuery({
        query: SERVICES,
        variables: variablesQuery,
        data: {
          services: [updatedService, ...filteredServices],
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
    paginatedData,
    observeIntersection,
    servicesData: servicesData?.services || [],
    servicesLoading,
    servicesError,
    userLoading,
    userRegisterLoading,
    userRegisterError,
    userError: userError?.errors[0]?.message,
  };
};
