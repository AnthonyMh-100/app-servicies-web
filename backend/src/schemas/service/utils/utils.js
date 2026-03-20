import { GraphQLError } from "graphql";

export const validateFieldsService = ({ name, description, delivery_date }) => {
  if (name && !name.trim()) throw new GraphQLError("Field name is required!");

  if (description && !description.trim())
    throw new GraphQLError("Field description is required!");

  if (delivery_date && !delivery_date.trim())
    throw new GraphQLError("Field delivery date is required!");
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
