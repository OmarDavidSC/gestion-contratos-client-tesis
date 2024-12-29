import { Funciones } from "../../utils/Funciones";
import { SPParse } from "../../utils/SPParse";
import { EUsuarioLookup } from "./EUsuarioLookup";
import { Lookup } from "../base/Lookup";

export class EAdenda {
    Id: any;
    CodigoAdenda: string;
    Descripcion: string;
    TipoAdenda: Lookup;
    FechaInicio: any;
    TextoFechaInicio: string;
    FechaFin: any;
    TextoFechaFin: string;
    Monto: string;
    Moneda: Lookup;
    NombreArchivo: string;
    ByteArchivo: any;
    UrlDocumento: string;
    Eliminado: boolean;
    PuedeEliminar: boolean;
    PuedeDescargar: boolean;
    bloquearCampoAdenda: boolean;

    constructor() {
        this.Id = '00000000-0000-0000-0000-000000000000';
        this.CodigoAdenda = "";
        this.Descripcion = "";
        this.TipoAdenda = new Lookup();
        this.FechaInicio = "";
        this.TextoFechaInicio = "";
        this.FechaFin = "";
        this.TextoFechaFin = "";
        this.Monto = "";
        this.Moneda = new Lookup();
        this.NombreArchivo = "";
        this.ByteArchivo = null;
        this.UrlDocumento = '';
        this.Eliminado = false;
        this.PuedeEliminar = false;
        this.PuedeDescargar = false;
        this.bloquearCampoAdenda  = false;
    }

    public static parseJson(element: any): EAdenda {
        const objeto = new EAdenda();

        objeto.Id = SPParse.getString(element["id"]);
        objeto.CodigoAdenda = SPParse.getString(element["codigoAdenda"]);
        objeto.Descripcion = SPParse.getString(element["descripcion"]);

        if (!Funciones.esUndefinedNullOrEmpty(element["tipoAdenda"])) {
            objeto.TipoAdenda = Lookup.parseJson(element["tipoAdenda"]);
        }

        objeto.FechaInicio = SPParse.getDate(element["fechaInicio"]);
        objeto.TextoFechaInicio = Funciones.ConvertirDateToString(objeto.FechaInicio);
        objeto.FechaFin = SPParse.getDate(element["fechaFin"]);
        objeto.TextoFechaFin = Funciones.ConvertirDateToString(objeto.FechaFin);
        objeto.Monto = SPParse.getString(element["monto"]);

        if (!Funciones.esUndefinedNullOrEmpty(element["moneda"])) {
            objeto.Moneda = Lookup.parseJson(element["moneda"]);
        }

        objeto.NombreArchivo = SPParse.getString(element["nombreArchivo"]);
        objeto.ByteArchivo = element.byteArchivo;

        return objeto;
    }

    public static parseJsonList(elements: any): EAdenda[] {

        const lista: EAdenda[] = [];

        for (const element of elements) {
            const objeto = EAdenda.parseJson(element);
            lista.push(objeto);
        }

        return lista;
    }
}