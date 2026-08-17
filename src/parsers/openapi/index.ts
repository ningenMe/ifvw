import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import type { InterfaceOperation } from "../../core/model.js";

const HTTP_METHODS = Object.values(OpenAPIV3.HttpMethods);

export async function parseOpenApi(specPath: string): Promise<InterfaceOperation[]> {
  const document = (await SwaggerParser.dereference(specPath)) as OpenAPIV3.Document;
  const operations: InterfaceOperation[] = [];

  for (const [path, pathItem] of Object.entries(document.paths ?? {})) {
    if (!pathItem) continue;

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (!operation) continue;

      operations.push({
        id: operation.operationId ?? `${method}_${path}`,
        action: method.toUpperCase(),
        target: path,
        description: operation.description ?? operation.summary,
        deprecated: operation.deprecated,
      });
    }
  }

  return operations;
}
