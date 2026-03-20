export const formatterCurrency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export const maxLength = ({ text = "", length = 10 }) => {
  const description = text.substring(0, length);
  return `${description}${text.length > length ? "..." : ""}`;
};
