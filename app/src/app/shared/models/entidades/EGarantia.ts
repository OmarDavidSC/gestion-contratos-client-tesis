import { Funciones } from "../../utils/Funciones";
import { SPParse } from "../../utils/SPParse";
import { EUsuarioLookup } from "./EUsuarioLookup";
import { Lookup } from "../base/Lookup";
import { EBanco } from "./EBanco";

export class EGarantia {
    Id: any;
    NumeroGarantia: string;
    Banco: Lookup;
    TipoGarantia: Lookup;
    Monto: string;
    Moneda: Lookup;
    FechaInicio: any;
    TextoFechaInicio: string;
    FechaFin: any;
    TextoFechaFin: string;
    NombreArchivo: string;
    ByteArchivo: any;
    UrlDocumento: string;
    Eliminado: boolean;
    PuedeEliminar: boolean;
    PuedeDescargar: boolean;   

    constructor() {
        this.Id = '00000000-0000-0000-0000-000000000000';
        this.NumeroGarantia = "";
        this.Banco = new Lookup();
        this.TipoGarantia = new Lookup();
        this.Monto = "";
        this.Moneda = new Lookup();
        this.FechaInicio = "";
        this.TextoFechaInicio = "";
        this.FechaFin = "";
        this.TextoFechaFin = "";
        this.NombreArchivo = "";
        this.ByteArchivo = null;
        this.UrlDocumento = '';
        this.Eliminado = false;
        this.PuedeEliminar = false;
        this.PuedeDescargar = false;
    }

    public static parseJson(element: any): EGarantia {
        const objeto = new EGarantia();
        objeto.Id = SPParse.getString(element["id"]);
        objeto.NumeroGarantia = SPParse.getString(element["numeroGarantia"]);
        //objeto.NumeroGarantia = "G-0001";

        if (!Funciones.esUndefinedNullOrEmpty(element["banco"])) {
            objeto.Banco =  EBanco.parseJsonLookup(element["banco"]);
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["tipoGarantia"])) {
            objeto.TipoGarantia = Lookup.parseJson(element["tipoGarantia"]);
        }
        objeto.Monto = SPParse.getString(element["monto"]);
        //objeto.Monto = "10000";

        if (!Funciones.esUndefinedNullOrEmpty(element["moneda"])) {
            objeto.Moneda = Lookup.parseJson(element["moneda"]);
        }

        objeto.FechaInicio = SPParse.getDate(element["fechaInicio"]);
        objeto.TextoFechaInicio = Funciones.ConvertirDateToString(objeto.FechaInicio);
        objeto.FechaFin = SPParse.getDate(element["fechaFin"]);
        objeto.TextoFechaFin = Funciones.ConvertirDateToString(objeto.FechaFin);


        if (!Funciones.esUndefinedNullOrEmpty(element["moneda"])) {
            objeto.Moneda = Lookup.parseJson(element["moneda"]);
        }

        objeto.NombreArchivo = SPParse.getString(element["nombreArchivo"]);
        objeto.ByteArchivo = element.byteArchivo;        

        return objeto;
    }

    public static parseJsonList(elements: any): EGarantia[] {

        const lista: EGarantia[] = [];

        for (const element of elements) {
            const objeto = EGarantia.parseJson(element);
            lista.push(objeto);
        }

        return lista;
    }
}