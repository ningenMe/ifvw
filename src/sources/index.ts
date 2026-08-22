import { readFileSync } from "node:fs";
import { load } from "js-yaml";
import type { InterfaceOperation } from "../core/model.js";
import { parseOpenApi } from "../parsers/openapi/index.js";

export interface Source {
  name: string;
  type: "openapi";
  url: string;
}

export function loadSources(configPath: string): Source[] {
  const content = readFileSync(configPath, "utf-8");
  const parsed = load(content) as { sources?: unknown };

  if (!Array.isArray(parsed.sources)) {
    throw new Error(`${configPath}: expected a top-level "sources" array`);
  }

  return parsed.sources as Source[];
}

export interface SourceResult {
  name: string;
  operations: InterfaceOperation[];
}

export interface SourceError {
  name: string;
  error: Error;
}

export async function fetchSources(
  sources: Source[],
): Promise<{ results: SourceResult[]; errors: SourceError[] }> {
  const results: SourceResult[] = [];
  const errors: SourceError[] = [];

  for (const source of sources) {
    try {
      const operations = await parseOpenApi(source.url);
      results.push({ name: source.name, operations });
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      errors.push({ name: source.name, error });
    }
  }

  return { results, errors };
}
