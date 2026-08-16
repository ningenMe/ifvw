export interface UnifiedInterfaceModel {
  service: string;
  operations: InterfaceOperation[];
}

export interface InterfaceOperation {
  id: string;
  method: string;
  path: string;
  description?: string;
  deprecated?: boolean;
}
