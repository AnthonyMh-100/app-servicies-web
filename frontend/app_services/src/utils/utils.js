export const formatterCurrency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export const maxLength = ({ text = "", length = 10 }) => {
  const description = text.substring(0, length);
  return `${description}${text.length > length ? "..." : ""}`;
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
  const normalizedSearch = search.trim().toLowerCase();

  const filteredByStatus = services.filter((service) => {
    const serviceStatus = Boolean(service?.[statusKey]);
    if (selectedFilter === paidValue) return serviceStatus;
    if (selectedFilter === unpaidValue) return !serviceStatus;
    return true;
  });

  if (!normalizedSearch) return filteredByStatus;

  return filteredByStatus.filter((service) => {
    const name = (service?.[nameKey]).toLowerCase();
    return name.includes(normalizedSearch);
  });
};
