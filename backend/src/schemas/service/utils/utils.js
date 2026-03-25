import { GraphQLError } from "graphql";

export const badUserInputError = (message) =>
  new GraphQLError(message, {
    extensions: { code: "BAD_USER_INPUT" },
  });

export const validateFieldsService = ({ name, description, delivery_date }) => {
  if (name && !name.trim())
    throw badUserInputError("Field name is required!");

  if (description && !description.trim())
    throw badUserInputError("Field description is required!");

  if (delivery_date && !delivery_date.trim())
    throw badUserInputError("Field delivery date is required!");
};

export const validatePaymentInfo = ({ paidDate, amount, note } = {}) => {
  if (!paidDate || !paidDate.toString().trim()) {
    throw badUserInputError("paidDate is required!");
  }

  if (amount === undefined || amount === null || amount === "") {
    throw badUserInputError("amount is required!");
  }

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) {
    throw badUserInputError("amount must be a number!");
  }
  if (numericAmount <= 0) {
    throw badUserInputError("amount must be greater than 0!");
  }

  if (note !== undefined && note !== null && !note.toString().trim()) {
    throw badUserInputError("note cannot be empty!");
  }
};

export const filterAndSearchServices = ({
  services = [],
  selectedFilter,
  search = "",
  paidValue,
  unpaidValue,
  nameKey = "name",
  statusKey = "status",
} = {}) => {
  const safeServices = Array.isArray(services) ? services : [];
  const normalizedSearch = (search ?? "").toString().trim().toLowerCase();

  const filteredByStatus = safeServices.filter((service) => {
    const status = Boolean(service?.[statusKey]);
    if (selectedFilter === paidValue) return status;
    if (selectedFilter === unpaidValue) return !status;
    return true;
  });

  if (!normalizedSearch) return filteredByStatus;

  return filteredByStatus.filter((service) => {
    const name = (service?.[nameKey] ?? "").toString().toLowerCase();
    return name.includes(normalizedSearch);
  });
};
