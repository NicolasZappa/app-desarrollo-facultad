import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_products",
    description: "Lista productos con filtros y paginación",
    inputSchema: {
      name: z.string().optional(),
      orderBy: z.string().optional(),
      order: z.enum(["asc", "desc"]).optional(),
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(50).optional(),
    },
    handler: async (args: any) => api.get("/products", { params: args }),
  },
  {
    name: "get_product",
    description: "Obtiene un producto por su ID",
    inputSchema: { id: z.number().int() },
    handler: async ({ id }: any) => api.get(`/products/${id}`),
  },
  {
    name: "create_product",
    description: "Crea un nuevo producto (requiere rol Admin)",
    inputSchema: {
      name: z.string().min(2).max(100),
      price: z.number().positive(),
      stock: z.number().int().positive(),
      categoryId: z.number().int(),
    },
    handler: async (body: any) => api.post("/products", body),
  },
  {
    name: "update_product",
    description: "Actualiza un producto existente (requiere rol Admin)",
    inputSchema: {
      id: z.number().int(),
      name: z.string().min(2).max(100).optional(),
      price: z.number().positive().optional(),
      stock: z.number().int().positive().optional(),
      categoryId: z.number().int().optional(),
    },
    handler: async ({ id, ...body }: any) => api.put(`/products/${id}`, body),
  },
  {
    name: "delete_product",
    description: "Elimina un producto por su ID (requiere rol Admin)",
    inputSchema: { id: z.number().int() },
    handler: async ({ id }: any) => api.del(`/products/${id}`),
  },
] as ToolDef[];
