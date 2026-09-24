import { Producto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import InformacionAuditoria from "../../../herramientas/reutilizables/informacion-auditoria";
import RegistrarActualizarProductoForm from "../utils/registrar-actualizar-producto";
import HistorialPreciosModal from "../componentes/historial-precios-modal";
import MovimientosStockModal from "../componentes/movimientos-stock-modal";

interface Props {
  isAltaOpen: boolean;
  mostrarActualizarProducto: boolean;
  mostrarInfoAuditoria: boolean;
  mostrarMovimientosStock: boolean;
  mostrarHistorialPrecios: boolean;
  mostrarCambioPrecios: boolean;
  mostrarProductosAlternativos: boolean;
  mostrarDeQuienEsAlternativo: boolean;
  productoSeleccionado: Producto | null;
  productoInfo: any;
  auditoria: any;
  onCloseAlta: () => void;
  onCloseActualizar: () => void;
  onCloseAuditoria: () => void;
  onCloseMovimientosStock: () => void;
  onCloseHistorialPrecios: () => void;
  onCloseCambioPrecios: () => void;
  onCloseProductosAlternativos: () => void;
  onCloseDeQuienEsAlternativo: () => void;
  onSuccessAlta: (mensaje: string, producto?: Producto) => void;
  onSuccessActualizar: (mensaje: string) => void;
  onRefetch: () => void;
}

export function ProductosModales({
  isAltaOpen,
  mostrarActualizarProducto,
  mostrarInfoAuditoria,
  mostrarMovimientosStock,
  mostrarHistorialPrecios,
  productoSeleccionado,
  productoInfo,
  auditoria,
  onCloseAlta,
  onCloseActualizar,
  onCloseAuditoria,
  onCloseMovimientosStock,
  onCloseHistorialPrecios,
  onSuccessAlta,
  onSuccessActualizar,
}: Props) {
  return (
    <>
      {isAltaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <RegistrarActualizarProductoForm onClose={onCloseAlta} onSuccess={onSuccessAlta} />
        </div>
      )}

      {mostrarActualizarProducto && productoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <RegistrarActualizarProductoForm
            producto={productoSeleccionado}
            onClose={onCloseActualizar}
            onSuccess={onSuccessActualizar}
          />
        </div>
      )}

      {mostrarInfoAuditoria && auditoria && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <InformacionAuditoria auditoria={auditoria} onClose={onCloseAuditoria} />
        </div>
      )}

      {mostrarHistorialPrecios && productoInfo && (
        <HistorialPreciosModal producto={productoInfo as Producto} onClose={onCloseHistorialPrecios} />
      )}

      {/* Tarjeta 20: este estado ya existía; ahora renderiza el historial real de stock. */}
      {mostrarMovimientosStock && productoInfo && (
        <MovimientosStockModal producto={productoInfo as Producto} onClose={onCloseMovimientosStock} />
      )}
    </>
  );
}

