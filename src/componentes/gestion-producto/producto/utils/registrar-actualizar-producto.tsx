// Dibuja el formulario y coordina el guardado, defaultValues = â€œvalores iniciales del formularioâ€.
import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CardContent, CardFooter } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import FormInput from "../../../herramientas/formateo-de-campos/form-input";
import React from "react";
import { Card } from "../../../ui/Card";
import ProductoService from "../services/producto-service";
import PriceInput from "../../../herramientas/formateo-de-campos/price-input";
import CantidadesInput from "../../../herramientas/formateo-de-campos/cantidades-input";
import { SelectMarca } from "../../../../interfaces/gestion-producto/marca/interfaces-marca";
import { Linea, SelectLinea } from "../../../../interfaces/gestion-producto/linea/interfaces-linea";
import type { SuperLinea } from "../../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";
import { AlicuotaIva, ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import Select from "react-select";
import { useEnterFocus } from "../../../herramientas/formateo-de-campos/movimiento-campos";
import { useConfiguracionSistema } from "../../../sistema/ConfiguracionSistemaContext";
import { parseApiError } from "../../../../utils/errores";
import { Layers } from "lucide-react";
import RegistrarActualizarMarcaForm from "../../marca/utils/registrar-actualizar-marca";
import { ItemProveedor } from "../../../../interfaces/gestion-producto/producto/interfaces-item-proveedor";
import { SelectSublinea } from "../../../../interfaces/gestion-producto/sublinea/interfaces-sublinea";
import { ItemsProveedorEnPayload } from "../interfaces/interfaces-validaciones-item-proveedor";
import { FormValues, schema, transformData, transformarItemsProdAlternativo } from "../interfaces/interfaces-validaciones-producto";
import LineasSelector from "../componentes/configuracion/lineas-selector";
import EncabezadoFormularios from "../../../ui/encabezadoFormularios";
import MarcasSelector from "../componentes/configuracion/marcas-selector";
import { getUsuarioId } from "../../../../utils/auth";
import RegistrarActualizarLineaForm from "../../linea/utils/registrar-actualizar-linea";
import PorcentajeInput from "../../../herramientas/formateo-de-campos/porcentaje-input";

import {
  Producto,
  SelectPresentacion,
  UnidadPresentacion,
} from "../../../../interfaces/gestion-producto/producto/interfaces-producto";import SuperLineaService from "../../superlinea/services/superlinea-service";

//cr5, tar 10: Definir cÃ³mo se genera el nombre automÃ¡tico
//esta funcion solamente recibe datos y devuelve un texto
//ejemplo:  { id: 1, denominacion: "Coca-Cola" },
//          { id: 2, denominacion: "Gaseosas" },
//          2 
//           "L" );
// eso devuelve: Coca-Cola Gaseosas 2L
const generarDenominacionAutomatica = (
  marca?: SelectMarca,
  linea?: SelectLinea,
  valorPresentacion?: number | null,
  unidadPresentacion?: UnidadPresentacion | null
) => {
  const presentacion =
    valorPresentacion !== undefined &&
    valorPresentacion !== null &&
    unidadPresentacion
      ? `${valorPresentacion}${unidadPresentacion}`
      : "";

  return [marca?.denominacion, linea?.denominacion, presentacion]
    .filter(Boolean)
    .join(" ")
    .toUpperCase();
};

//para que el precio quede calculado automáticamente: Solo calcula la vista previa con la misma regla del dominio.
const calcularPrecioVenta = (
  costo?: number | null,
  margen?: number | null
): number | undefined => {
  if (
    costo === undefined ||
    costo === null ||
    margen === undefined ||
    margen === null ||
    costo <= 0 ||
    margen < 0
  ) {
    return undefined;
  }

  return Number((costo * (1 + margen / 100)).toFixed(2));
};

export default function RegistrarActualizarProductoForm({
  producto,
  onClose,
  onSuccess,
}: {
  producto?: Producto;
  onClose: () => void;
  onSuccess: (mensajeAlerta: string) => void;
}) {
  //===================== CONSTANTES VARIAS ============================================
  const usuarioId = getUsuarioId();

  const { configuracion } = useConfiguracionSistema();
  const [lineaSeleccionada, setLineaSeleccionada] = useState<Linea>({} as Linea);

  console.log("ConfiguraciÃ³n del sistema:", configuracion);

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema()),
    defaultValues: producto
      ? transformData(producto)
      : {
          alicuotaIva: AlicuotaIva.ALICUOTA_21,
          porcentaje: 15, //cambio cr1, el campo empieza en 15 y el usuario puede escribir, por ejemplo, 25.
          esDenominacionManual: false, //cr5, tar 10 - Un producto nuevo empieza siempre en modo automÃ¡tico.
        },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    watch,
    setError,
  } = methods;

  console.log("estos son los errores", errors);

  console.log("Producto que llega al formulario", producto);

  console.log("linea seleccionada", lineaSeleccionada);

  const [marcas, setMarcas] = React.useState<SelectMarca[]>([]);
  const [lineas, setLineas] = React.useState<SelectLinea[]>([]);
  const [superLineas, setSuperLineas] = React.useState<SuperLinea[]>([]);
  
  const [denominacionMarca, setDenominacionMarca] = useState("");
  const [denominacionLinea, setDenominacionLinea] = useState("");
  const [selectedLinea, setSelectedLinea] = React.useState<SelectLinea>();
  const [selectedMarca, setSelectedMarca] = React.useState<SelectMarca>();
  const [mostrarFormularioLinea, setMostrarFormularioLinea] = useState(false);
  const [mostrarFormularioMarca, setMostrarFormularioMarca] = useState(false);
  const [itemProdAlternativoSinAgregar, setItemProdAlternativoSinAgregar] = useState(false);
  const unidadesPresentacion: {
    value: UnidadPresentacion;
    label: string;
    }[] = [
  { value: "L", label: "Litro (L)" },
  { value: "ml", label: "Mililitro (ml)" },
  { value: "kg", label: "Kilogramo (kg)" },
  { value: "g", label: "Gramo (g)" },
  { value: "un", label: "Unidad (un)" },
  { value: "doc", label: "Docena (doc)" },
  { value: "caja", label: "Caja" },
  { value: "botella", label: "Botella" },
  { value: "lata", label: "Lata" },
  { value: "sachet", label: "Sachet" },
  { value: "sobre", label: "Sobre" },
  { value: "bolsa", label: "Bolsa" },
  ];

