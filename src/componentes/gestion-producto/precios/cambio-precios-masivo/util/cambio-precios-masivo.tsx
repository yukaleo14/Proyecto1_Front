import { useEffect, useMemo, useState } from "react";
import ProductoService from "../../../producto/services/producto-service";
import SuperLineaService from "../../../superlinea/services/superlinea-service";
import { getUsuarioId } from "../../../../../utils/auth";
import type { SelectLinea } from "../../../../../interfaces/gestion-producto/linea/interfaces-linea";
import type { SuperLinea } from "../../../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";

type Alcance = "global" | "linea" | "super-linea";

interface PrecioProyectado {
  productoId: number;
  denominacion: string;
  lineaId: number;
  superLineaId: number;
  precioActual: number;
  precioProyectado: number;
}

const formatearPrecio = (precio: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(Number(precio));

// Tarjeta 12: muestra una vista previa antes de modificar los precios.
export default function CambioPreciosMasivo() {
  const [alcance, setAlcance] = useState<Alcance>("global");
  const [valor, setValor] = useState("");
  const [lineas, setLineas] = useState<SelectLinea[]>([]);
  const [superLineas, setSuperLineas] = useState<SuperLinea[]>([]);
  const [entidadId, setEntidadId] = useState<number | undefined>();
  const [vistaPrevia, setVistaPrevia] = useState<PrecioProyectado[]>([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [cargandoVistaPrevia, setCargandoVistaPrevia] = useState(false);
  const [aplicando, setAplicando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const usuarioId = getUsuarioId();
  const usaPorcentaje = alcance === "global" || alcance === "super-linea";
  const productosInvalidos = useMemo(
    () => vistaPrevia.filter((producto) => Number(producto.precioProyectado) <= 0),
    [vistaPrevia],
  );

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        setCargandoCatalogos(true);
        const [respuestaLineas, respuestaSuperLineas] = await Promise.all([
          ProductoService.obtenerTotales({ denominacion: "" }, "lineas"),
          SuperLineaService.obtenerTodas(),
        ]);
        setLineas(respuestaLineas.data ?? []);
        setSuperLineas(respuestaSuperLineas ?? []);
      } catch {
        setError("No se pudieron cargar las líneas y SuperLíneas.");
      } finally {
        setCargandoCatalogos(false);
      }
    };

    cargarCatalogos();
  }, []);

  const cambiarAlcance = (nuevoAlcance: Alcance) => {
    setAlcance(nuevoAlcance);
    setEntidadId(undefined);
    setVistaPrevia([]);
    setError(null);
    setMensaje(null);
  };

  const validarDatos = (): number | null => {
    const valorNumerico = Number(valor);

    if (!Number.isFinite(valorNumerico) || valor.trim() === "") {
      setError("Debe ingresar un valor numérico para el ajuste.");
      return null;
    }

    if (alcance !== "global" && !entidadId) {
      setError(`Debe seleccionar una ${alcance === "linea" ? "línea" : "SuperLínea"}.`);
      return null;
    }

    if (!usuarioId) {
      setError("No se pudo identificar al usuario actual.");
      return null;
    }

    return valorNumerico;
  };

  const verVistaPrevia = async () => {
    const valorNumerico = validarDatos();
    if (valorNumerico === null) return;

    try {
      setCargandoVistaPrevia(true);
      setError(null);
      setMensaje(null);
      const respuesta = await ProductoService.previsualizarAjusteMasivo(
        alcance,
        valorNumerico,
        usuarioId,
        entidadId,
      );
      setVistaPrevia(respuesta ?? []);
    } catch (error: any) {
      setVistaPrevia([]);
      setError(error?.response?.data?.message ?? "No se pudo generar la vista previa.");
    } finally {
      setCargandoVistaPrevia(false);
    }
  };

  const confirmarYAplicar = async () => {
    const valorNumerico = validarDatos();
    if (valorNumerico === null || productosInvalidos.length > 0 || vistaPrevia.length === 0) return;

    const confirmado = window.confirm(
      `Se actualizarán ${vistaPrevia.length} producto(s). ¿Deseás continuar?`,
    );
    if (!confirmado) return;

    try {
      setAplicando(true);
      setError(null);
      const respuesta = await ProductoService.ejecutarAjusteMasivo(
        alcance,
        valorNumerico,
        usuarioId,
        entidadId,
      );
      setMensaje(respuesta?.mensaje ?? "Los precios se actualizaron correctamente.");
      setVistaPrevia([]);
      setValor("");
    } catch (error: any) {
      setError(error?.response?.data?.message ?? "No se pudieron actualizar los precios.");
    } finally {
      setAplicando(false);
    }
  };

  const cancelar = () => {
    setValor("");
    setEntidadId(undefined);
    setVistaPrevia([]);
    setMensaje(null);
    setError(null);
  };

  return (
    <main className="w-full p-6">
      <section className="mx-auto max-w-6xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Actualización masiva de precios</h1>
        <p className="mt-1 text-sm text-slate-600">
          Primero generá una vista previa. Los cambios se aplican solamente al confirmar.
        </p>

        {error && <p className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-red-700">{error}</p>}
        {mensaje && <p className="mt-4 rounded-md border border-green-300 bg-green-50 p-3 text-green-700">{mensaje}</p>}

        <div className="mt-6">
          <p className="mb-2 font-medium text-slate-700">Alcance</p>
          <div className="flex flex-wrap gap-3">
            {([
              ["global", "Global"],
              ["linea", "Línea"],
              ["super-linea", "SuperLínea"],
            ] as const).map(([valorAlcance, etiqueta]) => (
              <button
                key={valorAlcance}
                type="button"
                onClick={() => cambiarAlcance(valorAlcance)}
                className={`rounded-md px-4 py-2 font-medium ${alcance === valorAlcance ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                {etiqueta}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {alcance === "linea" && (
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Línea
              <select
                value={entidadId ?? ""}
                disabled={cargandoCatalogos}
                onChange={(event) => {
                  setEntidadId(event.target.value ? Number(event.target.value) : undefined);
                  setVistaPrevia([]);
                }}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 font-normal"
              >
                <option value="">Seleccione una línea</option>
                {lineas.map((linea) => <option key={linea.id} value={linea.id}>{linea.denominacion}</option>)}
              </select>
            </label>
          )}

          {alcance === "super-linea" && (
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              SuperLínea
              <select
                value={entidadId ?? ""}
                disabled={cargandoCatalogos}
                onChange={(event) => {
                  setEntidadId(event.target.value ? Number(event.target.value) : undefined);
                  setVistaPrevia([]);
                }}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 font-normal"
              >
                <option value="">Seleccione una SuperLínea</option>
                {superLineas.map((superLinea) => <option key={superLinea.id} value={superLinea.id}>{superLinea.nombre}</option>)}
              </select>
            </label>
          )}

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            {usaPorcentaje ? "Porcentaje de ajuste" : "Monto fijo"}
            <input
              type="number"
              step="0.01"
              value={valor}
              onChange={(event) => {
                setValor(event.target.value);
                setVistaPrevia([]);
              }}
              placeholder={usaPorcentaje ? "Ej.: 10 o -5" : "Ej.: 20 o -15"}
              className="rounded-md border border-slate-300 px-3 py-2 font-normal"
            />
            <span className="font-normal text-slate-500">{usaPorcentaje ? "Use valores negativos para disminuir porcentajes." : "Use valores negativos para restar un monto."}</span>
          </label>
        </div>

        <button
          type="button"
          disabled={cargandoVistaPrevia || cargandoCatalogos}
          onClick={verVistaPrevia}
          className="mt-6 rounded-md bg-blue-600 px-5 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargandoVistaPrevia ? "Generando vista previa..." : "Ver vista previa"}
        </button>

        {vistaPrevia.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-800">Vista previa: {vistaPrevia.length} producto(s)</h2>
            {productosInvalidos.length > 0 && (
              <p className="mt-3 rounded-md border border-red-300 bg-red-50 p-3 text-red-700">
                La actualización resultaría en un precio inválido (≤ 0) para {productosInvalidos.length} producto(s). Operación cancelada
              </p>
            )}
            <div className="mt-3 overflow-x-auto rounded-md border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-sky-100 text-slate-800">
                  <tr><th className="p-3">Producto</th><th className="p-3">Precio actual</th><th className="p-3">Precio resultante</th></tr>
                </thead>
                <tbody>
                  {vistaPrevia.map((producto) => (
                    <tr key={producto.productoId} className="border-t border-slate-200">
                      <td className="p-3">{producto.denominacion}</td>
                      <td className="p-3">{formatearPrecio(producto.precioActual)}</td>
                      <td className={`p-3 font-medium ${Number(producto.precioProyectado) <= 0 ? "text-red-600" : "text-slate-800"}`}>
                        {formatearPrecio(producto.precioProyectado)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={cancelar} className="rounded-md border border-slate-300 px-5 py-2 font-medium text-slate-700">Cancelar</button>
              <button
                type="button"
                disabled={aplicando || productosInvalidos.length > 0}
                onClick={confirmarYAplicar}
                className="rounded-md bg-green-600 px-5 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {aplicando ? "Aplicando..." : "Confirmar y aplicar"}
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

