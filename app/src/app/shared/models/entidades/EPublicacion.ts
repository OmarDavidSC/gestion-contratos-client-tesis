import { SPParse } from "../../utils/SPParse";
import { EArchivo } from "../base/EArchivo";


export class EPublicacion {
  ID: any;
  Descripcion: string;
  Nombre: string;
  Especie: string;
  Color: string;
  Raza: string;
  Edad: any;
  Genero: any; 
  Foto: EArchivo;
  Imagen: any;

  NombreUsuario: string;

  constructor() {
    this.ID = "";
    this.Descripcion = "";
    this.Nombre = "";
    this.Especie = "";
    this.Color = "";
    this.Raza = "";
    this.Edad = "";
    this.Genero = "";
    this.Foto = new EArchivo;
    this.Imagen = null;

    this.NombreUsuario = "";
  }

  public static parseJson(element: any): EPublicacion {

    const objeto = new EPublicacion();
    objeto.ID = SPParse.getNumber(element["id"]).toString();
    objeto.Descripcion = SPParse.getString(element["descripcion"]);
    objeto.Nombre = SPParse.getString(element["nombre"]);
    objeto.Especie = SPParse.getString(element["especie"]);
    objeto.Raza = SPParse.getString(element["raza"]);
    objeto.Edad = SPParse.getNumber(element["edad"]);
    objeto.Genero = SPParse.getString(element["genero"]);
    objeto.NombreUsuario = SPParse.getString(element["userName"]);
    objeto.Foto.Archivo = element["foto"];

    return objeto;
  }

  public static parseJsonList(elements: any): EPublicacion[] {

    const publicaciones : EPublicacion[] = [];

    for (const element of elements) {
      const objeto = EPublicacion.parseJson(element);      
      publicaciones.push(objeto);
    }

    return publicaciones;
  }

}