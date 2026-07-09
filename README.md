# TechSpec Ecommerce

Sistema de comercio electrónico desarrollado con React, Express, Prisma ORM y PostgreSQL.

## Enlaces

- 🌐 **Aplicación:** https://tu-frontend.vercel.app
- ⚙️ **API:** https://techspec-ecommerce.onrender.com
- 📘 **Swagger:** https://techspec-ecommerce.onrender.com/api-docs

## Descripción

TechSpec Ecommerce es una plataforma web para la venta de productos tecnológicos.

El sistema permite a los clientes explorar el catálogo, gestionar un carrito de compras, realizar pedidos simulados y consultar su historial de compras.

Además, incluye un panel administrativo para la gestión de productos, categorías y pedidos.

## Tecnologías

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- Axios
- React Router
- React Hook Form
- Zod

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM 7
- PostgreSQL
- JWT
- Google OAuth

### Servicios

- Neon
- Cloudinary
- Render
- Vercel

## Arquitectura

```
Frontend (React)
        │
        ▼
Backend (Express)
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL (Neon)

Cloudinary
↑
Imágenes
```

## Funcionalidades

### Clientes

- Registro
- Inicio de sesión
- Inicio de sesión con Google
- Perfil
- Datos de envío
- Catálogo
- Búsqueda
- Filtros
- Carrito
- Checkout
- Historial de pedidos

### Administrador

- CRUD Productos
- CRUD Categorías
- Gestión de pedidos
- Actualización de estados

## Capturas

### Inicio

![Inicio](docs/assets/home.png)

### Catálogo

![Catalogo](docs/assets/catalogo.png)

### Panel administrador

![Admin](docs/assets/admin.png)

## Instalación

### Clonar

```bash
git clone https://github.com/usuario/TechSpec-Ecommerce.git
```

### Backend

```bash
cd backend
npm install
```

Configurar `.env`

```bash
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Variables de entorno

### Backend

- DATABASE_URL
- JWT_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

### Frontend

- VITE_API_URL
- VITE_GOOGLE_CLIENT_ID

## Despliegue

Frontend

- Vercel

Backend

- Render

Base de datos

- Neon

Imágenes

- Cloudinary

## Pruebas

El proyecto incluye:

- Pruebas unitarias
- Pruebas de integración mediante Testcontainers y PostgreSQL

Cobertura objetivo: 84%.

## Licencia

Proyecto desarrollado por [Julián Anthony Vega Salvatierra] para fines académicos
