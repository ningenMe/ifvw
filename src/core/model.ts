export interface UnifiedApiModel {
  service: string;
  operations: ApiOperation[];
  schemas: Record<string, ApiSchema>;
}

export interface ApiOperation {
  id: string;
  method: string;
  path: string;
  summary?: string;
  description?: string;
  deprecated?: boolean;
  parameters: ApiParameter[];
  requestBody?: ApiRequestBody;
  responses: ApiResponse[];
}

export interface ApiParameter {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  required: boolean;
  description?: string;
  schema: ApiSchema;
}

export interface ApiRequestBody {
  description?: string;
  required: boolean;
  content: ApiMediaType[];
}

export interface ApiResponse {
  status: string;
  description?: string;
  content: ApiMediaType[];
}

export interface ApiMediaType {
  mediaType: string;
  schema: ApiSchema;
}

// A named schema is stored once in UnifiedApiModel.schemas and pointed to via
// { type: "ref", name } everywhere it's reused, mirroring OpenAPI's components/schemas.
export type ApiSchema =
  | { type: "string"; enum?: string[]; format?: string; example?: unknown }
  | { type: "number" | "integer"; enum?: number[]; format?: string; example?: unknown }
  | { type: "boolean"; example?: unknown }
  | { type: "array"; items: ApiSchema }
  | { type: "object"; properties: Record<string, ApiSchema>; required: string[] }
  | { type: "ref"; name: string }
  | { type: "unknown" };
