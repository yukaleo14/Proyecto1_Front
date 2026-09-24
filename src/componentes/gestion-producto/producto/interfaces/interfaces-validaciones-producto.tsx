// Define los datos del formulario y sus validaciones con Yup
import * as yup from "yup";
import { ItemsProdAlternativoEnPayload } from "./interfaces-validaciones-item-prod-alternativo";
import { AlicuotaIva } from "../../../../interfaces/generales/interfaces-generales";
import { Producto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { ItemProveedor } from "../../../../interfaces/gestion-producto/producto/interfaces-item-proveedor";
import { ItemProdAlternativo } from "../../../../interfaces/gestion-producto/producto/interfaces-item-prod-alternativo";

//===================== interfaces para las cosas que se van a ingresar en el formulario y es necesario validarlas ==========//

// El tipo se obtiene del esquema para que el formulario y Yup describan los mismos datos.
export type FormValues = yup.InferType<ReturnType<typeof schema>>;

export interface ItemsProveedorEnPayload {
  codigoProveedor: string;
  proveedorId: number;
  usuarioCreatedId: number;
}

//===================== schema de validacion ============================================//

export const schema = () =>
  yup.object().shape({
    denominacion: yup
      .string()
      .trim() //elimina espacios al inicio y final.
      .required("La denominaciÃ³n es obligatoria.")
      .max(255, "MÃ¡ximo 255 caracteres.")
      .matches(
      /^[A-Za-z0-9 %-_"'Ã¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“ÃšÃ±Ã‘./]+$/,
      "Solo se permiten letras, nÃºmeros y espacios."
    ),
    esDenominacionManual: yup.boolean().required(), //cr 5, tajeta 10
    observacion: yup.string().optional().nullable(),
    codigoProveedor: yup.string().optional().nullable(),
    codigoReferencia: yup.string().optional().nullable(),
    codigoBarra: yup.string().optional().max(255, "MÃ¡ximo 255 caracteres.").nullable(),
    stock: yup.number().optional().nullable(),
    costo: yup //cambio de CR1, costo mayor a cero 
      .number()
      .typeError("El costo debe ser un valor numÃ©rico")
      .required("El costo es obligatorio")
      .moreThan(0, "El costo debe ser un valor mayor a cero"), //debe ser estrictamente mayor que cero.
    precio: yup.number()
      .typeError("El precio debe ser un valor nÃºmerico")
      .required("El precio es obligatorio")
      .moreThan(0, "El precio debe ser un valor mayor a cero")
      .test("precio-mayor-o-igual-costo","El precio debe ser mayor o igual que el costo",
      function(value){
        const {costo} = this.parent;
        if (value==null || costo == null ) return true;
        return value>= costo;
    }),
    porcentaje: yup //ESTE ES EL MARGEN
      .number() 
      .typeError("El margen debe ser un valor nÃºmerico")
      .required("El margen es obligatorio") //Cambio para CR1
      .min(0,"El margen debe ser mayor o igual a 0"), //acepta margen 0, que es vÃ¡lido, pero rechaza negativos.
    /* costoEnDolar: yup.boolean().optional().nullable(),
    costoDolar: yup.number().optional().nullable(),
    destacado: yup.boolean().optional().nullable(),
    envioGratis: yup.boolean().optional().nullable(), */
    marcaId: yup
      .number()
      .typeError("La marca es obligatoria.")
      .required("La marca es obligatoria.") //exige una selecciÃ³n.
      .transform((value, originalValue) => (originalValue === "" ? null : value)) // Si el valor es una cadena vacÃ­a, lo convierte en null.
      .moreThan(0, "Debe seleccionar una marca")
      .integer("La marca seleccionada no es vÃ¡lida"), 
    lineaId: yup
      .number()
      .typeError("La linea es obligatoria.")
      .required("La lÃ­nea es obligatoria.")
      .transform((value, originalValue) => (originalValue === "" ? null : value)) // Si el valor es una cadena vacÃ­a, lo convierte en null.
      .moreThan(0, "Debe seleccionar una linea")
      .integer("La lÃ­nea seleccionada no es vÃ¡lida"),
    alicuotaIva: yup
      .number()
      .oneOf(Object.values(AlicuotaIva), "Alicuota IVA invÃ¡lida")
      .required("La alÃ­cuota IVA es obligatoria.")
      .nullable(),
    /* ubicacion: yup.string().optional().max(255, "MÃ¡ximo 255 caracteres.").nullable(),
    presentacionId: yup
      .number()
      .typeError("La unidad de medida es obligatoria.")
      .required("La unidad de medida es obligatoria."),
    subLineaId: yup
    .number()
    .typeError("La sublinea es obligatoria.")
    .optional()
    .nullable(), */
    stockMinimo: yup //quitamos .when() Porque hacÃ­a que la obligatoriedad dependiera de la opciÃ³n utilizaStockMinimo. Su historia exige el campo para todos los productos
      .number()
      .transform((value, originalValue) =>
        typeof originalValue === "string" && originalValue.trim() === ""
          ? undefined
          : value
      )
      .typeError("El stock mÃ­nimo debe ser un nÃºmero")
      .required("El stock mÃ­nimo es obligatorio")
      .integer("El stock mÃ­nimo debe ser un nÃºmero entero")
      .min(0, "El stock mÃ­nimo debe ser mayor o igual a cero"),
    presentacionValor: yup //cr2
      .number()
      .transform((value, originalValue) => {
        return typeof originalValue === "string" && originalValue.trim() === ""
          ? undefined
          : value;
      })
      .typeError("El valor de la presentaciÃ³n debe ser un nÃºmero")
      .moreThan(0, "El valor de la presentaciÃ³n debe ser mayor a cero")
      .test("valor-requerido-con-unidad", "Debe ingresar el valor de la presentaciÃ³n", function (valor) {
        const unidad = this.parent.presentacionUnidad;
        return !unidad || (valor !== undefined && valor !== null && !Number.isNaN(valor));
      }),

    presentacionUnidad: yup //cr2
      .string()
      .nullable()
      .oneOf(
        ["L", "ml", "kg", "g", "un", "doc", "caja", "botella", "lata", "sachet", "sobre", "bolsa"],
        "La unidad de presentaciÃ³n no es vÃ¡lida"
      )
      .test("unidad-requerida-con-valor", "Debe seleccionar una unidad de presentaciÃ³n", function (unidad) {
        const valor = this.parent.presentacionValor;
        return valor === undefined || valor === null || valor === "" || Boolean(unidad);
      }),
   /*  cantidadOferta: yup.number().when([], {
      is: () => usaOferta,
      then: (schema) => schema.required("La cantidad de oferta es obligatoria.").moreThan(0, "La cantidad de oferta debe ser mayor a 0."),
      otherwise: (schema) => schema.optional(),
    }), */
    /* porcentajeOcasional: yup
      .number()
      .typeError("El porcentaje ocasional es obligatorio.")
      .required("El porcentaje ocasional es obligatorio.")
      .moreThan(0, "El porcentaje ocasional debe ser mayor a 0."),
    porcentajeMayorista: yup
      .number()
      .typeError("El porcentaje mayorista es obligatorio.")
      .required("El porcentaje mayorista es obligatorio.")
      .moreThan(0, "El porcentaje mayorista debe ser mayor a 0."),
    porcentajeCliente: yup
      .number()
      .typeError("El porcentaje cliente es obligatorio.")
      .required("El porcentaje cliente es obligatorio.")
      .moreThan(0, "El porcentaje cliente debe ser mayor a 0."),
    oferta: yup.boolean().optional(),
    precioOcasional: yup
      .number()
      .typeError("El precio ocasional es obligatorio.")
      .required("El precio ocasional es obligatorio."),
    precioMayorista: yup
      .number()
      .typeError("El precio mayorista es obligatorio.")
      .required("El precio mayorista es obligatorio."),
    precioCliente: yup
      .number()
      .typeError("El precio cliente es obligatorio.")
      .required("El precio cliente es obligatorio."),
    precioOferta: yup
      .number()
      .typeError("El precio oferta es obligatorio.")
      .required("El precio oferta es obligatorio."), */
  });

//===================== transform data ============================================//

export const transformData = (producto: Producto): FormValues => {
  return {
    denominacion: producto.denominacion,
    esDenominacionManual: producto.esDenominacionManual ?? false, //cr5 , tarjeta 10. 
      //?? false significa: si el producto viejo no trae ese dato, asumimos que su denominaciÃ³n es automÃ¡tica.
    observacion: producto.observacion ?? null,
    codigoProveedor: producto.codigoProveedor ?? "",
    codigoReferencia: producto.codigoReferencia ?? "",
    codigoBarra: producto.codigoBarra ?? null,
    stock: producto.stock ?? null,
    costo: producto.costo ?? null,
    precio: producto.precio ?? null,
    porcentaje: producto.porcentaje ?? null,
    
   // oferta: producto.oferta ?? null,
    /* costoEnDolar: producto.costoEnDolar ?? null,
    costoDolar: producto.costoDolar ?? null,
    destacado: producto.destacado ?? null,
    
    envioGratis: producto.envioGratis ?? null, */
    alicuotaIva: producto.alicuotaIva ?? null,
   // ubicacion: producto.ubicacion ?? null,
    marcaId: producto.marca.id ?? 0,
    lineaId: producto.linea.id ?? 0,
   /*  subLineaId: producto.sublinea?.id ?? 0,
    presentacionId: producto.presentacion.id ?? 0,
 */
    stockMinimo: producto.stockMinimo ?? undefined,
    presentacionValor: producto.presentacionValor ?? undefined,
    presentacionUnidad: producto.presentacionUnidad ?? null,
 //   cantidadOferta: producto.cantidadOferta ?? 0,
   /*  porcentajeOcasional: producto.porcentajeOcasional ?? 0,
    porcentajeMayorista: producto.porcentajeMayorista ?? 0,
    porcentajeCliente: producto.porcentajeCliente ?? 0,
    precioOcasional: producto.precioOcasional ?? 0,
    precioMayorista: producto.precioMayorista ?? 0,
    precioCliente: producto.precioCliente ?? 0,
    precioOferta: producto.precioOferta ?? 0,
     */
  };
};

export const transformarItemsProveedor = (items: ItemProveedor[]): ItemsProveedorEnPayload[] => {
  return items.map((item) => ({
    id: item.id,
    codigoProveedor: item.codigoProveedor,
    proveedorId: item.proveedorId,
    usuarioCreatedId: item.usuarioCreatedId,
  }));
};

export const transformarItemsProdAlternativo = (items: ItemProdAlternativo[]): ItemsProdAlternativoEnPayload[] => {
  return items.map((item) => ({
    id: item.id,
    productoAlternativoId: item.productoAlternativoId,
    usuarioCreatedId: item.usuarioCreatedId,
  }));
};

