export const KEYS_FILTERS = {
  ALL: "Todo",
  PAID: "Pagados",
  UNPAID: "No Pagados",
};

export const COLUMNS_SERVICES = [
  { key: "id", label: "N°" },
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
  { key: "delivery_date", label: "Fecha de Entrega" },
  { key: "total", label: "Total" },
  { key: "status", label: "Estado" },
  { key: "actions", label: "Acciones" },
];
export const SERVICE_FILTERS = [
  { key: 1, label: KEYS_FILTERS.ALL },
  { key: 2, label: KEYS_FILTERS.PAID },
  { key: 3, label: KEYS_FILTERS.UNPAID },
];

export const SECCTION_LOGIN_KEY = {
  LOGIN: "login",
  REGISTER: "register",
};

export const MENUS_KEYS = {
  HOME: "home",
  SERVICES: "services",
};

export const MENUS = [
  {
    key: MENUS_KEYS.HOME,
    name: "Home",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 12l9-9 9 9h-3v9h-12v-9H3z" />
      </svg>
    ),
  },
  {
    key: MENUS_KEYS.SERVICES,
    name: "Services",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 2h4a2 2 0 0 1 2 2v2h3a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V10a2 2 0 0 1 2-2h3V4a2 2 0 0 1 2-2Zm4 2h-4v2h4V4Zm6 6H4v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9Z" />
      </svg>
    ),
  },
];
