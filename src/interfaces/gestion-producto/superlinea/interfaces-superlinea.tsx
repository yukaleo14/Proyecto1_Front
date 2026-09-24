export interface SuperLinea {
  id: number;
  nombre: string;
  descripcion?: string | null;
  sistema: number;
  deletedAt?: string | null;
}

export interface SuperLineaFormValues {
  nombre: string;
  descripcion?: string;
}
