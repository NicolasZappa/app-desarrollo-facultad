import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_users",
    description: "Obtiene la lista de todos los usuarios (requiere rol Admin)",
    handler: async () => api.get("/users"),
  },
] as ToolDef[];
