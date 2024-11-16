import { Funciones } from "../../utils/Funciones";
import { SPParse } from "../../utils/SPParse";
import { EUsuarioLookup } from "./EUsuarioLookup";
import { Lookup } from "../base/Lookup";
import { EArea } from "./EArea";
import { EPuesto } from "./EPuesto";

export class EAdministradorContrato {
  Id: any;
  IdUsuario: string;
  Nombre: string;
  Correo: string;
  Area: Lookup;
  //Puesto: Lookup;
  Eliminado: Boolean;
  PuedeEliminar: Boolean;

  constructor() {
    this.Id = '00000000-0000-0000-0000-000000000000';
    this.IdUsuario = "";
    this.Nombre = "";
    this.Correo = "";
    this.Area = new Lookup();
    //this.Puesto = new Lookup();
    this.Eliminado = false;
    this.PuedeEliminar = false;
  }

  public static parseJson(element: any): EAdministradorContrato {

    const objeto = new EAdministradorContrato();
   
    objeto.Id = SPParse.getString(element["id"]);
   
    if (!Funciones.esUndefinedNullOrEmpty(element["usuario"])) {
      const usuario = EUsuarioLookup.parseJson(element["usuario"]);
      objeto.IdUsuario = usuario.Id;
      objeto.Nombre = usuario.Nombre;
      objeto.Correo = usuario.Correo;
    }

    //objeto.Area = EArea.parseJsonLookup(element["area"]);
    //objeto.Puesto = EPuesto.parseJsonLookup(element["puestoUsuario"]);
      
    return objeto;
  }

  public static parseJsonList(elements: any): EAdministradorContrato[] {

    const lista: EAdministradorContrato[] = [];

    for (const element of elements) {
      const objeto = EAdministradorContrato.parseJson(element);
      lista.push(objeto);
    }

    return lista;
  }
}
