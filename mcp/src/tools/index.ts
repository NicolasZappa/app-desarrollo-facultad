import authTools from "./auth";
import categoryTools from "./categories";
import productTools from "./products";
import userTools from "./users";
import type { ToolDef } from "../tool-factory";

export default [
  ...authTools,
  ...categoryTools,
  ...productTools,
  ...userTools,
] as ToolDef[];
