# WEB_SERVICES

Aplicación web para la gestión de servicios de una empresa: registro de servicios, control de pagos, estado de cobro (pagado/no pagado), historial operativo por fecha y visualización de métricas de ingresos.

## Funcionalidades principales

- Autenticación de empresa (login y registro).
- Gestión completa de servicios:
- crear, editar y eliminar servicios.
- registro de servicios con pago completo o parcial.
- Gestión de pagos por servicio:
- registrar abonos.
- consultar historial de pagos.
- Estado financiero por servicio:
- total del servicio.
- total abonado.
- saldo pendiente.
- Historial por fecha con filtros y búsqueda.
- Paginación en vistas de servicios e historial.

## Arquitectura general

- `frontend/app_services`: cliente web (SPA) para operación diaria.
- `backend`: API GraphQL con reglas de negocio y acceso a base de datos.

## Frontend

Cliente React orientado a interfaz administrativa, con diseño basado en `styled-components` y consumo de API GraphQL con Apollo Client.

### Tecnologías (Frontend)

- React 19
- Vite 7
- Apollo Client
- GraphQL
- React Router
- styled-components
- Moment.js
- ESLint

## Backend

Servidor GraphQL con Apollo Server sobre Express. Implementa autenticación con JWT, seguridad de contraseñas con bcrypt y persistencia con Sequelize para MySQL.

### Tecnologías (Backend)

- Node.js (ES Modules)
- Express 4
- Apollo Server 4
- GraphQL
- Sequelize (`@sequelize/mysql`)
- MySQL
- JWT (`jsonwebtoken`)
- bcrypt
- dotenv
- CORS
- Moment.js

## Flujo funcional resumido

1. La empresa se autentica en el frontend.
2. El frontend envía operaciones GraphQL al backend.
3. El backend valida token JWT, aplica reglas de negocio y consulta/persiste datos en MySQL.
4. El frontend actualiza la UI (tablas, estados, historial y métricas) con los datos recibidos.


