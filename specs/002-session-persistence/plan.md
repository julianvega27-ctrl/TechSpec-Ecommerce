# Implementation Plan: Persistencia de sesión de usuario

**Branch**: `[002-session-persistence]` | **Date**: 2026-07-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-session-persistence/spec.md`

## Summary

Implementar persistencia de sesión utilizando el token JWT almacenado en `localStorage` para evitar modificaciones en el backend. Al cargar la aplicación, se validará el token mostrando una pantalla de carga a pantalla completa. Si el token es inválido o la red falla, la sesión local se limpiará.

## Technical Context

**Language/Version**: TypeScript / Node.js
**Primary Dependencies**: React, Axios, React Router, Vite
**Storage**: `localStorage` (Frontend)
**Testing**: Manual validation
**Target Platform**: Web (React Frontend)
**Project Type**: Web application
**Performance Goals**: Carga inicial sin demoras perceptibles o parpadeos.
**Constraints**: 
- Obligatorio usar `localStorage` para el token (restricción por seguridad backend vs frontend).
- Obligatorio mostrar pantalla de carga (spinner full-screen) durante la validación inicial.
- No modificar endpoints backend.
**Scale/Scope**: Solo afecta el frontend.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*
- **Simplicidad**: ✅ La solución propuesta usando `localStorage` en lugar de refactorizar todo a cookies HttpOnly es la más simple y cumple las restricciones del proyecto.
- **Estabilidad**: ✅ Se reutilizan componentes y la arquitectura de frontend, con cambios mínimos incrementales en el contexto de autenticación.
- **Manejo de Errores**: ✅ Limpieza de token explícita en caso de error de red.

## Project Structure

### Documentation (this feature)

```text
specs/002-session-persistence/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   └── ui/
│   │       └── Indicators.tsx (Revisar si es necesario para el spinner full-screen)
│   ├── context/
│   │   └── AuthContext.tsx (Update for token persistence and API validation)
│   └── App.tsx
```

**Structure Decision**: El desarrollo ocurrirá primariamente dentro de `AuthContext.tsx` en el frontend.
