import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Layers, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "../../../ui/Button";
import { Card, CardContent, CardHeader } from "../../../ui/Card";
import { Alertas, TipoAlerta, TituloAlerta, useAlerts } from "../../../herramientas/alertas/alertas";
import { TipoAlertaConfirmacion, TituloAlertaConfirmacion, useConfirmation } from "../../../herramientas/alertas/alertas-confirmacion";
import { parseApiError } from "../../../../utils/errores";
import type { SuperLinea, SuperLineaFormValues } from "../../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";
import SuperLineaService from "../services/superlinea-service";

const schema = yup.object({
  nombre: yup.string().trim().required("El nombre de la SuperLínea es obligatorio").max(255, "Máximo 255 caracteres."),
  descripcion: yup.string().optional(),
});

export default function ConsultarSuperLineas() {
  const [superLineas, setSuperLineas] = useState<SuperLinea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [abierto, setAbierto] = useState(false);
  const [editar, setEditar] = useState<SuperLinea | null>(null);
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  const cargar = async () => {
    try { setCargando(true); setSuperLineas(await SuperLineaService.obtenerTodas()); }
    catch (error) { addAlert({ type: TipoAlerta.ERROR, title: TituloAlerta.ERROR, message: parseApiError(error), autoClose: true }); }
    finally { setCargando(false); }
  };
  useEffect(() => { cargar(); }, []);

  const eliminar = async (superLinea: SuperLinea) => {
    const confirmado = await showConfirmation({
      type: TipoAlertaConfirmacion.DESTRUCTIVE, title: TituloAlertaConfirmacion.DESTRUCTIVE,
      message: `¿Eliminar la SuperLínea “${superLinea.nombre}”?`, confirmText: "Eliminar", cancelText: "Cancelar", onConfirm: () => {},
    });
    if (!confirmado) return;
    try {
      await SuperLineaService.eliminar(superLinea.id);
      setSuperLineas((actuales) => actuales.filter(({ id }) => id !== superLinea.id));
      addAlert({ type: TipoAlerta.SUCCESS, title: TituloAlerta.SUCCESS, message: "SuperLínea eliminada correctamente.", autoClose: true });
    } catch (error) {
      addAlert({ type: TipoAlerta.ERROR, title: TituloAlerta.ERROR, message: parseApiError(error), autoClose: true });
    }
  };

  return <div className="w-full p-6">
    <Card>
      <CardHeader className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3"><Layers className="text-blue-600" /><div><h1 className="text-xl font-semibold">SuperLíneas</h1><p className="text-sm text-gray-500">Agrupá las líneas de productos en categorías superiores.</p></div></div>
        <Button className="btn btn-dark" onClick={() => { setEditar(null); setAbierto(true); }}><Plus size={18} className="mr-2" />Nueva SuperLínea</Button>
      </CardHeader>
      <CardContent className="p-0">
        {cargando ? <p className="p-6 text-center text-gray-600">Cargando SuperLíneas...</p> : superLineas.length === 0 ? <p className="p-6 text-center text-gray-600">No hay SuperLíneas para mostrar.</p> :
          <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-sky-100"><tr><th className="p-3">Nombre</th><th className="p-3">Descripción</th><th className="p-3 text-right">Acciones</th></tr></thead><tbody>
            {superLineas.map((superLinea) => <tr key={superLinea.id} className="border-t"><td className="p-3 font-medium">{superLinea.nombre}</td><td className="p-3">{superLinea.descripcion || "—"}</td><td className="p-3"><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => { setEditar(superLinea); setAbierto(true); }} title="Editar"><Pencil size={16} /></Button><Button type="button" variant="destructive" disabled={superLinea.sistema === 1} onClick={() => eliminar(superLinea)} title="Eliminar"><Trash2 size={16} /></Button></div></td></tr>)}
          </tbody></table></div>}
      </CardContent>
    </Card>
    {abierto && <SuperLineaForm superLinea={editar} onClose={() => setAbierto(false)} onSuccess={async (mensaje) => { setAbierto(false); addAlert({ type: TipoAlerta.SUCCESS, title: TituloAlerta.SUCCESS, message: mensaje, autoClose: true }); await cargar(); }} />}
    <Alertas alerts={alerts} onRemove={removeAlert} /><AlertasConfirmacion />
  </div>;
}

function SuperLineaForm({ superLinea, onClose, onSuccess }: { superLinea: SuperLinea | null; onClose: () => void; onSuccess: (mensaje: string) => void }) {
  const { register, handleSubmit, reset, setError, setValue, formState: { errors, isSubmitting } } = useForm<SuperLineaFormValues>({ resolver: yupResolver(schema) as any, defaultValues: { nombre: "", descripcion: "" } });
  useEffect(() => { reset({ nombre: superLinea?.nombre ?? "", descripcion: superLinea?.descripcion ?? "" }); }, [superLinea, reset]);
  const guardar = async (datos: SuperLineaFormValues) => {
    try { if (superLinea) { await SuperLineaService.actualizar(superLinea.id, datos); onSuccess("SuperLínea actualizada correctamente."); } else { await SuperLineaService.crear(datos); onSuccess("SuperLínea creada correctamente."); } }
    catch (error) { setError("root", { message: parseApiError(error) }); }
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><Card className="w-full max-w-lg bg-white"><CardHeader className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">{superLinea ? "Editar SuperLínea" : "Nueva SuperLínea"}</h2><p className="text-sm text-gray-500">Definí la categoría que agrupará las líneas.</p></div><Button type="button" variant="ghost" onClick={onClose} title="Cerrar"><X size={18} /></Button></CardHeader><form onSubmit={handleSubmit(guardar)}><CardContent className="space-y-4"><div><label htmlFor="nombre" className="mb-1 block font-medium">Nombre <span className="text-red-500">*</span></label><input id="nombre" {...register("nombre")} onChange={(e) => setValue("nombre", e.target.value.toUpperCase(), { shouldValidate: true })} className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Ej.: Bebidas" />{errors.nombre && <small className="text-red-500">{errors.nombre.message}</small>}</div><div><label htmlFor="descripcion" className="mb-1 block font-medium">Descripción</label><textarea id="descripcion" {...register("descripcion")} className="min-h-24 w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Ej.: Bebidas con y sin gas, jugos y aguas" /></div>{errors.root?.message && <p className="text-red-600">{errors.root.message}</p>}</CardContent><div className="flex justify-end gap-2 p-6 pt-0"><Button type="button" variant="outline" onClick={onClose}>Cancelar</Button><Button type="submit" className="btn btn-dark" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar"}</Button></div></form></Card></div>;
}

