import { User } from "./../base/User";
import { ListItem } from "./../base/ListItem";
import { Constantes } from "./../../utils/Constantes";
import { Lookup } from "./../base/Lookup";
import { RestFiltros } from "../../utils/RestFiltros";
import { SPUser } from "./../base/SPUser";
import { SPParse } from "../../utils/SPParse";
import { EUsuario } from "./EUsuario";
import { Funciones } from "../../utils/Funciones";

export class EPuesto {
  id: any;
  nombre: string;
  habilitado: Boolean;
  TextoHabilitado: string;
  usuarioRegistro: EUsuario;
  fechaRegistro: any;
  TextoFechaRegistro: string;
  usuarioModificacion: EUsuario;
  fechaModificacion: any;
  TextoFechaModificacion: string;

  constructor() {
    this.id = "";
    this.nombre = "";   
    this.habilitado = false;
    this.TextoHabilitado = "";
    this.usuarioRegistro = null;
    this.fechaRegistro = "";
    this.TextoFechaRegistro = "";
    this.usuarioModificacion = null;
    this.fechaModificacion = "";
    this.TextoFechaModificacion = "";
  }

  public static getColumnasSelect(): string[] {
    return [
      "id",
      "nombre",
      "habilitado"    
    ];
  }  

  public static parseJsonLookup(element: any): Lookup {
    const objeto = new Lookup();
    objeto.Id = SPParse.getString(element["id"]);
    objeto.Nombre = SPParse.getString(element["nombre"]);
    return objeto;
  }

  public static parseJson(element: any): EPuesto {
    const objeto = new EPuesto();
    objeto.id = SPParse.getString(element["id"]);
    objeto.nombre = SPParse.getString(element["nombre"]);
    objeto.habilitado = SPParse.getBool(element["habilitado"]);
    objeto.TextoHabilitado = objeto.habilitado ? "Sí" : "No";
    objeto.usuarioRegistro = element["usuarioRegistro"] ? EUsuario.parseJson(element["usuarioRegistro"]) : null;   
    objeto.fechaRegistro = SPParse.getDate(element["fechaRegistro"]);
    objeto.TextoFechaRegistro = Funciones.ConvertirDateFechaHoraToString(objeto.fechaRegistro);
    objeto.usuarioModificacion = element["usuarioModificacion"] ? EUsuario.parseJson(element["usuarioModificacion"]) : null; 
    objeto.fechaModificacion = SPParse.getDate(element["fechaModificacion"]);
    objeto.TextoFechaModificacion = Funciones.ConvertirDateFechaHoraToString(objeto.fechaRegistro);
    return objeto;
  }

  public static parseJsonList(elements: any): EPuesto[] {

    const lista : EPuesto[] = [];

    for(const element of elements){
        const objeto = EPuesto.parseJson(element);       
        lista.push(objeto);
    }

    return lista;
  }
}
