import { Lookup } from "./../base/Lookup";
import { SPParse } from "../../utils/SPParse";
import { EArea } from "./EArea";
import { EPuesto } from "./EPuesto";
import { Funciones } from "../../utils/Funciones";
import { EUsuarioLookup } from "./EUsuarioLookup";

export class EUsuario {
  Id: any;
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Correo: string;
  Area: Lookup;
  Rol: string;
  Habilitado: Boolean;
  TextoHabilitado: string;
  NombreCompleto: string;
  UsuarioRegistro: EUsuarioLookup;
  FechaRegistro: any;
  TextoFechaRegistro: string;
  UsuarioModificacion: EUsuarioLookup;
  FechaModificacion: any;
  TextoFechaModificacion: string;

  constructor() {
    this.Id = "";
    this.Nombre = "";
    this.ApellidoPaterno = "";
    this.ApellidoMaterno = "";
    this.Correo = "";
    this.Area = new Lookup();
    this.Rol = "";
    this.Habilitado = false;
    this.TextoHabilitado = "";
    this.NombreCompleto = "";
    this.UsuarioRegistro = new EUsuarioLookup();
    this.FechaRegistro = "";
    this.TextoFechaRegistro = "";
    this.UsuarioModificacion = new EUsuarioLookup();
    this.FechaModificacion = "";
    this.TextoFechaModificacion = "";
  }

  public static parseJson(element: any): EUsuario {

    const objeto = new EUsuario();
    objeto.Id = SPParse.getString(element["id"]);
    objeto.Nombre = SPParse.getString(element["nombre"]);
    objeto.ApellidoPaterno = SPParse.getString(element["apellidoPaterno"]);
    objeto.ApellidoMaterno = SPParse.getString(element["apellidoMaterno"]);
    objeto.Correo = SPParse.getString(element["correo"]);
    objeto.Area = element["area"] ? EArea.parseJsonLookup(element["area"]) : new Lookup();
    objeto.Rol = SPParse.getString(element["rol"]);
    objeto.Habilitado = element["habilitado"];
    objeto.TextoHabilitado = objeto.Habilitado ? "Sí" : "No";
    objeto.NombreCompleto = SPParse.getString(element["nombreCompleto"]);
    objeto.UsuarioRegistro = element["usuarioRegistro"] ? EUsuarioLookup.parseJson(element["usuarioRegistro"]) : new EUsuarioLookup();
    objeto.FechaRegistro = SPParse.getDate(element["fechaRegistro"]);
    objeto.TextoFechaRegistro = Funciones.ConvertirDateFechaHoraToString(objeto.FechaRegistro);
    objeto.UsuarioModificacion = element["usuarioModificacion"] ? EUsuarioLookup.parseJson(element["usuarioModificacion"]) : new EUsuarioLookup();
    objeto.FechaModificacion = SPParse.getDate(element["fechaModificacion"]);
    objeto.TextoFechaModificacion = Funciones.ConvertirDateFechaHoraToString(objeto.FechaModificacion);
    return objeto;
  }

  public static parseJsonLookup(element: any): Lookup {
    const objeto = new Lookup();
    objeto.Id = SPParse.getString(element["id"]);
    objeto.Nombre = SPParse.getString(element["nombre"]);
    return objeto;
  }

  public static parseJsonList(elements: any): EUsuario[] {

    const lista: EUsuario[] = [];

    for (const element of elements) {
      const objeto = EUsuario.parseJson(element);
      lista.push(objeto);
    }

    return lista;
  }
}
