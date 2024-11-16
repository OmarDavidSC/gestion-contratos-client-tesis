import { SPParse } from "../../utils/SPParse";

export class EArchivoContrato {
    Id: string;
    NombreArchivo: string;
    ByteArchivo: any;
    UrlDocumento: string;
    Eliminado: boolean;
    PuedeEliminar: boolean;
    PuedeDescargar: boolean;

    constructor() {
        this.Id = '00000000-0000-0000-0000-000000000000';
        this.NombreArchivo = '';
        this.ByteArchivo = "";
        this.UrlDocumento = '';
        this.Eliminado = false;
        this.PuedeEliminar = false;
        this.PuedeDescargar = false;
    }

    public static parseJson(element: any): EArchivoContrato {

        const objeto = new EArchivoContrato();
        objeto.Id = SPParse.getString(element["id"]);
        objeto.NombreArchivo = SPParse.getString(element["nombreArchivo"]);
        objeto.ByteArchivo =  element.byteArchivo;

        return objeto;
    }
}
