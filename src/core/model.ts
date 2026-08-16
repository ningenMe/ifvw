// Protocol-to-model mapping is validated in docs/unified-interface-model.md before changing this shape.
export interface UnifiedInterfaceModel {
  service: string;
  operations: InterfaceOperation[];
  schemas: Record<string, InterfaceSchema>;
}

export interface InterfaceOperation {
  id: string;
  action: string;
  target: string;
  summary?: string;
  description?: string;
  deprecated?: boolean;
  parameters: InterfaceParameter[];
  requestBody?: InterfaceRequestBody;
  responses: InterfaceResponse[];
}

export interface InterfaceParameter {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  required: boolean;
  description?: string;
  schema: InterfaceSchema;
}

export interface InterfaceRequestBody {
  description?: string;
  required: boolean;
  content: InterfaceMediaType[];
}

export interface InterfaceResponse {
  status?: string;
  description?: string;
  content: InterfaceMediaType[];
}

export interface InterfaceMediaType {
  mediaType: string;
  schema: InterfaceSchema;
}

// A named schema is stored once in UnifiedInterfaceModel.schemas and pointed to via
// { type: "ref", name } everywhere it's reused, mirroring OpenAPI's components/schemas.
export type InterfaceSchema =
  | { type: "string"; enum?: string[]; format?: string; example?: unknown }
  | { type: "number" | "integer"; enum?: number[]; format?: string; example?: unknown }
  | { type: "boolean"; example?: unknown }
  | { type: "array"; items: InterfaceSchema }
  | { type: "object"; properties: Record<string, InterfaceSchema>; required: string[] }
  | { type: "ref"; name: string }
  | { type: "unknown" };
