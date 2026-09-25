# Distribuidora BV - Frontend

Frontend del sistema de gestión integral de una distribuidora. Desarrollado con React, TypeScript y Vite.

---

## Stack tecnológico

- **Framework / Librería principal**: React 19
- **Lenguaje**: TypeScript 5.7
- **Herramienta de build**: Vite 6
- **Enrutamiento**: React Router DOM
- **Peticiones HTTP**: Axios
- **Manejo de formularios**: React Hook Form + Yup
- **Estado global**: Jotai
- **Componentes de interfaz**: Radix UI, Headless UI y shadcn/ui
- **Iconos**: Heroicons y Lucide React
- **Tablas**: AG Grid
- **Gráficos**: Recharts
- **Animaciones**: Framer Motion
- **Autenticación**: JWT Decode, Google OAuth y Facebook Login
- **Estilos**: Tailwind CSS + CSS
- **Testing Unitario y de Componentes**: Vitest, React Testing Library, jsdom
- **Testing End-to-End (E2E)**: Playwright (Chromium)
- **Linting**: ESLint
- **Infraestructura**: Docker

---

## Estructura del proyecto

```text
Proyecto1_Front/
├── public/                  # Recursos públicos
├── src/
│   ├── assets/              # Imágenes y recursos estáticos
│   ├── componentes/         # Componentes reutilizables
│   ├── config/              # Configuraciones generales
│   ├── context/             # Contextos de React
│   ├── hooks/               # Hooks personalizados
│   ├── interfaces/          # Interfaces y tipos de TypeScript
│   ├── pages/               # Páginas principales de la aplicación
│   ├── utils/               # Funciones y utilidades
│   ├── App.css              # Estilos principales
│   ├── App.tsx              # Componente principal
│   ├── index.css            # Estilos globales
│   ├── main.tsx             # Punto de entrada
│   └── vite-env.d.ts        # Definiciones de tipos de Vite
├── .dockerignore
├── .env.development         # Variables para desarrollo
├── .env.production          # Variables para producción
├── .gitignore
├── .prettierrc
├── Dockerfile
├── eslint.config.js
└── package.json
```

---

## Estructura interna de cada módulo

El frontend se encuentra organizado en carpetas según su responsabilidad dentro de la aplicación:

