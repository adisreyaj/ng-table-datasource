export interface SortChangeEvent {
  column: string;
  direction: SortDirection;
}

export type SortDirection = 'asc' | 'desc' | null;
