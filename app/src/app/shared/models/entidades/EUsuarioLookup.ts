import { Lookup } from "../base/Lookup";
import { SPParse } from "../../utils/SPParse";
import { EArea } from "./EArea";
import { EPuesto } from "./EPuesto";

export class EUsuarioLookup {
  Id: any;
  Nombre: string;
  Correo: string;
  Area: Lookup;

  constructor() {
    this.Id = "";
    this.Nombre = "";
    this.Correo = "";
    this.Area = new Lookup();
  }

  public static parseJson(element: any): EUsuarioLookup {

    const objeto = new EUsuarioLookup();
    objeto.Id = SPParse.getString(element["id"]);
    objeto.Nombre = SPParse.getString(element["nombreCompleto"]);
    objeto.Correo = SPParse.getString(element["correo"]);
    objeto.Area = element["area"] ? EArea.parseJsonLookup(element["area"]) : null;;
    return objeto;
  }

  public static parseJsonList(elements: any): EUsuarioLookup[] {

    const lista: EUsuarioLookup[] = [];

    for (const element of elements) {
      const objeto = EUsuarioLookup.parseJson(element);
      lista.push(objeto);
    }

    return lista;
  }
}