const stock = watch("stock");
const lineaIdSeleccionada = watch("lineaId");
const marcaIdSeleccionada = watch("marcaId");
//Para que el precio quede calculado automáticamente
const costoActual = watch("costo");
const margenActual = watch("porcentaje");
//tar 12, cr 6 y 7
const precioActual = watch("precio");
const precioCambio =
  producto &&
  Number(precioActual) !== Number(producto.precio);
//cr5, tar 10 - watch(...) observa un campo. Cuando cambia, React vuelve a renderizar 
// el componente. AsÃ­ detectamos cambios de marca, lÃ­nea, valor de presentaciÃ³n, unidad y modo manual.
const presentacionValor = watch("presentacionValor");
const presentacionUnidad = watch("presentacionUnidad");
const esDenominacionManual = watch("esDenominacionManual");
const denominacionActual = watch("denominacion"); //Ese valor se actualiza en vivo: cuando cambia la marca, la lÃ­nea, la presentaciÃ³n o el nombre manual.
const lineaActual =
  selectedLinea ?? lineas.find((linea) => linea.id === lineaIdSeleccionada);
const marcaActual =
  marcas.find((marca) => marca.id === marcaIdSeleccionada) ?? selectedMarca;
const superLineaActual = superLineas.find(
  (superLinea) =>
    Number(superLinea.id) === Number(lineaActual?.superLineaId)
);
  

  //=============================== CONSTANTES PARA MOVIMIENTO ENTRE CAMPOS ==================================
  const denominacionProductoRef = useRef<HTMLInputElement>(null);
  useEnterFocus(denominacionProductoRef);
  const observacionRef = useRef<HTMLInputElement>(null);
  const ubicacionRef = useRef<HTMLInputElement>(null);
  const selectTipoProductoRef = useRef<HTMLDivElement>(null);
  const codigoBarraRef = useRef<HTMLInputElement>(null);
  const selectAlicuotaIvaRef = useRef<HTMLDivElement>(null);
  const precioOfertaRef = useRef<HTMLInputElement>(null);
  const denominacionLineaRef = useRef<HTMLInputElement>(null);
  const selectLineaRef = useRef<HTMLDivElement>(null);
  const denominacionMarcaRef = useRef<HTMLInputElement>(null);
  const selectMarcaRef = useRef<HTMLDivElement>(null);

  const enterToObservacion = useEnterFocus(observacionRef);
  const enterToPrecioOferta = useEnterFocus(precioOfertaRef);
  const enterToDenominacionMarca = useEnterFocus(denominacionMarcaRef);

  //=============================== FUNCIONALIDAD ==================================

  useEffect(() => {
    const cargarOpcionesIniciales = async () => {
      try {
        const [respuestaLineas, respuestaMarcas, respuestaSuperLineas] = await Promise.all([
          ProductoService.obtenerTotales({ denominacion: "" }, "lineas"),
          ProductoService.obtenerTotales({ denominacion: "" }, "marcas"),
          SuperLineaService.obtenerTodas(),
        ]);
        setLineas(respuestaLineas.data ?? []);
        setMarcas(respuestaMarcas.data ?? []);
        setSuperLineas(respuestaSuperLineas);
      } catch (error) {
        console.error("No se pudieron cargar LÃ­neas, Marcas o SuperLÃ­neas:", error);
      }
    };

    cargarOpcionesIniciales();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (producto) {
          setValue("lineaId", producto.linea.id || 0);
          setSelectedLinea(producto.linea);

          setValue("marcaId", producto.marca.id || 0);
          setSelectedMarca(producto.marca);

          
          setValue("denominacion", producto.denominacion || "");
          setValue("observacion", producto.observacion || null);
          setValue("codigoProveedor", producto.codigoProveedor || "");
          setValue("codigoBarra", producto.codigoBarra || null);
          setValue("stock", producto.stock || 0);
          setValue("costo", producto.costo || 0);
          
          //setValue("oferta", producto.oferta || false);
          setValue("alicuotaIva", producto.alicuotaIva || 0);

          setValue("stockMinimo", producto.stockMinimo ?? undefined);
        
          console.error("llega aca", producto);
        
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [producto]);

  useEffect(() => { //cr5 , tar 10
  if (esDenominacionManual) return; //Si esDenominacionManual es true, termina inmediatamente. No toca el nombre.
  //Si es false, construye el nombre con los valores actuales.  
  const nuevaDenominacion = generarDenominacionAutomatica(
      marcaActual,
      lineaActual,
      presentacionValor,
      presentacionUnidad
    );

    if (!nuevaDenominacion) return; 
    setValue("denominacion", nuevaDenominacion, { //setValue actualiza el campo denominaciÃ³n sin que la persona tenga que escribirlo.
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [ //indica quÃ© cambios deben volver a ejecutar esta lÃ³gica.
    esDenominacionManual,
    marcaActual?.denominacion,
    lineaActual?.denominacion,
    presentacionValor,
    presentacionUnidad,
    setValue,
  ]);

  //Para que el precio quede calculado automáticamente
  useEffect(() => {
    const precioCalculado = calcularPrecioVenta(costoActual, margenActual); //El usuario escribe costo o margen.

    if (precioCalculado === undefined) return;

    setValue("precio", precioCalculado, { //guarda ese resultado dentro del formulario.
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [costoActual, margenActual, setValue]);

  const onSubmit = async (formData: FormValues) => {
    let response: ResponsePost;
    // Compatibilidad con la API actual: exige estas banderas aunque ya no sean controles.
    // Al editar, conservar los datos heredados de pack; los productos nuevos no usan pack.
    
    //tar 12, cr 6 y 7
    if (
      producto &&
      precioCambio &&
      !formData.motivoCambioPrecio?.trim()
    ) {
      setError("motivoCambioPrecio", {
        type: "manual",
        message: "Debe ingresar un motivo para el cambio de precio",
      });

      return;
    }

    const datosProducto = {
      ...formData,
      utilizaStockMinimo: true,
      utilizaPack: producto?.utilizaPack ?? false,
      cantidadPorPack: producto?.cantidadPorPack ?? 0,
    };

    try {
      // âš ï¸ Validar si hay Ã­tems sin agregar
      if (itemProdAlternativoSinAgregar) {
        const mensaje = [
          itemProdAlternativoSinAgregar ? "- Hay un producto alternativo sin agregar." : "",
          "",
          "Â¿EstÃ¡s seguro de que querÃ©s registrar sin agregarlos?",
        ]
          .filter(Boolean)
          .join("\n");

        const confirmar = window.confirm(mensaje);

        if (!confirmar) return; // el usuario cancelÃ³
      }

      if (producto) {
        const payload = {
          ...datosProducto,
          usuarioUpdatedId: usuarioId,
        };

        response = await ProductoService.actualizar(producto.id, payload);
      } else {
        const payload = {
          ...datosProducto,
          usuarioCreatedId: usuarioId,
        };

        response = await ProductoService.nuevo(payload);
      }

      await onSuccess(response.mensaje);
      onClose();
    } catch (error) {
      const errorMessage = parseApiError(error);

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  const handleBuscarPorDenominacion = async (select: string) => {
    try {
      if (select === "LINEA") {
        const lineas = await ProductoService.obtenerTotales({ denominacion: denominacionLinea }, "lineas");
        if (lineas) {
          console.log("Lineas encontradas:", lineas);
          setLineas(lineas.data);
        } else {
          console.log("No se encontrÃ³ una linea con la denominaciÃ³n ingresada.");
        }
      }
      if (select === "MARCA") {
        const marcas = await ProductoService.obtenerTotales({ denominacion: denominacionMarca }, "marcas");
        if (marcas) {
          console.log("Marcas encontradas:", marcas);
          setMarcas(marcas.data);
        } else {
          console.log("No se encontrÃ³ una marca con la denominaciÃ³n ingresada.");
        }
      }
      
    } catch (error) {
      console.error("Error al buscar por cÃ³digo:", error);
    }
  };

  const handleEnterEnSelect = async (e: React.KeyboardEvent<Element>, select: string) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (select === "LINEA") {
        handleBuscarPorDenominacion("LINEA");
      }

      if (select === "MARCA") {
        handleBuscarPorDenominacion("MARCA");
      }

      // Esperar un poco (opcional, si el botÃ³n hace una bÃºsqueda antes)
      setTimeout(() => {
        let selectDiv: HTMLDivElement | null = null;

        if (select === "MARCA") {
          selectDiv = selectMarcaRef.current;
        }

        if (select === "LINEA") {
          selectDiv = selectLineaRef.current;
        }

        if (select === "TIPO-PRODUCTO") {
          selectDiv = selectTipoProductoRef.current;
        }

        if (select === "ALICUOTA-IVA") {
          selectDiv = selectAlicuotaIvaRef.current;
        }

        if (selectDiv) {
          const input = selectDiv.querySelector("input");
          if (input) {
            input.focus();
            input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
          }
        }
      }, 300); // AjustÃ¡ este delay segÃºn el tiempo de bÃºsqueda, si es necesario
    }
  };



  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-5">
      <Card className="w-full max-w-7xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden relative mt-10 mb-12">
        <EncabezadoFormularios
          title={producto ? "Producto" : "Registrar Producto"}
          subtitle={
            producto
              ? producto.sistema > 0
                ? "SÃ³lo puede visualizarse, no modificarse."
                : "ModificÃ¡ los datos del producto."
              : "CompletÃ¡ la identidad del producto y luego sus datos comerciales."
          }
          icon={<Layers className="form-icon" />}
          onClose={onClose}
        />  

        {/* Formulario */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 gap-4 px-6 py-4">
              {/* CR-005 / Tarjeta 10: se movieron Marca, Línea y Presentación al inicio
                  porque son los datos que construyen la identidad del producto. */}
              <section className="rounded-xl border border-blue-200 bg-blue-50 p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Identidad del producto
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    1. Elegí la marca y la línea. 2. Indicá la presentación. 3. El sistema
                    construye el nombre automáticamente.
                  </p>
                </div>

                {/* CR-005: Marca primero; la selección actualiza la denominación automática. */}
                <MarcasSelector
                  denominacionMarca={denominacionMarca}
                  setDenominacionMarca={setDenominacionMarca}
                  denominacionMarcaRef={denominacionMarcaRef}
                  selectMarcaRef={selectMarcaRef}
                  marcas={marcas}
                  selectedMarca={selectedMarca}
                  marcaId={watch("marcaId")}
                  mostrarBusqueda={false}
                  disabled={Boolean(producto && producto.sistema > 0)}
                  error={errors.marcaId?.message}
                  onEnterMarca={(e) => handleEnterEnSelect(e, "MARCA")}
                  onChangeMarca={(marca) => {
                    setValue("marcaId", marca?.id ?? 0, {
                      shouldValidate: true,
                    });
                    setSelectedMarca(marca ?? undefined);
                  }}
                  onAgregarMarca={() => setMostrarFormularioMarca(true)}
                />

                {/* CR-005: Línea después de Marca; ambas conforman la denominación. */}
                <LineasSelector
                  denominacionLinea={denominacionLinea}
                  setDenominacionLinea={setDenominacionLinea}
                  denominacionLineaRef={denominacionLineaRef}
                  selectLineaRef={selectLineaRef}
                  lineas={lineas}
                  selectedLinea={selectedLinea}
                  lineaId={watch("lineaId")}
                  mostrarBusqueda={false}
                  disabled={Boolean(producto && producto.sistema > 0)}
                  errors={errors}
                  onEnterLinea={(e) => handleEnterEnSelect(e, "LINEA")}
                  onEnterDenominacion={enterToDenominacionMarca}
                  onLineaChange={(linea) => {
                    setValue("lineaId", linea?.id ?? 0, {
                      shouldValidate: true,
                    });
                    setSelectedLinea(linea ?? undefined);
                    setLineaSeleccionada(linea as Linea);
                  }}
                  onAgregarLinea={() => setMostrarFormularioLinea(true)}
                />

                {superLineaActual && (
                  <p className="px-2 text-sm text-gray-700">
                    SuperLínea:{" "}
                    <span className="font-semibold">
                      {superLineaActual.nombre}
                    </span>
                  </p>
                )}

                {/* CR-005: Presentación se carga junto a Marca y Línea, antes de mostrar el nombre final. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="presentacionValor"
                    label="Valor de presentación"
                    type="number"
                    placeholder="Ej.: 1, 500, 1.5"
                    disabled={Boolean(producto && producto.sistema > 0)}
                  />

                  <div className="space-y-1 sm:space-y-2">
                    <label className="label-base">Unidad de presentación</label>
                    <Select
                      value={
                        unidadesPresentacion.find(
                          (unidad) => unidad.value === presentacionUnidad
                        ) ?? null
                      }
                      options={unidadesPresentacion}
                      placeholder="Seleccioná una unidad"
                      isClearable
                      isDisabled={Boolean(producto && producto.sistema > 0)}
                      onChange={(unidad) => {
                        setValue("presentacionUnidad", unidad?.value ?? null, {
                          shouldValidate: true,
                        });
                      }}
                      className="text-black"
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                    {errors.presentacionUnidad && (
                      <small className="text-red-500">
                        {errors.presentacionUnidad.message as string}
                      </small>
                    )}
                  </div>
                </div>

                {/* CR-005: vista dinámica; refleja exactamente la denominación que se guardará. */}
                <div className="rounded-lg border border-amber-300 bg-amber-50 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                    Así quedará identificado el producto
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {denominacionActual || "Elegí marca, línea y presentación"}
                  </p>
                </div>

                {/* CR-005: el usuario puede reemplazar el nombre generado y volver al modo automático. */}
                <div className="border-t border-blue-200 pt-4">
                  <p className="text-sm font-medium text-gray-800">
                    ¿Querés usar otro nombre?
                  </p>
                  <p className="mb-3 text-sm text-gray-600">
                    Escribí una denominación personalizada. Desde ese momento no se
                    sobrescribirá al cambiar marca, línea o presentación.
                  </p>

                  <div className="flex flex-col gap-2 md:flex-row md:items-end">
                    <div className="flex-1">
                      <FormInput
                        name="denominacion"
                        label="Denominación"
                        placeholder="Ingresa la denominación"
                        disabled={Boolean(producto && producto.sistema > 0)}
                        onKeyDown={enterToObservacion}
                        inputRef={denominacionProductoRef}
                        convertirAMayusculas
                        onChange={() => {
                          setValue("esDenominacionManual", true);
                        }}
                      />
                    </div>

                    {esDenominacionManual && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setValue("esDenominacionManual", false);
                        }}
                      >
                        Usar denominación automática
                      </Button>
                    )}
                  </div>
                </div>
              </section>

              {/* Los campos restantes no cambian la identidad: son datos comerciales e inventario. */}
              <section className="rounded-xl border border-gray-200 p-5">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Datos comerciales e inventario
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Completá códigos, importes y valores de stock para guardar el producto.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormInput
                    name="codigoProveedor"
                    label="Código interno"
                    placeholder="Ingresa el código interno"
                    disabled={Boolean(producto && producto.sistema > 0)}
                  />

                  <FormInput
                    name="codigoReferencia"
                    label="Código de referencia"
                    placeholder="Ingresa el código de referencia"
                    disabled={Boolean(producto && producto.sistema > 0)}
                  />

                  <FormInput
                    name="codigoBarra"
                    label="Código de barra"
                    placeholder="Ingresa el código de barra (opcional)"
                    inputRef={codigoBarraRef}
                    onKeyDown={(e) => handleEnterEnSelect(e, "ALICUOTA-IVA")}
                    disabled={Boolean(producto && producto.sistema > 0)}
                  />

                  <PriceInput
                    name="costo"
                    label="Costo"
                    value={watch("costo")}
                    onChange={(value) =>
                      setValue("costo", value, { shouldValidate: true })
                    }
                    maxDigits={9}
                    disabled={Boolean(producto && producto.sistema > 0)}
                  />
                  <div>
                    <PriceInput
                      name="precio" //Para que el precio quede calculado automáticamente
                      label="Precio calculado"
                      value={watch("precio")}
                      onChange={() => undefined}
                      maxDigits={9}
                      disabled //evita que alguien escriba un precio arbitrario.
                    />
                    {precioCambio && (
                      <FormInput
                        name="motivoCambioPrecio"
                        label="Motivo del cambio de precio"
                        placeholder="Ej.: Ajuste por inflación Q3"
                      />
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Se calcula automáticamente según costo + margen.
                    </p>
                  </div>

                  <PorcentajeInput
                    name="porcentaje"
                    label="Margen (%)"
                    value={watch("porcentaje")}
                    onChange={(value) =>
                      setValue("porcentaje", value, { shouldValidate: true })
                    }
                    disabled={Boolean(producto && producto.sistema > 0)}
                  />

                  <FormInput
                    name="ubicacion"
                    label="Ubicación"
                    placeholder="Ingresa una ubicación (opcional)"
                    onKeyDown={(e) => handleEnterEnSelect(e, "TIPO-PRODUCTO")}
                    inputRef={ubicacionRef}
                    disabled={Boolean(producto && producto.sistema > 0)}
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Alícuota IVA
                    </label>
                    <div ref={selectAlicuotaIvaRef} className="w-full">
                      <Select
                        value={
                          Object.entries(AlicuotaIva)
                            .map(([key, value]) => ({
                              id: value,
                              denominacion:
                                key === "ALICUOTA_105"
                                  ? "10.5"
                                  : key.replace("ALICUOTA_", ""),
                            }))
                            .find(
                              (option) => option.id === watch("alicuotaIva")
                            ) || null
                        }
                        options={Object.entries(AlicuotaIva).map(
                          ([key, value]) => ({
                            id: value,
                            denominacion:
                              key === "ALICUOTA_105"
                                ? "10.5"
                                : key.replace("ALICUOTA_", ""),
                          })
                        )}
                        onKeyDown={enterToPrecioOferta}
                        getOptionLabel={(option) => option.denominacion}
                        getOptionValue={(option) => String(option.id)}
                        isDisabled={Boolean(producto && producto.sistema > 0)}
                        onChange={(selectedOption) => {
                          setValue("alicuotaIva", selectedOption?.id || 0);
                        }}
                        className="text-black"
                        menuPortalTarget={document.body}
                        styles={{
                          control: (base) => ({ ...base, color: "black" }),
                          singleValue: (base) => ({
                            ...base,
                            color: "black",
                          }),
                          option: (base, { isSelected, isFocused }) => ({
                            ...base,
                            color: isSelected ? "white" : "black",
                            backgroundColor: isSelected
                              ? "#3b82f6"
                              : isFocused
                                ? "#93c5fd"
                                : "white",
                          }),
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                        }}
                      />
                      {errors.alicuotaIva && (
                        <small className="text-red-500">
                          {errors.alicuotaIva.message as string}
                        </small>
                      )}
                    </div>
                  </div>

                  {producto && (
                    <CantidadesInput
                      name="stock"
                      label="Stock"
                      value={stock || 0}
                      onChange={(value) => setValue("stock", Number(value))}
                      disabled
                    />
                  )}

                  <FormInput
                    name="stockMinimo"
                    label="Stock mínimo"
                    placeholder="Ingresá un entero mayor o igual a cero"
                    defaultValue=""
                    disabled={Boolean(producto && producto.sistema > 0)}
                  />
                </div>
              </section>
            </CardContent>

            {errors.root?.message && <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>}

            {/* BotÃ³n de submit */}
            <CardFooter className="flex justify-center">
              <Button type="submit" disabled={isSubmitting} className="btn btn-dark">
                {isSubmitting
                  ? producto
                    ? "Actualizando..."
                    : "Registrando..."
                  : producto
                  ? "Actualizar"
                  : "Registrar"}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>

        {mostrarFormularioLinea && (
          <RegistrarActualizarLineaForm
            onClose={() => setMostrarFormularioLinea(false)}
            onSuccess={() => {
              setMostrarFormularioLinea(false);
              handleBuscarPorDenominacion("LINEA")
            }}
          />
        )}


        {mostrarFormularioMarca && (
          <RegistrarActualizarMarcaForm
            onClose={() => setMostrarFormularioMarca(false)}
            onSuccess={() => {
              setMostrarFormularioMarca(false);
              handleBuscarPorDenominacion("MARCA")
            }}
          />
        )}

       
      </Card>
    </div>
  );
}




