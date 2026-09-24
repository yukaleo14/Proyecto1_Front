// Describe los datos planos que devuelve el back para trazabilidad de stock.
// La respuesta no incluye el objeto Producto para evitar referencias circulares.
export type TipoMovimientoStock =
  | "Compra"
  | "Venta"
  | "Devolución de cliente"
  | "Devolución a proveedor"
  | "Ajuste";

export interface MovimientoStock {
  id: number;
  productoId: number;
  tipoMovimiento: TipoMovimientoStock;
  cantidad: number;
  fecha: string;
  motivo: string | null;
}

export interface ResultadoAjusteStock {
  nuevoStock: number;
  stockAnterior: number;
  alertaStockBajo: boolean;
  movimiento: MovimientoStock;
}