```text
Proyecto1_Front/
├── public/
├── src/
│   ├── assets/
│   │   ├── imagenes/
│   │   └── react.svg
│   ├── componentes/
│   │   ├── gestion-organizacion/
│   │   │   ├── cliente/
│   │   │   │   ├── componentes/
│   │   │   │   │   ├── cliente-card.tsx
│   │   │   │   │   ├── cliente-tabla.tsx
│   │   │   │   │   ├── clientes-card.tsx
│   │   │   │   │   ├── filtros-cliente.tsx
│   │   │   │   │   ├── header-cliente-lg.tsx
│   │   │   │   │   └── header-cliente.tsx
│   │   │   │   ├── domain/
│   │   │   │   │   └── permisos-clientes.ts
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── use-cliente-impresion.ts
│   │   │   │   │   ├── use-cliente-modales.ts
│   │   │   │   │   ├── use-cliente.ts
│   │   │   │   │   └── use-clientes-filtros.ts
│   │   │   │   ├── interfaces/
│   │   │   │   │   └── interfaces-validaciones-cliente.tsx
│   │   │   │   ├── modales/
│   │   │   │   │   └── cliente-modales.tsx
│   │   │   │   ├── services/
│   │   │   │   │   └── cliente-service.tsx
│   │   │   │   └── utils/
│   │   │   │       ├── consultar-cliente.tsx
│   │   │   │       └── registrar-actualizar-cliente.tsx
│   │   │   ├── condicion-iva/
│   │   │   │   ├── condicion-iva-service.tsx
│   │   │   │   ├── consultar-condicion-iva.tsx
│   │   │   │   ├── interfaces-validaciones-condicion-iva.tsx
│   │   │   │   └── registrar-actualizar-condicion-iva.tsx
│   │   │   ├── localidad/
│   │   │   │   ├── componentes/
│   │   │   │   │   ├── datos-card.tsx
│   │   │   │   │   ├── datos-tabla.tsx
│   │   │   │   │   ├── filtros-localidad.tsx
│   │   │   │   │   ├── header-lg.tsx
│   │   │   │   │   └── header.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── use-localidad-modal.ts
│   │   │   │   ├── interfaces/
│   │   │   │   │   └── interfaces-validaciones-localidad.tsx
│   │   │   │   ├── modales/
│   │   │   │   │   └── localidad-modal.tsx
│   │   │   │   ├── services/
│   │   │   │   │   └── localidad-service.tsx
│   │   │   │   └── utils/
│   │   │   ├── personal/
│   │   │   │   ├── componentes/
│   │   │   │   ├── hooks/
│   │   │   │   ├── interfaces/
│   │   │   │   ├── modales/
│   │   │   │   ├── services/
│   │   │   │   └── utils/
│   │   │   ├── proveedor/
│   │   │   │   ├── componentes/
│   │   │   │   ├── hooks/
│   │   │   │   ├── interfaces/
│   │   │   │   ├── modales/
│   │   │   │   ├── services/
│   │   │   │   └── utils/
│   │   │   └── usuarios/
│   │   │       ├── componentes/
│   │   │       ├── hooks/
│   │   │       ├── interfaces/
│   │   │       ├── modales/
│   │   │       ├── services/
│   │   │       └── utils/
│   │   ├── gestion-producto/
│   │   │   ├── linea/
│   │   │   ├── marca/
│   │   │   ├── precios/
│   │   │   └── producto/
│   │   ├── gestion-usuario/
│   │   │   ├── auth-form.tsx
│   │   │   ├── cambiar-contrasena-form.tsx
│   │   │   ├── cambiar-contrasena-modal.tsx
│   │   │   ├── gestion-usuario.tsx
│   │   │   ├── interfaces-validaciones-usuario.tsx
│   │   │   ├── recuperar-contrasena-form.tsx
│   │   │   ├── registrar-usuario.tsx
│   │   │   └── usuario-service.tsx
│   │   ├── herramientas/
│   │   │   ├── alertas/
│   │   │   │   ├── alertas-confirmacion.tsx
│   │   │   │   └── alertas.tsx
│   │   │   ├── formateo-de-campos/
│   │   │   │   ├── cantidades-input.tsx
│   │   │   │   ├── cuit-input.tsx
│   │   │   │   ├── double-input.tsx
│   │   │   │   ├── email-input.tsx
│   │   │   │   ├── form-input.tsx
│   │   │   │   ├── fucion-formateo.tsx
│   │   │   │   ├── funcion-paginacion.tsx
│   │   │   │   ├── movimiento-campos.tsx
│   │   │   │   ├── porcentaje-input-simple.tsx
│   │   │   │   ├── porcentaje-input.tsx
│   │   │   │   └── price-input.tsx
│   │   │   ├── funciones-reutilizables/
│   │   │   │   ├── funcion-fechas-mes-antes.tsx
│   │   │   │   ├── funciones-campos-montos.tsx
│   │   │   │   └── funciones-formas-pago.tsx
│   │   │   ├── herramientas-visuales/
│   │   │   │   ├── global.css
│   │   │   │   └── theme-context.tsx
│   │   │   └── reutilizables/
│   │   │       ├── documentos-config/
│   │   │       ├── formularios/
│   │   │       ├── producto/
│   │   │       ├── tablas/
│   │   │       │   ├── formateo-columnas-documentos.tsx
│   │   │       │   ├── modelo-tabla.tsx
│   │   │       │   ├── tabla-flexible-ag-grid.tsx
│   │   │       │   └── tabla-flexible.tsx
│   │   │       ├── action-button.tsx
│   │   │       ├── busqueda-documento.tsx
│   │   │       ├── busqueda-producto.tsx
│   │   │       ├── cabecera-documentos.tsx
│   │   │       ├── columnas-imprimir.tsx
│   │   │       ├── denominacion-localidad.tsx
│   │   │       ├── documento-service.tsx
│   │   │       ├── domicilio.tsx
│   │   │       ├── entidad-selector-base.tsx
│   │   │       ├── estadisticas-simples.tsx
│   │   │       ├── filtros-aplicados.tsx
│   │   │       ├── filtros-entidad.tsx
│   │   │       ├── filtros-simple.tsx
│   │   │       ├── impresion-form.tsx
│   │   │       ├── informacion-auditoria.tsx
│   │   │       ├── informacion-base.tsx
│   │   │       ├── montos-item-nota-credito.tsx
│   │   │       ├── paginacion.tsx
│   │   │       ├── referencias-producto.tsx
│   │   │       ├── seleccion-producto-con-porcentaje...tsx
│   │   │       ├── seleccion-producto.tsx
│   │   │       ├── seleccion-proveedor-cliente-cabec...tsx
│   │   │       └── tabla-devolucion.tsx
│   │   ├── menu/
│   │   │   ├── menuItems-definicion.ts
│   │   │   └── sidebarMenus.tsx
│   │   ├── NotificacionModal/
│   │   │   ├── hooks/
│   │   │   │   └── use-notificacion-modal.ts
│   │   │   ├── interfaces/
│   │   │   │   └── notificacion.types.ts
│   │   │   ├── modales/
│   │   │   │   └── NotificacionModal.tsx
│   │   │   └── services/
│   │   │       └── notificacion-usuario-service.tsx
│   │   ├── sistema/
│   │   │   └── ConfiguracionSistemaContext.tsx
│   │   ├── ui/
│   │   │   ├── Accordion.tsx
│   │   │   ├── Alert.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── BotonVerticalFiltros.tsx
│   │   │   ├── BotonVerticalMenu.tsx
│   │   │   ├── BreadCrumb.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── CheckBox.tsx
│   │   │   ├── ComboBox.tsx
│   │   │   ├── Command.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── DropDownMenu.tsx
│   │   │   └── encabezadoFormularios.tsx
│   │   ├── estilos.sidebar.css
│   │   ├── navbar.tsx
│   │   └── sidebarFiltros.tsx
│   ├── config/
│   │   ├── filtros-iniciales.ts
│   │   ├── paginacion.ts
│   │   └── versionamiento.ts
│   ├── context/
│   │   ├── cabecera-documento-provider.tsx
│   │   ├── catalogos-context.tsx
│   │   ├── filtros-componentes-context.tsx
│   │   └── filtros-contesxt.tsx
│   ├── hooks/
│   │   ├── use-paginacion.ts
│   │   └── useFiltrosIniciales.ts
│   ├── interfaces/
│   │   ├── generales/
│   │   ├── gestion-organizacion/
│   │   ├── gestion-producto/
│   │   └── gestion-usuario/
│   ├── pages/
│   │   ├── administracion-page.tsx
│   │   ├── dashboard-home.tsx
│   │   ├── home-page.tsx
│   │   └── login-page.tsx
│   └── utils/
│       ├── apiService.ts
│       ├── auth.ts
│       ├── axiosConfig.ts
│       ├── consultarEntidad.tsx
│       ├── crudFactory.ts
│       ├── entidad.tsx
│       ├── errores.ts
│       ├── modal-portal.tsx
│       ├── navigation-guard.ts
│       ├── PrivateRoute.tsx
│       ├── usuarioHelper.ts
│       └── Utils.ts
├── App.css
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
```

