<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0
- Added sections: Core Principles, Architecture & Technologies, Design Reference
- Removed sections: N/A
- Templates requiring updates: ✅ None required at this time (standard templates align with these general principles)
- Follow-up TODOs: N/A
-->
# TechSpec Ecommerce Constitution

## Core Principles

### I. Propósito y Filosofía
El desarrollo DEBE seguir el principio de simplicidad. Las soluciones implementadas DEBEN resolver los requerimientos funcionales utilizando la menor complejidad posible, evitando patrones o arquitecturas innecesarias. Siempre se DEBE priorizar la legibilidad, mantenibilidad y reutilización del código. El contenido funcional y visual del sistema DEBE estar dirigido a usuarios de habla hispana (español). El único nombre que permanecerá en inglés será **TechSpec**, como nombre oficial de la plataforma.

### II. Calidad del Código
Todo el código generado DEBE cumplir con los siguientes principios: legible, modular, reutilizable, consistente y fácil de mantener. Debe estar correctamente tipado. El principio de responsabilidad única DEBE ser aplicado. Se prohíbe la duplicación de código.

### III. Validaciones y Manejo de Errores
Se DEBEN implementar validaciones robustas tanto en el frontend como en el backend. El manejo de errores DEBE estar centralizado. Todas las entradas de la API DEBEN ser validadas antes de ser procesadas (usando Zod).

### IV. Desarrollo Incremental
La implementación DEBE realizarse por fases. Cada fase DEBE entregar una versión funcional del sistema antes de continuar. No se permite la generación de implementaciones incompletas, marcar tareas como completadas si existen errores de compilación o ejecución ni código temporal que posteriormente deba ser reemplazado. Antes de iniciar una nueva fase DEBE verificarse que frontend y backend continúan funcionando correctamente.

## Architecture & Technologies

### Backend Stack & Architecture
- **Tecnologías**: Node.js, Express.js, TypeScript.
- **Persistencia**: PostgreSQL y Prisma ORM. Modificaciones al esquema DEBEN realizarse mediante migraciones de Prisma.
- **Autenticación**: JWT, Google OAuth.
- **Arquitectura**: El backend DEBE organizarse mediante una arquitectura modular con separación clara de responsabilidades: Configuración, Rutas, Controladores, Servicios, Acceso a datos (Prisma ORM 7.8.0), Middlewares, Validaciones y Utilidades.
- **API**: La API DEBE seguir principios REST. Las respuestas DEBEN ser consistentes y utilizar códigos HTTP adecuados.
Las modificaciones al esquema de la base de datos DEBEN realizarse únicamente mediante Prisma Migrate. No deberá utilizarse SQL manual salvo que resulte estrictamente necesario.

### Frontend Stack & Architecture
- **Tecnologías**: React, Vite, TypeScript, Tailwind CSS, React Router, Axios, React Hook Form, Zod.
- **Almacenamiento**: Cloudinary para imágenes.
- **Arquitectura**: El frontend DEBE organizarse utilizando componentes reutilizables y módulos funcionales.

## Gestión de Imágenes

Todas las imágenes del sistema DEBEN almacenarse exclusivamente en Cloudinary. La base de datos únicamente almacenará la referencia de la imagen, por ejemplo:
- imageUrl
- imagePublicId
No deberán almacenarse imágenes dentro del proyecto ni en la base de datos.

## Autenticación

El sistema DEBE soportar dos mecanismos de autenticación:
- JWT
- Google OAuth
JWT protegerá las rutas privadas. Google OAuth permitirá el inicio de sesión mediante cuentas de Google. Ambos mecanismos DEBEN compartir el mismo modelo de usuario. Las contraseñas DEBEN almacenarse utilizando algoritmos seguros de hash. Nunca deberán almacenarse contraseñas en texto plano.


# Design Reference

La interfaz del proyecto DEBE implementarse siguiendo estrictamente las especificaciones definidas en `docs/DESIGN.md`. Además, la implementación visual DEBE tomar como referencia obligatoria todas las imágenes ubicadas en:
```
docs/assets/
```
Estas imágenes representan la guía oficial del diseño y deberán utilizarse como referencia para:
- Distribución de la interfaz (layout).
- Jerarquía visual.
- Paleta de colores.
- Tipografía.
- Espaciados.
- Componentes.
- Estilo de botones.
- Formularios.
- Tarjetas.
- Iconografía.
- Navegación.
- Diseño responsivo.
-Adaptable a dispositivos (desktop, mobile, tablet y smart tv.)
- Experiencia de usuario (UX).

Las imágenes constituyen una referencia visual y **NO** deberán copiarse literalmente. La implementación deberá inspirarse en ellas respetando la identidad visual del proyecto.

Bajo ninguna circunstancia las imágenes de referencia podrán modificar o influir sobre:
- La lógica de negocio.
- El modelo de datos.
- La arquitectura.
- Las reglas funcionales definidas en la especificación.
En caso de existir discrepancias entre `docs/DESIGN.md`, las imágenes ubicadas en `docs/assets/` y la lógica del proyecto, prevalecerán siempre la especificación funcional, el modelo de datos y esta constitución.

# Project Stability

El proyecto ya cuenta con una estructura inicial correctamente configurada. Durante toda la implementación NO se deberá:
- Actualizar automáticamente dependencias.
- Cambiar versiones del stack tecnológico.
- Modificar configuraciones funcionales de TypeScript, Vite, Tailwind CSS o Express sin justificación técnica.
- Reescribir completamente archivos existentes cuando puedan extenderse.
- Recrear el proyecto desde cero.
- Eliminar archivos funcionales previamente verificados.
La implementación DEBERÁ reutilizar la estructura existente y extenderla mediante cambios incrementales.

## Governance

Esta constitución rige todo el desarrollo del proyecto TechSpec Ecommerce. 
Las modificaciones a los principios DEBEN documentarse mediante un incremento de versión. Todos los pull requests y revisiones de código DEBEN verificar el cumplimiento de estas directrices.

**Version**: 1.0.0 | **Ratified**: 2026-07-04 | **Last Amended**: 2026-07-04
