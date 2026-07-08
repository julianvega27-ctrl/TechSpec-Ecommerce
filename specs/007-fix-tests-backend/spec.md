# Feature Specification: Corrección de Test y Refactorización Backend

**Feature Branch**: `[008-fix-tests-backend]`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User description: "008 Corrección de test y refactorización Backend" + QA Report

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Estandarización de Respuestas API (Priority: P1)

Como consumidor de la API (o test automatizado), necesito que todos los endpoints exitosos devuelvan la información dentro de un objeto `data` para que el parseo sea consistente y los tests no fallen con `TypeErrors`.

**Why this priority**: Es la principal causa del 45% de los fallos en las pruebas de integración. Arreglar esto estabilizará múltiples suites de pruebas a la vez.

**Independent Test**: Se puede probar independientemente ejecutando `npm run test:coverage` y verificando que los tests de `admin.test.ts`, `catalog.test.ts` y `checkout.test.ts` que fallaban por variables indefinidas ahora pasen.

**Acceptance Scenarios**:

1. **Given** una solicitud válida a `/api/admin/dashboard`, **When** el servidor responde exitosamente, **Then** el payload JSON debe tener la forma `{ "data": { "activeUsers": ... } }`.
2. **Given** una solicitud válida a `/api/products` o `/api/categories`, **When** se listan los elementos, **Then** el resultado debe estar envuelto en un objeto `data`.

---

### User Story 2 - Acceso Público a Configuraciones del Sitio (Priority: P2)

Como usuario no autenticado, necesito poder acceder a las configuraciones públicas del sitio (como el Hero banner) para que la página principal pueda cargar su contenido sin requerir inicio de sesión.

**Why this priority**: Actualmente el test espera 200 OK pero recibe 401 Unauthorized, lo que indica un problema de configuración en el enrutador de administrador que afecta la experiencia de usuario pública.

**Independent Test**: Puede ser testeado haciendo un GET HTTP a `/api/admin/settings/hero` sin enviar un token de autenticación. Debe retornar 200.

**Acceptance Scenarios**:

1. **Given** un visitante anónimo, **When** solicita `GET /api/admin/settings/hero`, **Then** recibe código HTTP 200 y el contenido público de la configuración.

---

### User Story 3 - Semántica HTTP y Enrutamiento Correcto en Carrito/Checkout (Priority: P2)

Como cliente del API de carrito y órdenes, necesito que los endpoints respondan en las URLs correctas y con los códigos HTTP semánticamente precisos (ej. 201 para creaciones) para que las aplicaciones cliente puedan interpretar correctamente el resultado de sus acciones.

**Why this priority**: Resuelve el 40% restante de las pruebas que fallan por desajustes entre expectativas de ruta y códigos de estado.

**Independent Test**: Ejecutar los tests de `checkout.test.ts` y verificar que el carrito y el proceso de checkout funcionen de principio a fin.

**Acceptance Scenarios**:

1. **Given** un usuario que agrega un producto nuevo al carrito, **When** se procesa la petición `POST /api/cart`, **Then** el servidor responde con un código `201 Created`.
2. **Given** un test que valida el checkout, **When** envía la petición para procesar el carrito, **Then** debe usar la ruta correcta `/api/orders/checkout` y recibir el código HTTP esperado.

### Edge Cases

- ¿Qué pasa si el payload del middleware de errores globales no usa la convención de `success: false` que esperan los tests? (El test de Auth fallaba por esto). Se debe actualizar el test para verificar el status 400 y la existencia del campo `error` o `message` según defina la convención actual del servidor.
- ¿Qué pasa si la ruta de `settings` se mueve a un archivo público? Podría cambiar la convención de prefijo (de `/api/admin/settings` a `/api/settings`). En ese caso, tanto las pruebas como las llamadas del frontend deben ajustarse.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE envolver las respuestas exitosas de `AdminController.getDashboardStats`, `AdminController.updateSettings`, `AdminController.getSettings` en un objeto `data` (ej: `res.json({ data: result })`).
- **FR-002**: El sistema DEBE envolver las respuestas de los listados de `CategoryController` y `ProductController` en el objeto `data`.
- **FR-003**: El sistema DEBE exponer la ruta `GET /settings/:section` sin requerir los middlewares `requireAuth` y `requireAdmin` (puede reubicarse encima de los middlewares globales en `admin.routes.ts` o moverse a un router público).
- **FR-004**: El sistema DEBE responder con HTTP 201 cuando `CartController.addToCart` crea exitosamente un nuevo registro en el carrito.
- **FR-005**: Las pruebas de integración en `checkout.test.ts` DEBEN realizar las peticiones al endpoint correcto para checkout (probablemente `/api/orders/checkout` en vez de `/api/checkout`).
- **FR-006**: La prueba de registro de usuario con email duplicado (`auth.test.ts`) DEBE validar la aserción utilizando la estructura real del middleware de error del servidor en lugar de esperar una propiedad `success: false`.

### Key Entities 

- **Response Wrapper**: Una abstracción o convención para garantizar que todas las respuestas tengan un formato uniforme (ej. `{ data: any, message?: string }`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ejecución exitosa del 100% de las pruebas en la suite de integración de Vitest (`npm run test:coverage`).
- **SC-002**: Reducción de 13 pruebas fallidas a 0.
- **SC-003**: Las respuestas de los endpoints refactorizados deben pasar la validación estructural sin emitir `TypeError: Cannot read properties of undefined`.

## Assumptions

- Se asume que el refactor se enfoca en que la API cumpla el contrato esperado por los tests (salvo cuando los tests apuntan a rutas inexistentes, en cuyo caso se corrige el test).
- Se asume que no se realizarán refactorizaciones mayores de lógica de negocio o base de datos que rompan funcionalidades existentes no relacionadas con los fallos listados en el reporte QA.
