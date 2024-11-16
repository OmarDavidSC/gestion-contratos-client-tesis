import { SPParse } from "../../utils/SPParse";
import { Lookup } from "../base/Lookup";

export class EDocumentoAdiconal {
    Id: string;
    NombreArchivo: string;
    ByteArchivo: any;
    TipoDocumento: Lookup;
    UrlDocumento: string;
    Eliminado: boolean;
    PuedeEliminar: boolean;
    PuedeDescargar: boolean;

    constructor() {
        this.Id = '00000000-0000-0000-0000-000000000000';
        this.NombreArchivo = '';
        this.ByteArchivo = null;
        this.TipoDocumento = new Lookup();
        this.UrlDocumento = '';
        this.Eliminado = false;
        this.PuedeEliminar = false;
        this.PuedeDescargar = false;
    }

    public static parseJson(element: any): EDocumentoAdiconal {
       
        const objeto = new EDocumentoAdiconal();
        objeto.Id = SPParse.getString(element["id"]);
        objeto.NombreArchivo = SPParse.getString(element["nombreArchivo"]);
        objeto.TipoDocumento = Lookup.parseJson(element["tipoDocumento"]);
        objeto.ByteArchivo = element.byteArchivo;

        return objeto;
    }
}
