export const SERVICE_FILTERS = ["Todo", "Pagados", "No Pagados"];

export const COLUMNS_SERVICES = [
  { key: "id", label: "N°" },
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
  { key: "delivery_date", label: "Fecha de Entrega" },
  { key: "total_advance", label: "Total Adelanto" },
  { key: "total_pending", label: "Total Pendiente" },
  { key: "total", label: "Total" },
  { key: "status", label: "Estado" },
  { key: "actions", label: "Acciones" },
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
        <path d="M3 12l9-9 9 9h-3v9h-12v-9h-3z" />
      </svg>
    ),
  },
  {
    key: MENUS_KEYS.SERVICES,
    name: "Services",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6h16v2h-16v-2zm0 6h16v2h-16v-2zm0 6h16v2h-16v-2z" />
      </svg>
    ),
  },
];
