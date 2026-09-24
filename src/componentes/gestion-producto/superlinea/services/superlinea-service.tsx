import ApiService from "../../../../utils/apiService";
import type { SuperLinea, SuperLineaFormValues } from "../../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";

const SuperLineaService = {
  obtenerTodas: (): Promise<SuperLinea[]> => ApiService.get("/super-linea"),
  obtenerPorId: (id: number): Promise<SuperLinea> => ApiService.get(`/super-linea/${id}`),
  crear: (datos: SuperLineaFormValues): Promise<SuperLinea> => ApiService.post("/super-linea", datos),
  actualizar: (id: number, datos: SuperLineaFormValues): Promise<SuperLinea> =>
    ApiService.put(`/super-linea/${id}`, datos),
  eliminar: (id: number): Promise<void> => ApiService.delete(`/super-linea/${id}`),
};

export default SuperLineaService;
