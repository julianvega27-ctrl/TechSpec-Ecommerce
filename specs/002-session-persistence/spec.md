# Feature Specification: Persistencia de sesión de usuario

**Feature Branch**: `[002-session-persistence]`

**Created**: 2026-07-05

**Status**: Draft

**Input**: User description: "Feature: Persistencia de sesión de usuario..."

## Clarifications

### Session 2026-07-05
- Q: Mecanismo de Almacenamiento del Token → A: Usar localStorage. Es vulnerable a XSS pero evita modificar el backend.
- Q: Experiencia de Carga (Loading State) → A: Mostrar un indicador de carga a pantalla completa hasta que la validación termine.
- Q: Manejo de Errores de Red → A: Borrar el token y limpiar la sesión por seguridad.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Persistencia al Recargar (Priority: P1)

Como usuario autenticado, quiero que mi sesión se mantenga activa al recargar la página para no tener que volver a iniciar sesión constantemente.

**Why this priority**: Es el comportamiento básico esperado de cualquier aplicación web moderna y bloquea el uso fluido de rutas protegidas.

**Independent Test**: Puede ser probado independientemente iniciando sesión, recargando el navegador y verificando que la interfaz sigue mostrando el estado autenticado y permitiendo acceso a datos protegidos.

**Acceptance Scenarios**:

1. **Given** un usuario que acaba de iniciar sesión exitosamente, **When** recarga la página, **Then** el sistema recupera la sesión automáticamente y mantiene al usuario autenticado.
2. **Given** un usuario con una sesión válida, **When** cierra y vuelve a abrir el navegador, **Then** permanece autenticado.

---

### User Story 2 - Validación de Token (Priority: P1)

Como sistema, quiero validar automáticamente el token almacenado al iniciar la aplicación para garantizar que solo usuarios con acceso válido puedan interactuar con zonas protegidas.

**Why this priority**: Es fundamental por seguridad evitar que un token expirado o revocado mantenga la sesión en el frontend.

**Independent Test**: Puede probarse alterando o esperando la expiración del token y recargando la página, verificando que el usuario sea redirigido o pase a estado no autenticado.

**Acceptance Scenarios**:

1. **Given** un token expirado almacenado en el navegador, **When** el usuario intenta acceder a la aplicación, **Then** el token es eliminado y el usuario es considerado no autenticado.
2. **Given** un token válido almacenado, **When** la aplicación se inicializa, **Then** se obtiene correctamente la información actualizada del usuario desde la API.

---

### User Story 3 - Cierre de Sesión Limpio (Priority: P2)

Como usuario, quiero cerrar sesión y tener la garantía de que toda mi información y tokens sean eliminados del navegador para proteger mi cuenta en dispositivos compartidos.

**Why this priority**: Un mecanismo de cierre de sesión seguro es esencial para la privacidad del usuario, complementando la persistencia.

**Independent Test**: Puede probarse haciendo clic en cerrar sesión y verificando en las herramientas de desarrollo del navegador que el token haya desaparecido, y que no se pueda acceder a rutas protegidas posteriormente.

**Acceptance Scenarios**:

1. **Given** un usuario con sesión activa, **When** hace clic en cerrar sesión, **Then** su token es eliminado del navegador y su estado vuelve a no autenticado.

### Edge Cases

- What happens when el token almacenado ha sido alterado manualmente por el usuario en el navegador?
- How does system handle cuando la API está caída al momento de intentar validar el token durante la inicialización de la app? (Manejado: El sistema asume que el token no pudo ser validado, lo elimina de localStorage y limpia la sesión por seguridad, forzando un nuevo inicio de sesión).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST almacenar el JWT en el `localStorage` del navegador después de un inicio de sesión exitoso para evitar modificaciones en el backend.
- **FR-002**: System MUST detectar automáticamente si existe un JWT en `localStorage` al iniciar o recargar la aplicación.
- **FR-003**: System MUST mostrar un indicador de carga a pantalla completa mientras se valida el estado del token para evitar parpadeos en la UI.
- **FR-004**: System MUST validar el estado del token obtenido realizando una petición a la API para recuperar la información del usuario autenticado.
- **FR-005**: System MUST mantener al usuario autenticado sin requerir un nuevo inicio de sesión si el token es válido.
- **FR-006**: System MUST eliminar el token automáticamente de `localStorage` y retornar al usuario a un estado no autenticado si el token ha expirado, es inválido, o si la validación falla por error de red.
- **FR-007**: System MUST eliminar completamente el token de `localStorage` y limpiar el estado de autenticación al ejecutar el cierre de sesión.
- **FR-008**: System MUST impedir el acceso a rutas protegidas (tanto de usuario como panel administrativo) cuando no exista un usuario autenticado válido.

### Key Entities

- No se requieren nuevas entidades en el modelo de datos. Depende del esquema `User` existente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de las recargas de página realizadas por usuarios con token válido mantienen la sesión activa.
- **SC-002**: 100% de los intentos de acceso con tokens expirados o inválidos resultan en la limpieza de la sesión local.
- **SC-003**: 0% de fuga de datos de autenticación tras realizar un cierre de sesión exitoso.
- **SC-004**: Ninguna funcionalidad existente del sistema sufre regresiones tras la implementación.

## Assumptions

- El backend ya cuenta con un endpoint `/api/auth/me` (o similar) para obtener la información del usuario a partir de un token JWT válido.
- No se requiere implementar rotación de tokens (Refresh Tokens) en esta fase, únicamente persistir el JWT actual.
- El almacenamiento persistente utilizará exclusivamente `localStorage` (evitando cookies) para cumplir la restricción de no modificar el backend.
