// Placeholder shape; full design in issue/004-define-unified-api-model.md
export interface UnifiedApiModel {
  service: string;
  endpoints: UnifiedApiEndpoint[];
}

export interface UnifiedApiEndpoint {
  method: string;
  path: string;
  description?: string;
}
