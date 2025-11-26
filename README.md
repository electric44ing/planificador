# Planificador de Tareas Kanban

## 1. Objetivo del Proyecto

El objetivo de este proyecto es desarrollar una aplicación web completa y funcional para la planificación de tareas, diseñada específicamente para una empresa de servicios eléctricos. La aplicación se presenta como un tablero Kanban interactivo que permite a los usuarios gestionar el ciclo de vida de las tareas de forma visual e intuitiva.

Las funcionalidades clave incluyen:
- **Tablero Kanban:** Columnas visuales que representan los diferentes estados de una tarea ("Sin Planificar", "Pendiente", "En Progreso", "Completada").
- **Gestión de Tareas (CRUD):** Creación, edición y eliminación de tareas a través de un modal interactivo.
- **Funcionalidad Drag-and-Drop:** Permite mover tareas entre columnas para cambiar su estado de forma fluida.
- **Detalle de Tareas:** Cada tarea contiene un título, descripción, responsable, fechas de inicio/fin, y una categoría.
- **Registro de Acciones:** Cada tarea tiene un historial cronológico de "acciones" o eventos para seguir su progreso en detalle.
- **Persistencia de Datos:** Toda la información se guarda de forma permanente en una base de datos.

## 2. Stack Tecnológico

Este proyecto utiliza un stack moderno basado en JavaScript/TypeScript para ofrecer una experiencia de desarrollo y de usuario de alto nivel.

- **Framework Principal:** **Next.js** (con React) - Utilizado para construir la aplicación full-stack, gestionando tanto el frontend como el backend (API).
- **Lenguaje:** **TypeScript** - Para un código más robusto, seguro y mantenible.
- **Base de Datos:** **PostgreSQL** - Alojada en **Neon**, una plataforma de PostgreSQL serverless.
- **ORM (Object-Relational Mapper):** **Prisma** - Facilita la comunicación entre nuestra API y la base de datos de una manera type-safe.
- **Estilos:** **Tailwind CSS** - Para un diseño rápido, moderno y totalmente responsivo.
- **Drag and Drop:** **dnd-kit** - Una librería de arrastrar y soltar moderna y de alto rendimiento para React.

## 3. Arquitectura y Estructura del Proyecto

La aplicación sigue una arquitectura full-stack monolítica aprovechando las características del **App Router** de Next.js.

### Flujo de Datos
1.  **Carga Inicial:** La página principal (`page.tsx`) actúa como un **Server Component**. Obtiene los datos iniciales de las tareas directamente desde la API en el servidor.
2.  **Renderizado del Cliente:** Los datos se pasan como propiedades al componente principal del tablero (`Board.tsx`), que es un **Client Component** y maneja toda la interactividad del usuario.
3.  **Interacciones del Usuario:** Cualquier acción del usuario (crear, mover, editar una tarea) desencadena una llamada a nuestra API REST interna (ubicada en `src/app/api/`).
4.  **Lógica de Backend:** Las rutas de la API utilizan el **Cliente de Prisma** para ejecutar operaciones (CRUD) contra la base de datos PostgreSQL en Neon.
5.  **Actualización de la UI:** La interfaz de usuario se actualiza de forma "optimista" para dar una sensación de inmediatez, y luego se sincroniza con la respuesta de la API.

### Estructura de Carpetas
```
/
├── prisma/
│   ├── schema.prisma       # Definición de los modelos y la conexión a la BD.
│   └── migrations/         # Historial de migraciones de la base de datos.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── tasks/      # Rutas de la API para las operaciones CRUD de tareas.
│   │   ├── layout.tsx      # Layout principal de la aplicación.
│   │   └── page.tsx        # Página principal (Server Component).
│   ├── components/
│   │   ├── Board.tsx       # Componente principal que renderiza el tablero.
│   │   ├── Column.tsx      # Componente para una columna del tablero.
│   │   ├── TaskCard.tsx    # Componente para una tarjeta de tarea.
│   │   └── TaskModal.tsx   # Modal para crear y editar tareas.
│   ├── lib/
│   │   ├── formatters.ts   # Funciones de utilidad (ej: formatear fechas).
│   │   └── prisma.ts       # Instancia única del cliente de Prisma.
│   └── types.ts            # Definiciones centrales de tipos de TypeScript.
├── .env                    # Archivo para variables de entorno (DATABASE_URL).
├── .gitignore              # Archivos y carpetas ignorados por Git.
└── README.md               # Este archivo.
```

## 4. Configuración y Puesta en Marcha

Para ejecutar este proyecto en un entorno de desarrollo local, sigue estos pasos:

1.  **Clonar el Repositorio:**
    ```bash
    # git clone <url-del-repositorio>
    # cd <nombre-del-repositorio>
    ```

2.  **Crear el Archivo de Entorno:**
    - Crea un archivo llamado `.env` en la raíz del proyecto.
    - Añade tu URL de conexión de Neon:
      ```
      DATABASE_URL="postgres://user:password@host.neon.tech/dbname?sslmode=require"
      ```

3.  **Instalar Dependencias:**
    ```bash
    npm install
    ```

4.  **Ejecutar la Migración de la Base de Datos:**
    Este comando creará las tablas en tu base de datos de Neon según el `schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```

5.  **Iniciar el Servidor de Desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:3000`.
