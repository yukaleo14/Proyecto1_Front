import { Column, TablaAGGrid } from "../../../herramientas/tablas/tabla-flexible-ag-grid";
import { ConsultarProducto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { ProductoActions } from "./producto-action";

interface Props {
  productos: ConsultarProducto[];
  columns: Column<ConsultarProducto>[];
  puedeAccionar: boolean;
  onEditar: (id: number) => void;
  onInfo: (id: number) => void;
  onHistorial: (id: number) => void;
  onMovimientosStock: (id: number) => void;
  onAjustarStock: (id: number) => void;
  onDelete: (id: number) => void;
}

// Este componente solo transporta los eventos de cada fila hasta los botones.
export function DatosTabla({
  productos,
  columns,
  puedeAccionar,
  onEditar,
  onInfo,
  onHistorial,
  onMovimientosStock,
  onAjustarStock,
  onDelete,
}: Props) {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <TablaAGGrid
        columns={columns}
        data={productos}
        actions={
          puedeAccionar
            ? (row) => (
                <ProductoActions
                  producto={row}
                  onEditar={onEditar}
                  onInfo={onInfo}
                  onHistorial={onHistorial}
                  onMovimientosStock={onMovimientosStock}
                  onAjustarStock={onAjustarStock}
                  onDelete={onDelete}
                />
              )
            : undefined
        }
        // The six current actions remain visible; future actions can scroll horizontally.
        actionsFlex={1.4}
        actionsScrollable
        rowHeight={55}
      />
    </div>
  );
}


