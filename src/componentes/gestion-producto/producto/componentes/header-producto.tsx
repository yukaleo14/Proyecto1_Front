import { Package, PlusCircle, Search } from "lucide-react";
import { Button } from "../../../ui/Button";
import { CardHeader, CardTitle } from "../../../ui/Card";
import { Input } from "../../../ui/Input";
import { EstadisticasSimples } from "../../../herramientas/reutilizables/estadisticas-simples";
import { ImpresionForm } from "../../../herramientas/reutilizables/impresion-form";
import { puedeAgregarProducto } from "../domain/permisos-producto";

interface Props {
  roles:number[];
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

export function ProductosHeader({
  roles,
  onNuevo,
  total,
  mostrados,
  paginaActual,
  onImprimirTodo,
  onImprimirPagina,
  filtrosCatalogo,
  onChangeFiltrosCatalogo,
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
            value={filtrosCatalogo.denominacion} //Muestra el texto actual guardado en el estado.
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

        <EstadisticasSimples filtrados={total} mostrados={mostrados} />
      </div>

      <div className="flex gap-2">
        <ImpresionForm
          entityName="Productos"
          onImprimirTodo={onImprimirTodo}
          onImprimirPagina={onImprimirPagina}
          totalItems={total}
          currentPage={paginaActual}
        />
        {puedeAgregarProducto(roles) && (
           <Button onClick={onNuevo} className="bg-blue-500 hover:bg-blue-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir
        </Button>
        )}
      </div>
    </CardHeader>
  );
}
