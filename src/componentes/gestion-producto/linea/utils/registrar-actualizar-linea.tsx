import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CardContent, CardFooter } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import FormInput from "../../../herramientas/formateo-de-campos/form-input";
import React from "react";
import { Card } from "../../../ui/Card";
import { FormValues, schema, transformData } from "../interfaces/interfaces-validaciones-linea";
import LineaService from "../services/linea-service";
import { Linea } from "../../../../interfaces/gestion-producto/linea/interfaces-linea";
import type { SuperLinea } from "../../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";
import SuperLineaService from "../../superlinea/services/superlinea-service";

import { Layers, PlusCircle } from "lucide-react";
import { parseApiError } from "../../../../utils/errores";
import { ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import CantidadesInput from "../../../herramientas/formateo-de-campos/cantidades-input";
import { getUsuarioId } from "../../../../utils/auth";
import EncabezadoFormularios from "../../../ui/encabezadoFormularios";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";

export default function RegistrarActualizarLineaForm({
  linea,
  onClose,
  onSuccess,
}: {
  linea?: Linea;
  onClose: () => void;
  onSuccess: (mensajeAlerta: string) => void;
}) {
  const usuarioId = getUsuarioId();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();
  const [rStockCritico, setStockCritico] = useState(false);
  const [superLineas, setSuperLineas] = useState<SuperLinea[]>([]);

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema(rStockCritico)) as any,
    defaultValues: linea ? transformData(linea) : {},
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    watch,
    setError,
  } = methods;

 
  const stockMinimo = watch("stockMinimo");
  const utilizaStockMinimo = watch("utilizaStockMinimo");

  useEffect(() => {
    const cargarSuperLineas = async () => {
      try {
        setSuperLineas(await SuperLineaService.obtenerTodas());
      } catch {
        setError("root", { type: "manual", message: "No se pudieron cargar las SuperLíneas." });
      }
    };
    cargarSuperLineas();
  }, [setError]);

  useEffect(() => {
    if (!utilizaStockMinimo) {
      setValue("stockMinimo", 0);
    }
  }, [utilizaStockMinimo, setValue]);

  useEffect(() => {
    setStockCritico(utilizaStockMinimo || false);
  }, [utilizaStockMinimo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (linea) {
          setValue("denominacion", linea.denominacion || "");
          setValue("observacion", linea.observacion || null);
          setValue("stockMinimo", linea.stockMinimo || 0);
          setValue("utilizaStockMinimo", linea.utilizaStockMinimo || false);
          setValue("superLineaId", linea.superLineaId ?? 0);
          
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (formData: FormValues) => {
    let response: ResponsePost;
    try {
     

      if (linea) {
        const payload = { ...formData, usuarioUpdatedId: usuarioId };
        response = await LineaService.actualizar(linea.id, payload);
      } else {
        const payload = { ...formData, usuarioCreatedId: usuarioId };
        response = await LineaService.nuevo(payload);
      }
      onClose();
      onSuccess(response.mensaje);
    } catch (error) {
      setError("root", { type: "manual", message: parseApiError(error) });
    }
  };

 

  

  
  const handleOnClose = async () => {
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DEFAULT,
      title: TituloAlertaConfirmacion.DEFAULT,
      message: "Â¿EstÃ¡s seguro de que quieres cerrar el formulario? NO se guardaran los cambios.",
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });
    if (confirmed) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-5">
      <Card className="relative w-full max-w-7xl bg-white mx-auto shadow-lg rounded-lg overflow-hidden mt-10 mb-12">
        <EncabezadoFormularios
          title={linea ? "Actualizar LÃ­nea" : "Registrar LÃ­nea"}
          subtitle={linea ? "Modifica los detalles de la lÃ­nea." : "Ingresa los datos de la nueva lÃ­nea."}
          icon={<Layers className="form-icon" />}
          onClose={handleOnClose}
        />

        <fieldset disabled={linea?.sistema === 1}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 px-6 py-4">
                <div className="lg:col-span-2">
                  <FormInput name="denominacion" label="DenominaciÃ³n" placeholder="Ingresa la denominaciÃ³n" />
                </div>

                <div className="lg:col-span-2">
                  <FormInput name="observacion" label="ObservaciÃ³n" placeholder="Ingresa una observaciÃ³n (opcional)" />
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-1 block font-medium">SuperLínea <span className="text-red-500">*</span></label>
                  <Select
                    options={superLineas}
                    value={superLineas.find((superLinea) => superLinea.id === watch("superLineaId")) ?? null}
                    getOptionLabel={(superLinea) => superLinea.nombre}
                    getOptionValue={(superLinea) => String(superLinea.id)}
                    placeholder="Seleccioná una SuperLínea"
                    noOptionsMessage={() => "No hay SuperLíneas disponibles"}
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                    onChange={(opcion) => setValue("superLineaId", opcion?.id ?? 0, { shouldValidate: true, shouldDirty: true })}
                  />
                  {errors.superLineaId && <small className="mt-1 block text-red-500">{errors.superLineaId.message}</small>}
                </div>
                <div className="flex items-end gap-2 lg:col-span-1">
                  <label className="flex items-center pb-2">
                    <input
                      type="checkbox"
                      {...methods.register("utilizaStockMinimo")}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>
                  <CantidadesInput
                    name="stockMinimo"
                    label="Stock CrÃ­tico"
                    value={stockMinimo || 0}
                    onChange={(value) => setValue("stockMinimo", Number(value))}
                    disabled={utilizaStockMinimo ? false : true}
                  />
                </div>
              </CardContent>
              {errors.root?.message && (
                <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>
              )}

              <CardFooter className="flex justify-center">
                <Button type="submit" disabled={isSubmitting} className="btn btn-dark">
                  {isSubmitting ? (linea ? "Actualizando..." : "Registrando...") : linea ? "Actualizar" : "Registrar"}
                </Button>
              </CardFooter>
            </form>
          </FormProvider>
        </fieldset>
      </Card>

     
      <AlertasConfirmacion />
    </div>
  );
}
