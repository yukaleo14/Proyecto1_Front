import { Package, PlusCircle, Search } from "lucide-react";
import { Button } from "../../../ui/Button";
import { CardHeader, CardTitle } from "../../../ui/Card";
import { Input } from "../../../ui/Input";
import { EstadisticasSimples } from "../../../herramientas/reutilizables/estadisticas-simples";
import { ImpresionForm } from "../../../herramientas/reutilizables/impresion-form";
import { puedeAgregarProducto } from "../domain/permisos-producto";

interface Props {
  roles: number[];
  onNuevo: () => void;
  total: number;
  mostrados: number;
  paginaActual: number;
  onImprimirTodo: () => void;
  onImprimirPagina: () => void;
  
  filtrosCatalogo: {
    denominacion: string;
    lineaNombre: string;
    superLineaNombre: string;
    };
  onChangeFiltrosCatalogo: (
    campo: "denominacion" | "lineaNombre" | "superLineaNombre",
    valor: string
    ) => void;
}

export function ProductosHeaderLg({
  roles,
  filtrosCatalogo,
  onChangeFiltrosCatalogo,
  onNuevo,
  total,
  mostrados,
  paginaActual,
  onImprimirTodo,
  onImprimirPagina,
}: Props) {
  return (
    <CardHeader className="flex flex-col md:flex-row gap-4 p-4">
      <div className="flex flex-col md:flex-row flex-wrap gap-4 w-full">
        <CardTitle className="flex items-center gap-2">
          <Package className="consultar-icon" />
          <span>Productos</span>
        </CardTitle>

        {/* Buscador */}
        <div className="flex flex-col md:flex-row flex-wrap gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={filtrosCatalogo.denominacion}
              placeholder="Denominación..."
              className="text-black pl-10"
              onChange={(e) =>
                onChangeFiltrosCatalogo("denominacion", e.target.value)
              }
            />
          </div>

          <div className="relative w-full md:w-44">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={filtrosCatalogo.lineaNombre}
              placeholder="Línea..."
              className="text-black pl-10"
              onChange={(e) =>
                onChangeFiltrosCatalogo("lineaNombre", e.target.value)
              }
            />
          </div>

          <div className="relative w-full md:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={filtrosCatalogo.superLineaNombre}
              placeholder="SuperLínea..."
              className="text-black pl-10"
              onChange={(e) =>
                onChangeFiltrosCatalogo("superLineaNombre", e.target.value)
              }
            />
          </div>
        </div>

      </div>
      {puedeAgregarProducto(roles) && (<Button className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1.5 px-3 py-2 rounded-lg shadow-sm"
        onClick={onNuevo}><PlusCircle className="h-4 w-4" /></Button>)}
      
      {/* Botón de agregar e impresion por el momento no lo mostramos en el celu */}
      {/* <div className="flex items-center justify-between gap-3">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1.5 px-3 py-2 rounded-lg shadow-sm"
          onClick={onNuevo}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
        
        <div className="flex-shrink-0">
          <ImpresionForm
            entityName="Presupuestos"
            onImprimirTodo={onImprimirTodo}
            onImprimirPagina={onImprimirPagina}
            totalItems={total}
            currentPage={paginaActual}
          />
        </div>
      </div> */}

    </CardHeader>
  );
}
