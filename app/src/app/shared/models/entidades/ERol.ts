import { User } from "./../base/User";
import { ListItem } from "./../base/ListItem";
import { Constantes } from "./../../utils/Constantes";
import { Lookup } from "./../base/Lookup";
import { RestFiltros } from "../../utils/RestFiltros";
import { SPUser } from "./../base/SPUser";
import { SPParse } from "../../utils/SPParse";

export class ERol {
  Id: number;
  Title: string;
  Habilitado: Boolean;
  TextoHabilitado: string;

  constructor() {
    this.Id = 0;
    this.Title = "";
    this.Habilitado = false;
    this.TextoHabilitado = "";
  }

  public static getColumnasSelect(): string[] {
    return [
      Constantes.columnas.Id,
      Constantes.columnas.Title,
      Constantes.columnas.Habilitado
    ];
  }

  public static parseJson(element: any): ERol {
    const objeto = new ERol();
    objeto.Id = SPParse.getNumber(element[Constantes.columnas.Id]);
    objeto.Title = SPParse.getString(element[Constantes.columnas.Title]);
    objeto.Habilitado = SPParse.getBool(element[Constantes.columnas.Habilitado]);
    objeto.TextoHabilitado = objeto.Habilitado ? "Sí" : "No";
    return objeto;
  }

  public static parseJsonList(elements: any): ERol[] {

    const lista: ERol[] = [];

    for (const element of elements) {
      const objeto = ERol.parseJson(element);
      lista.push(objeto);
    }

    return lista;
  }
}
