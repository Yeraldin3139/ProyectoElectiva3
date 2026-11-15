# Somos Colón · Sombreros artesanales

Tienda web de **Somos Colón**, sombrerería de Colón (Génova), Nariño: vueltiaos, vaqueros y
bosalinos. Hecha con **Angular 21** y **PrimeNG 21**.

**Proyecto desarrollado por Yeraldin Araujo.**

## Cómo ejecutarlo

Requisitos: Node.js 22 o 24 (LTS). No hace falta instalar Angular CLI global.

```bash
npm ci        # instala las dependencias exactas (incluye PrimeNG)
npm start     # abre http://localhost:4200
```

Otros comandos:

```bash
npm run build   # compilación de producción en dist/
npm test        # pruebas unitarias (Vitest)
```

> En Windows, si PowerShell muestra *"la ejecución de scripts está deshabilitada"*, usa CMD o ejecuta
> una vez: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

## Páginas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Inicio | Público |
| `/catalogo` | Catálogo con filtros por estilo y tono, y búsqueda (`?estilo=`, `?tono=`, `?q=`) | Público |
| `/producto/:id` | Detalle con galería de fotos | Público |
| `/disena` | Diseña tu sombrero | Público |
| `/login` | Ingresar | Público |
| `/tareas` | Panel: tareas del taller (componentes padre e hijo) | Con sesión |
| `/pendientes` | Panel: pendientes (un solo componente) | Con sesión |

**Acceso al panel:** usuario `Yeraldin`. La clave la entrega la autora; en el código solo se guarda su
huella SHA-256 (`src/app/auth/auth.service.ts`). Tras 5 intentos fallidos el ingreso se bloquea 30 s.
Es un inicio de sesión del lado del navegador, pensado para el proyecto de clase: en un sistema real
la validación debe hacerse en un servidor.

## Temas de Book Angular dentro de la tienda

| Clase | Tema | Dónde se usa |
|---|---|---|
| 3 | Componentes, rutas, `*ngFor`, eventos y propiedades | Encabezado (búsqueda con `(input)`, `(submit)`, `(keydown.escape)`), inicio (`*ngFor`, `[src]`), pie de página, rutas en `app.routes.ts` |
| 4a | Implementación de Todos (signals + localStorage) | Pendientes (`todo-list`, `services/todo.service.ts`) |
| 4b | Evento check y `[ngClass]` | Pendientes (`onChangeCompleted`, `setColorPriority`) y filtros |
| 5a | Formularios reactivos con `FormControl` | Diseña tu sombrero (`nameCtrl`, `colorCtrl`, `widthCtrl`) |
| 5b | Formularios con `FormBuilder` | Pendientes (`todoForm`), Ingresar (`login`) |
| 5c | Manejo de componentes | Tareas (`pages/task-list`, `domain/tasks/*`) |
| 6 | Creación de componentes (`@Input`) | `item-task`, `form-tasks` |
| 6b | Comunicación de componentes (`@Output`) | `item-task` → `eliminarTarea`, `editarTarea`, `cambiarEstado`; `form-tasks` → `guardarTarea`; catálogo: `filter-bar` → `filterChanged`, `product-grid` → `limpiar` |

## PrimeNG

Tema Aura con la paleta marrón de la marca (`src/app/theme.ts`) y textos en español. Componentes
usados: Button, InputText, Password, Select, SelectButton, DatePicker, Textarea, Checkbox, Slider,
Tag, Chip, Galleria, Breadcrumb, Toast, Message, IconField y PrimeIcons.

## Estructura principal

```
src/app/
├── auth/                 Login: servicio, guard y SHA-256
├── catalog/              Catálogo (padre de filter-bar y product-grid)
├── domain/tasks/
│   ├── form-tasks/       Hijo: formulario de tareas
│   └── item-task/        Hijo: tarjeta de tarea
├── filter-bar/           Filtros del catálogo
├── footer/  header/      Pie y encabezado
├── models/               product.model.ts, todo.model.ts
├── pages/
│   ├── hat-designer/     Diseña tu sombrero
│   ├── home/             Inicio
│   ├── login/            Ingresar
│   └── task-list/        Panel: tareas del taller
├── product-detail/       Detalle con galería
├── product-grid/         Grilla de sombreros
├── services/             product.service.ts, todo.service.ts
├── todo-list/            Panel: pendientes
└── theme.ts              Tema de PrimeNG
public/sombreros/         Fotos de los sombreros (WebP)
```
