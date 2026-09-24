import {
  ClipboardList,
  History,
  Info,
  PackagePlus,
  Pencil,
  Trash,
} from "lucide-react";
import type { ConsultarProducto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { ActionButton } from "../../../herramientas/reutilizables/action-button";

interface Props {
  producto: ConsultarProducto;
  onEditar: (id: number) => void;
  onInfo: (id: number) => void;
  onDelete: (id: number) => void;
  onHistorial: (id: number) => void;
  onMovimientosStock: (id: number) => void;
  onAjustarStock: (id: number) => void;
  compact?: boolean;
}

// Tarjeta 20: cada botón abre una acción distinta; ajustar no reemplaza al historial.
export function ProductoActions({
  producto,
  onEditar,
  onInfo,
  onHistorial,
  onMovimientosStock,
  onAjustarStock,
  onDelete,
  compact = false,
}: Props) {
  return (
    <div className={`flex min-w-max flex-nowrap items-center gap-1 pr-2 ${compact ? "justify-end" : ""}`}>
      <ActionButton variant="info" className="h-10 w-10" title="Ver información" onClick={() => onInfo(producto.id)}>
        <Info size={20} />
      </ActionButton>

      <ActionButton variant="info" className="h-10 w-10" title="Ver historial de precios" onClick={() => onHistorial(producto.id)}>
        <History size={20} />
      </ActionButton>

      <ActionButton variant="info" className="h-10 w-10" title="Ver movimientos de stock" onClick={() => onMovimientosStock(producto.id)}>
        <ClipboardList size={20} />
      </ActionButton>

      <ActionButton variant="edit" className="h-10 w-10" title="Ajustar stock" onClick={() => onAjustarStock(producto.id)}>
        <PackagePlus size={20} />
      </ActionButton>

      <ActionButton variant="edit" className="h-10 w-10" title="Editar producto" onClick={() => onEditar(producto.id)}>
        <Pencil size={20} />
      </ActionButton>

      <ActionButton variant="delete" className="h-10 w-10" title="Eliminar producto" onClick={() => onDelete(producto.id)}>
        <Trash size={20} />
      </ActionButton>
    </div>
  );
}



