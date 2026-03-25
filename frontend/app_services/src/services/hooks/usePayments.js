import { useMutation, useQuery } from "@apollo/client/react";
import { CREATE_SERVICE_PAYMENT } from "../../graphql/mutations";
import { SERVICE_PAYMENTS } from "../../graphql/queries";

export const usePayments = ({
  serviceId = null,
  skipPayments = false,
} = {}) => {
  const {
    data: paymentsData,
    loading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
  } = useQuery(SERVICE_PAYMENTS, {
    fetchPolicy: "cache-first",
    skip: skipPayments || !serviceId,
    variables: { serviceId },
  });

  const [
    createServicePayment,
    { loading: paymentLoading, error: paymentError },
  ] = useMutation(CREATE_SERVICE_PAYMENT, {
    update: (cache, { data }) => {
      const newPayment = data?.createServicePayment;
      if (!newPayment) return;

      const existing = cache.readQuery({
        query: SERVICE_PAYMENTS,
        variables: { serviceId: newPayment.serviceId },
      });

      if (!existing?.servicePayments) return;

      cache.writeQuery({
        query: SERVICE_PAYMENTS,
        variables: { serviceId: newPayment.serviceId },
        data: {
          servicePayments: [newPayment, ...existing.servicePayments],
        },
      });

      cache.evict({ fieldName: "services" });
    },
  });

  return {
    payments: paymentsData?.servicePayments || [],
    paymentsLoading,
    paymentsError,
    refetchPayments,
    createServicePayment,
    paymentLoading,
    paymentError,
  };
};
