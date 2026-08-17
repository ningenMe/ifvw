export interface UnifiedInterfaceModel {
  operations: InterfaceOperation[];
}

export interface InterfaceOperation {
  id: string;
  action: string;
  target: string;
  description?: string;
  deprecated?: boolean;
}
