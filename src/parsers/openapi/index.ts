import type { UnifiedApiModel } from "../../core/model.js";

// Placeholder; real OpenAPI -> UnifiedApiModel mapping lands in issue/005-implement-openapi-parser.md
export async function parseOpenApi(_specUrl: string): Promise<UnifiedApiModel> {
  throw new Error("not implemented yet (see issue/005-implement-openapi-parser.md)");
}
