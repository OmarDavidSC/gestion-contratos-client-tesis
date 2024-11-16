import { User } from "./../base/User";
import { ListItem } from "./../base/ListItem";
import { Constantes } from "./../../utils/Constantes";
import { Lookup } from "./../base/Lookup";
import { RestFiltros } from "../../utils/RestFiltros";
import { SPUser } from "./../base/SPUser";
import { SPParse } from "../../utils/SPParse";
import { EUsuario } from "./EUsuario";
import { Funciones } from "../../utils/Funciones";
import { EUsuarioLookup } from "./EUsuarioLookup";

export class ETipoDocumento {
  Id: any;
  Nombre: string;
  Habilitado: Boolean;
  TextoHabilitado: string;
  UsuarioRegistro: EUsuarioLookup;
  FechaRegistro: any;
  TextoFechaRegistro: string;
  UsuarioModificacion: EUsuarioLookup;
  FechaModificacion: any;
  TextoFechaModificacion: string;

  constructor() {
    this.Id = 0;
    this.Nombre = "";
    this.Habilitado = false;
    this.TextoHabilitado = "";
    this.UsuarioRegistro = new EUsuarioLookup();
    this.FechaRegistro = "";
    this.TextoFechaRegistro = "";
    this.UsuarioModificacion = new EUsuarioLookup();
    this.FechaModificacion = "";
    this.TextoFechaModificacion = "";
  }

  public static parseJsonLookup(element: any): Lookup {
    const objeto = new Lookup();
    objeto.Id = SPParse.getString(element["id"]);
    objeto.Nombre = SPParse.getString(element["nombre"]);
    return objeto;
  }

  public static parseJson(element: any): ETipoDocumento {    
    const objeto = new ETipoDocumento();
    objeto.Id = SPParse.getString(element["id"]);
    objeto.Nombre = SPParse.getString(element["nombre"]);
    objeto.Habilitado = SPParse.getBool(element["habilitado"]);
    objeto.TextoHabilitado = objeto.Habilitado ? "Sí" : "No";
    objeto.UsuarioRegistro = EUsuarioLookup.parseJson(element["usuarioRegistro"]);
    objeto.FechaRegistro = SPParse.getDate(element["fechaRegistro"]);
    objeto.TextoFechaRegistro = Funciones.ConvertirDateFechaHoraToString(objeto.FechaRegistro);
    objeto.UsuarioModificacion = element["usuarioModificacion"] ? EUsuarioLookup.parseJson(element["usuarioModificacion"]) : new EUsuarioLookup(); 
    objeto.FechaModificacion = SPParse.getDate(element["fechaModificacion"]);
    objeto.TextoFechaModificacion = Funciones.ConvertirDateFechaHoraToString(objeto.FechaModificacion);
    return objeto;
  }

  public static parseJsonList(elements: any): ETipoDocumento[] {

    const lista: ETipoDocumento[] = [];

    for (const element of elements) {
      const objeto = ETipoDocumento.parseJson(element);
      lista.push(objeto);
    }

    return lista;
  }
}