Las páginas utilizan los componentes reutilizables y se comunican con el backend mediante las configuraciones definidas en el proyecto.

---

## Instalación y ejecución

### Local

#### Requisitos previos

- Node.js
- npm

Instalar las dependencias:

```bash
npm install
```

Configurar el archivo `.env.development` con la URL del backend local:

```env
VITE_API_URL=http://localhost:3000/api
```

Ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

Vite mostrará en la terminal la URL local donde se encuentra disponible la aplicación.

---

### Despliegue

El frontend se encuentra desplegado utilizando **Render**.

Para generar la versión de producción se utiliza:

```bash
npm run build
```

En Render se configuró la siguiente variable de entorno:

```env
VITE_API_URL=https://proyecto1-back-1.onrender.com/api
```

Esta variable permite que el frontend desplegado se comunique con la API del backend.

---

## Testing / Pruebas Automatizadas

El proyecto cuenta con una suite completa de testing automatizado dividida en dos niveles:

### 1. Pruebas Unitarias y de Componentes (Vitest + React Testing Library)
Ubicadas en `src/**/*.test.{ts,tsx}`, verifican lógica pura, funciones de utilidad y componentes aislados en entorno `jsdom`:
* **Formateo y validaciones**: `fucion-formateo.test.ts` (precios con formato `1.234,56`, monedas ARS/USD, fechas, porcentajes y cantidades).
* **Autenticación y Helpers**: `auth.test.ts` (decodificación JWT, verificación de roles e identificadores).
* **Componentes UI**: `Button.test.tsx` (variantes, renderizado y estados deshabilitados).

### 2. Pruebas End-to-End / E2E (Playwright)
Ubicadas en la carpeta `e2e/`, simulan la interacción real del usuario navegando en un navegador Chromium real contra el servidor de desarrollo (`http://localhost:5173`):
* **Autenticación y Rutas**: `e2e/auth.spec.ts` (formulario de login, validación de credenciales/empresa, redirección de rutas protegidas sin token).
* **Navegación General**: `e2e/navigation.spec.ts` (carga inicial e integración de navegación).

---

## Scripts disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Generar build de producción
npm run lint         # Ejecutar ESLint
npm run preview      # Previsualizar el build de producción
npm test             # Ejecutar pruebas unitarias y de componentes (Vitest)
npm run test:watch   # Modo observador (watch) interactivo para pruebas unitarias
npm run test:e2e     # Ejecutar pruebas End-to-End (Playwright)
npm run test:e2e:ui  # Interfaz gráfica interactiva para depuración de pruebas E2E
```
