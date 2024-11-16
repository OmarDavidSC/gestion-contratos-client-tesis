import { Constantes } from "../utils/Constantes";

export class RestFiltros {
  public static obtenerFieldExpandUsuario(nombreColumnaExpand: string) {
    return `${nombreColumnaExpand}/${Constantes.columnas.Id},${nombreColumnaExpand}/${Constantes.columnas.Title},${nombreColumnaExpand}/${Constantes.columnas.EMail}`;
  }

  public static obtenerFieldExpandUsuarioNoEmail(nombreColumnaExpand: string) {
    return `${nombreColumnaExpand}/${Constantes.columnas.Id},${nombreColumnaExpand}/${Constantes.columnas.Title}`;
  }

  public static obtenerFieldExpandLookup(nombreColumnaExpand: string) {
    return `${nombreColumnaExpand}/${Constantes.columnas.Id},${nombreColumnaExpand}/${Constantes.columnas.Title}`;
  }

  public static obtenerFieldExpandLookupOtherField(nombreColumnaExpand: string, nombreColumnaAdicional: string) {
    return `${nombreColumnaExpand}/${nombreColumnaAdicional}`;
  }
}
