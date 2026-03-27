import { GraphQLError } from "graphql";
import moment from "moment";

export const badUserInputError = (message) =>
  new GraphQLError(message, {
    extensions: { code: "BAD_USER_INPUT" },
  });

const isValidDateString = (value) =>
  moment(value, "YYYY-MM-DD", true).isValid();

export const validateFieldsService = ({
  name,
  description,
  delivery_date,
  createdDate,
}) => {
  if (name && !name.trim())
    throw badUserInputError("Field name is required!");

  if (description && !description.trim())
    throw badUserInputError("Field description is required!");

  if (delivery_date && !delivery_date.trim())
    throw badUserInputError("Field delivery date is required!");

  if (createdDate === undefined || createdDate === null || !createdDate.trim())
    throw badUserInputError("createdDate is required!");

  if (createdDate && !isValidDateString(createdDate)) {
    throw badUserInputError("createdDate must be YYYY-MM-DD!");
  }

  if (delivery_date && !isValidDateString(delivery_date)) {
    throw badUserInputError("delivery_date must be YYYY-MM-DD!");
  }
};

export const validatePaymentInfo = ({ paidDate, amount, note } = {}) => {
  if (!paidDate || !paidDate.toString().trim()) {
    throw badUserInputError("paidDate is required!");
  }

  if (!isValidDateString(paidDate)) {
    throw badUserInputError("paidDate must be YYYY-MM-DD!");
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
