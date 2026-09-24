import { useState } from "react";
import { PackagePlus, X } from "lucide-react";
import { Button } from "../../../ui/Button";
import { Card, CardContent, CardHeader } from "../../../ui/Card";
import ProductoService from "../services/producto-service";
import type { Producto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import type { ResultadoAjusteStock } from "../../../../interfaces/gestion-producto/stock/interfaces-stock";
import { parseApiError } from "../../../../utils/errores";

interface Props {
  producto: Producto;
  onClose: () => void;
  onSuccess: (resultado: ResultadoAjusteStock) => Promise<void> | void;
}

// Tarjeta 20: el ajuste recibe una diferencia (+/-), nunca reemplaza el stock manualmente.
export default function AjustarStockModal({ producto, onClose, onSuccess }: Props) {
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    const cantidadNumerica = Number(cantidad);

    // Estas validaciones evitan enviar ajustes sin sentido al dominio.
    if (!Number.isFinite(cantidadNumerica) || cantidad.trim() === "" || cantidadNumerica === 0) {
      setError("La cantidad del ajuste debe ser distinta de cero.");
      return;
    }

    if (!motivo.trim()) {
      setError("Debe ingresar un motivo para el ajuste de stock.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const resultado = await ProductoService.ajustarStock(
        producto.id,
        cantidadNumerica,
        motivo.trim(),
      );

      await onSuccess(resultado);
    } catch (error) {
      setError(parseApiError(error));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg bg-white">
        <CardHeader className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PackagePlus className="text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold">Ajustar stock</h2>
              <p className="text-sm text-gray-500">{producto.denominacion}</p>
            </div>
          </div>
          <Button type="button" variant="ghost" title="Cerrar" onClick={onClose}>
            <X size={18} />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Explica el efecto del ajuste antes de que la persona ingrese datos. */}
          <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
            <p className="font-semibold">¿Para qué sirve este ajuste?</p>
            <p className="mt-1">
              Corrige el stock después de una rotura, pérdida, error de carga o inventario físico.
              El cambio quedará registrado en el historial del producto.
            </p>
            <ul className="mt-2 list-inside list-disc">
              <li><strong>Positivo:</strong> suma unidades al stock.</li>
              <li><strong>Negativo:</strong> descuenta unidades del stock.</li>
              <li>El motivo es obligatorio para mantener la trazabilidad.</li>
            </ul>
          </div>
          <p className="rounded-md bg-slate-100 p-3 text-sm text-slate-700">
            Stock actual: <strong>{producto.stock ?? 0}</strong>
          </p>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Cantidad de ajuste
            <input
              type="number"
              step="1"
              value={cantidad}
              onChange={(event) => setCantidad(event.target.value)}
              placeholder="Ej.: -2 para rotura o 5 para sumar"
              className="rounded-md border border-slate-300 px-3 py-2 font-normal"
            />
            <span className="font-normal text-slate-500">
              Un valor positivo suma stock y uno negativo lo descuenta.
            </span>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Motivo
            <textarea
              value={motivo}
              onChange={(event) => setMotivo(event.target.value)}
              placeholder="Ej.: Rotura de mercadería"
              rows={3}
              className="rounded-md border border-slate-300 px-3 py-2 font-normal"
            />
          </label>

          {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="button" onClick={guardar} disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar ajuste"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


