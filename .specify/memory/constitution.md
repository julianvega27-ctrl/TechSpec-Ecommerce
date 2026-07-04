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
El desarrollo DEBE seguir el principio de simplicidad. Las soluciones implementadas DEBEN resolver los requerimientos funcionales utilizando la menor complejidad posible, evitando patrones o arquitecturas innecesarias. Siempre se DEBE priorizar la legibilidad, mantenibilidad y reutilización del código.

### II. Calidad del Código
Todo el código generado DEBE cumplir con los siguientes principios: legible, modular, reutilizable, consistente y fácil de mantener. Debe estar correctamente tipado. El principio de responsabilidad única DEBE ser aplicado. Se prohíbe la duplicación de código.

### III. Validaciones y Manejo de Errores
Se DEBEN implementar validaciones robustas tanto en el frontend como en el backend. El manejo de errores DEBE estar centralizado. Todas las entradas de la API DEBEN ser validadas antes de ser procesadas (usando Zod).

### IV. Desarrollo Incremental
La implementación DEBE realizarse por fases. Cada fase DEBE entregar una versión funcional del sistema antes de continuar. No se permite la generación de implementaciones incompletas ni código temporal que posteriormente deba ser reemplazado.

## Architecture & Technologies

### Backend Stack & Architecture
- **Tecnologías**: Node.js, Express.js, TypeScript.
- **Persistencia**: PostgreSQL y Prisma ORM. Modificaciones al esquema DEBEN realizarse mediante migraciones de Prisma.
- **Autenticación**: JWT.
- **Arquitectura**: El backend DEBE organizarse mediante una arquitectura modular con separación clara de responsabilidades: Configuración, Rutas, Controladores, Servicios, Acceso a datos (Prisma), Middlewares, Validaciones y Utilidades.
- **API**: La API DEBE seguir principios REST. Las respuestas DEBEN ser consistentes y utilizar códigos HTTP adecuados.

### Frontend Stack & Architecture
- **Tecnologías**: React, Vite, TypeScript, Tailwind CSS, React Router, Axios, React Hook Form, Zod.
- **Almacenamiento**: Cloudinary para imágenes.
- **Arquitectura**: El frontend DEBE organizarse utilizando componentes reutilizables y módulos funcionales.

## Design Reference

La interfaz DEBE seguir una estética moderna, minimalista y orientada a una tienda de productos tecnológicos.
Características visuales obligatorias:
- Amplio uso de espacios en blanco.
- Paleta de colores neutros (blanco, grises claros, textos oscuros) con un color de acento azul moderno.
- Tarjetas con bordes redondeados y sombras suaves.
- Tipografía moderna y de alta legibilidad.
- Barra de navegación limpia y fija, y un hero principal amplio y visualmente atractivo.
- Cuadrículas responsivas, iconografía simple y consistente.
- Transiciones y animaciones discretas.
- Diseño totalmente responsivo para móviles, tabletas y escritorio.

*(Nota: Estas características son la guía visual y no DEBEN influir en la lógica de negocio ni la arquitectura).*

## Governance

Esta constitución rige todo el desarrollo del proyecto TechSpec Ecommerce. 
Las modificaciones a los principios DEBEN documentarse mediante un incremento de versión. Todos los pull requests y revisiones de código DEBEN verificar el cumplimiento de estas directrices.

**Version**: 1.0.0 | **Ratified**: 2026-07-04 | **Last Amended**: 2026-07-04
