//Proporciona las operaciones para comunicarse con el backend
import axios from "axios";
import axiosConfig from "../../../../utils/axiosConfig";
import { createCrudService } from "../../../../utils/crudFactory";
import type { FormValues } from "../interfaces/interfaces-validaciones-producto";
import ApiService from "../../../../utils/apiService";
import type { HistorialPrecioProducto } from "../../../../interfaces/gestion-producto/historial-precios/interfaces-historial-precios"; //tar 15
import type {
  MovimientoStock,
  ResultadoAjusteStock,
} from "../../../../interfaces/gestion-producto/stock/interfaces-stock";

const apiUrl = axiosConfig.apiUrl;

const baseService = createCrudService<FormValues>("producto");

const ProductoService = {
  ...baseService,

  obtenerMobile: async (filtros: any) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.get(`${apiUrl}/producto/search-by-mobile`, { headers, params: filtros });

      return data;
    } catch (error) {
      throw error;
    }
  },

  actualizarPreciosProducto: async (id: number, payload: any) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      console.log(">> PATCH iniciado a:", `${apiUrl}/producto/${id}/precios`);
      console.log(">> Payload PATCH:", payload);

      const result = await axios.patch(`${apiUrl}/producto/${id}/precios`, payload, { headers });
      console.log(">> PATCH terminado con Ã©xito:", result);
      return result;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  },

  calcularPreciosConPorcentaje: async (
    productoId: number,
    baseImponible: number,
    porcentajeOcasional: number,
    porcentajeMayorista: number,
    porcentajeCliente: number,
  ) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      };

      const body = {
        productoId,
        baseImponible,
        porcentajeOcasional,
        porcentajeMayorista,
        porcentajeCliente,
      };

      const { data } = await axios.post(`${apiUrl}/producto/calcular-precio-item`, body, { headers });

      console.log("Respuesta de la API en calcular importes:", data);
      return data;
    } catch (error) {
      console.error("Error al calcular precios:", error);
      return null;
    }
  },

  calcularPreciosEnCrearProducto: async (
    alicuotaIva: number,
    baseImponible: number,
    porcentajeOcasional: number,
    porcentajeMayorista: number,
    porcentajeCliente: number,
  ) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      };

      const body = {
        alicuotaIva,
        baseImponible,
        porcentajeOcasional,
        porcentajeMayorista,
        porcentajeCliente,
      };

      const { data } = await axios.post(`${apiUrl}/producto/calcular-precio-item-from-nuevo`, body, { headers });

      console.log("Respuesta de la API en calcular importes:", data);
      return data;
    } catch (error) {
      console.error("Error al calcular precios:", error);
      return null;
    }
  },

  calcularPrecioConFlete: async (
    precio: number,
    tipo: number,
    valor: number,
  ): Promise<{ precioConFlete: number }> => {
    const token = localStorage.getItem("Token");
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
    const { data } = await axios.post(
      `${apiUrl}/producto/calcular-precio-con-flete`,
      { precio, tipo, valor },
      { headers },
    );
    return data;
  },

   //tar 15
  obtenerHistorialPrecios: async (
  productoId: number): 
  Promise<HistorialPrecioProducto[]> => {
    const token = localStorage.getItem("Token");

    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const { data } = await axios.get(
      `${apiUrl}/productos/${productoId}/historial-precios`,
      { headers }
    );

    return data;
  },

  buscarCatalogo: async (filtros: { //Crea una funciÃ³n para buscar productos desde esta pantalla.
  denominacion?: string;
  lineaNombre?: string;
  superLineaNombre?: string;
  skip: number;
  take: number;
    }) => {
      return ApiService.get("/productos/buscar", filtros); // La ruta plural evita el conflicto con GET /producto/:id.
  },

  //tar 12, cr 6 y 7
  previsualizarAjusteMasivo: async (
    alcance: "global" | "linea" | "super-linea",
    valor: number,
    usuarioId: number,
    entidadId?: number
  ) => {
    const token = localStorage.getItem("Token");

    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const esPorcentaje =
      alcance === "global" || alcance === "super-linea";

    const ruta =
      alcance === "global"
        ? "/productos/precios/global/preview"
        : alcance === "linea"
          ? `/productos/precios/linea/${entidadId}/preview`
          : `/productos/precios/super-linea/${entidadId}/preview`;

    const { data } = await axios.post(
      `${apiUrl}${ruta}`,
      {
        [esPorcentaje ? "porcentaje" : "monto"]: valor,
        usuarioId,
      },
      { headers }
    );

    return data;
  },
  ejecutarAjusteMasivo: async (
    alcance: "global" | "linea" | "super-linea",
    valor: number,
    usuarioId: number,
    entidadId?: number
  ) => {
    const token = localStorage.getItem("Token");

   const headers = token
     ? { Authorization: `Bearer ${token}` }
       : {};

    const esPorcentaje =
      alcance === "global" || alcance === "super-linea";

    const ruta =
      alcance === "global"
        ? "/productos/precios/global/ejecutar"
        : alcance === "linea"
          ? `/productos/precios/linea/${entidadId}/ejecutar`
          : `/productos/precios/super-linea/${entidadId}/ejecutar`;

    const { data } = await axios.post(
      `${apiUrl}${ruta}`,
      {
        [esPorcentaje ? "porcentaje" : "monto"]: valor,
        usuarioId,
      },
      { headers }
    );
    return data;
    },

  ajustarStock: async (
    productoId: number,
    cantidad: number,
    motivo: string,
    ): Promise<ResultadoAjusteStock> => {
      const token = localStorage.getItem("Token");
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const { data } = await axios.post(
        `${apiUrl}/producto/${productoId}/ajuste-stock`,
        { cantidad, motivo },
        { headers },
      );

      return data;
  },

  obtenerMovimientosStock: async (
    productoId: number,
    ): Promise<MovimientoStock[]> => {
      const token = localStorage.getItem("Token");
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const { data } = await axios.get(
        `${apiUrl}/producto/${productoId}/movimientos-stock`,
        { headers },
      );

      return data;
  },
};

export default ProductoService;

