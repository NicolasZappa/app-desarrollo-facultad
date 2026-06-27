# App Desarrollo — Práctico Final

Aplicación full-stack con backend NestJS (API REST + JWT), frontend Angular, PostgreSQL con TypeORM, verificación de emails mediante **Ethereal**, y un servidor MCP que expone la API como herramientas para asistentes AI.

---

## Requisitos

- **Node.js 20+**
- **npm**
- **Docker** (para PostgreSQL)

---

## 1. Backend (`back/`)

```bash
cp back/.env.example back/.env
```

Editar `back/.env` con los siguientes valores:

| Variable | Descripción |
|---|---|
| `BCRYPT_COST` | Costo de hashing (ej: `10`) |
| `JWT_SECRET` | Clave secreta para firmar tokens |
| `JWT_EXPIRES_IN` | Expiración del JWT (ej: `1d`) |
| `DB_HOST` | `localhost` |
| `DB_PORT` | `5433` (puerto mapeado por docker-compose) |
| `DB_USERNAME` | `postgres` |
| `DB_PASSWORD` | `postgres` |
| `DB_NAME` | `practico_final` |
| `SMTP_*` | Credenciales de Ethereal (ver abajo) |

### Configurar Ethereal (emails de prueba)

1. Ir a [https://ethereal.email](https://ethereal.email)
2. Crear una cuenta (botón **Create Ethereal Account**)
3. Copiar los datos SMTP generados (host, port, user, pass, from) y pegarlos en `back/.env`
4. Los emails enviados en desarrollo se verán en la bandeja de entrada de esa misma página

### Iniciar PostgreSQL y backend

```bash
docker compose up -d          # levanta PostgreSQL en puerto 5433
cd back && npm install && npm run start:dev
```

El backend queda disponible en `http://localhost:3000`.

---

## 2. Frontend (`front/`)

```bash
cd front && npm install && npm start
```

Abrir `http://localhost:4200`.

---

## 3. Servidor MCP (`mcp/`)

El servidor MCP (Model Context Protocol) expone la API como herramientas que pueden ser consumidas por asistentes AI compatibles (opencode, Claude Desktop, etc.). Ya está configurado en `opencode.json` y se ejecuta automáticamente al usar el proyecto con opencode. También puede ejecutarse manualmente:

```bash
npx tsx mcp/src/index.ts
```

### Herramientas disponibles

| Categoría | Herramienta | Descripción | Requiere Auth |
|---|---|---|---|
| **Auth** | `auth_login` | Inicia sesión y guarda el token JWT | No |
| | `auth_register` | Registra un nuevo usuario | No |
| | `auth_me` | Obtiene datos del usuario autenticado | Sí |
| | `delete_my_account` | Elimina la cuenta del usuario autenticado | Sí |
| **Productos** | `list_products` | Lista productos con filtros y paginación | No |
| | `get_product` | Obtiene un producto por ID | No |
| | `create_product` | Crea un nuevo producto | Admin |
| | `update_product` | Actualiza un producto | Admin |
| | `delete_product` | Elimina un producto | Admin |
| **Categorías** | `list_categories` | Lista todas las categorías | No |
| | `get_category` | Obtiene una categoría por ID | No |
| | `create_category` | Crea una nueva categoría | Admin |
| | `update_category` | Actualiza una categoría | Admin |
| | `delete_category` | Elimina una categoría | Admin |
| **Usuarios** | `list_users` | Lista todos los usuarios | Admin |
| | `update_user_role` | Cambia el rol de un usuario | Admin |
| | `update_my_password` | Cambia la contraseña del usuario autenticado | Sí |
| | `update_my_email` | Cambia el email del usuario autenticado | Sí |

---

## 4. Flujo de uso típico

1. Iniciar backend y frontend
2. Registrarse desde la web (`/register`)
3. Ir a [https://ethereal.email](https://ethereal.email) → ver la bandeja de entrada → abrir el email de verificación
4. Seguir el link para verificar el email
5. Iniciar sesión (`/login`)
6. Explorar funcionalidades: productos, categorías, perfil, etc.
7. **Para probar funciones Admin**: crear un segundo usuario desde la web, luego usar la herramienta `update_user_role` del MCP server para asignarle rol `Admin`, o bien modificar el rol directamente en la base de datos
