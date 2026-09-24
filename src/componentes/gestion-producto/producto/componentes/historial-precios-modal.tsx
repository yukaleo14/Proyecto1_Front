//tar 15, Este componente hace cuatro cosas:
//- Abre un modal.
//- Consulta el endpoint al abrirse.
//- Ordena por fecha descendente.
//- Muestra los criterios de aceptación: fecha, precio anterior, precio nuevo y motivo.

import { useEffect, useState } from "react";
import { History, X } from "lucide-react";
import { Button } from "../../../ui/Button";
import { Card, CardContent, CardHeader } from "../../../ui/Card";
import ProductoService from "../services/producto-service";
import type { Producto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import type { HistorialPrecioProducto } from "../../../../interfaces/gestion-producto/historial-precios/interfaces-historial-precios";
import { parseApiError } from "../../../../utils/errores";

interface Props {
  producto: Producto;
  onClose: () => void;
}

const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
});

const formatoFecha = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default function HistorialPreciosModal({
  producto,
  onClose,
}: Props) {
  const [historial, setHistorial] = useState<HistorialPrecioProducto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        setCargando(true);
        setError("");

        const respuesta = await ProductoService.obtenerHistorialPrecios(
          producto.id
        );

        const ordenado = [...respuesta].sort(
          (a, b) =>
            new Date(b.fechaHora).getTime() -
            new Date(a.fechaHora).getTime()
        );

        setHistorial(ordenado);
      } catch (error) {
        setError(parseApiError(error));
      } finally {
        setCargando(false);
      }
    };

    cargarHistorial();
  }, [producto.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-5xl bg-white">
        <CardHeader className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <History className="text-blue-600" />

            <div>
              <h2 className="text-lg font-semibold">
                Historial de precios
              </h2>

              <p className="text-sm text-gray-500">
                {producto.denominacion}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            title="Cerrar"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {cargando && (
            <p className="p-6 text-center text-gray-600">
              Cargando historial de precios...
            </p>
          )}

          {error && (
            <p className="m-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
              {error}
            </p>
          )}

          {!cargando && !error && historial.length === 0 && (
            <p className="p-6 text-center text-gray-600">
              Este producto todavía no tiene cambios de precio registrados.
            </p>
          )}

          {!cargando && !error && historial.length > 0 && (
            <div className="max-h-[60vh] overflow-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-sky-100">
                  <tr>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Precio anterior</th>
                    <th className="p-3">Precio nuevo</th>
                    <th className="p-3">Operación</th>
                    <th className="p-3">Motivo</th>
                  </tr>
                </thead>

                <tbody>
                  {historial.map((registro) => (
                    <tr key={registro.id} className="border-t">
                      <td className="p-3">
                        {formatoFecha.format(
                          new Date(registro.fechaHora)
                        )}
                      </td>

                      <td className="p-3">
                        {registro.precioAnterior === null
                          ? "—"
                          : formatoMoneda.format(
                              Number(registro.precioAnterior)
                            )}
                      </td>

                      <td className="p-3 font-medium">
                        {formatoMoneda.format(
                          Number(registro.precioNuevo)
                        )}
                      </td>

                      <td className="p-3">
                        {registro.tipoOperacion}
                      </td>

                      <td className="p-3">
                        {registro.motivo || "Sin motivo informado"}
                      </td>
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