import { useEffect, useState } from "react";
import { ClipboardList, X } from "lucide-react";
import { Button } from "../../../ui/Button";
import { Card, CardContent, CardHeader } from "../../../ui/Card";
import ProductoService from "../services/producto-service";
import type { Producto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import type { MovimientoStock } from "../../../../interfaces/gestion-producto/stock/interfaces-stock";
import { parseApiError } from "../../../../utils/errores";

interface Props {
  producto: Producto;
  onClose: () => void;
}

const formatoFecha = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

// Tarjeta 20: consulta la trazabilidad; el stock actual no alcanza para saber por qué cambió.
export default function MovimientosStockModal({ producto, onClose }: Props) {
  const [movimientos, setMovimientos] = useState<MovimientoStock[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarMovimientos = async () => {
      try {
        setCargando(true);
        setError("");
        const respuesta = await ProductoService.obtenerMovimientosStock(producto.id);

        // El back ya los devuelve ordenados, pero el front conserva la regla visual.
        setMovimientos(
          [...respuesta].sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
          ),
        );
      } catch (error) {
        setError(parseApiError(error));
      } finally {
        setCargando(false);
      }
    };

    cargarMovimientos();
  }, [producto.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-5xl bg-white">
        <CardHeader className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ClipboardList className="text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold">Movimientos de stock</h2>
              <p className="text-sm text-gray-500">{producto.denominacion}</p>
            </div>
          </div>
          <Button type="button" variant="ghost" title="Cerrar" onClick={onClose}>
            <X size={18} />
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {cargando && <p className="p-6 text-center text-gray-600">Cargando movimientos...</p>}
          {error && <p className="m-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">{error}</p>}

          {!cargando && !error && movimientos.length === 0 && (
            <p className="p-6 text-center text-gray-600">
              Este producto todavía no tiene movimientos de stock registrados.
            </p>
          )}

          {!cargando && !error && movimientos.length > 0 && (
            <div className="max-h-[60vh] overflow-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-sky-100">
                  <tr>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Tipo</th>
                    <th className="p-3">Cantidad</th>
                    <th className="p-3">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.map((movimiento) => (
                    <tr key={movimiento.id} className="border-t">
                      <td className="p-3">{formatoFecha.format(new Date(movimiento.fecha))}</td>
                      <td className="p-3">{movimiento.tipoMovimiento}</td>
                      <td className={`p-3 font-medium ${movimiento.cantidad > 0 ? "text-green-600" : "text-red-600"}`}>
                        {movimiento.cantidad > 0 ? "+" : ""}{movimiento.cantidad}
                      </td>
                      <td className="p-3">{movimiento.motivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

