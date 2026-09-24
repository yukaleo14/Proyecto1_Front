import * as yup from "yup";
import { Linea } from "../../../../interfaces/gestion-producto/linea/interfaces-linea";

//===================== interfaces ============================================//

export interface FormValues {
  denominacion: string;
  observacion?: string | null;
  stockMinimo?: number;
  utilizaStockMinimo?: boolean;
  superLineaId: number;
}

export interface SublineasEnPayload {
  denominacion: string;
  observacion?: string | null;
  usuarioCreatedId: number;
}

//===================== schema de validacion ============================================//

export const schema = (utilizaStockMinimo: boolean) =>
  yup.object().shape({
    denominacion: yup
      .string()
      .trim()
      .lowercase()
      .required("La denominaciÃ³n es obligatoria.")
      .max(255, "MÃ¡ximo 255 caracteres.")
      .matches(/^[A-Za-z0-9 Ã¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“ÃšÃ±Ã‘]+$/, "Solo se permiten letras, nÃºmeros y espacios."),
    observacion: yup.string().optional().nullable(),
    stockMinimo: yup.number().when([], {
      is: () => utilizaStockMinimo,
      then: (schema) => schema.required("El Stock minimo es obligatorio.").moreThan(0, "El stock minimo debe ser mayor a 0."),
      otherwise: (schema) => schema.optional(),
    }),
    utilizaStockMinimo: yup.boolean().optional(),
    superLineaId: yup.number().typeError("Debe seleccionar una SuperLínea para la línea").required("Debe seleccionar una SuperLínea para la línea").moreThan(0, "Debe seleccionar una SuperLínea para la línea").integer("Debe seleccionar una SuperLínea para la línea"),
   
  });

//===================== transform data ============================================//

export const transformData = (linea: Linea): FormValues => {
  return {
    denominacion: linea.denominacion,
    observacion: linea.observacion ?? null,
    stockMinimo: linea.stockMinimo ?? 0,
    utilizaStockMinimo: linea.utilizaStockMinimo ?? false,
    superLineaId: linea.superLineaId ?? 0,
  };
};
