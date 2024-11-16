import { Funciones } from "../../utils/Funciones";
import { SPParse } from "../../utils/SPParse";
import { EUsuarioLookup } from "./EUsuarioLookup";
import { Lookup } from "../base/Lookup";

export class EPoliza {
    Id: any;
    NumeroPoliza: string;
    CompaniaAseguradora: Lookup;
    TipoPoliza: Lookup;
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
        this.NumeroPoliza = "";
        this.CompaniaAseguradora = new Lookup();
        this.TipoPoliza = new Lookup();
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

    public static parseJson(element: any): EPoliza {
        const objeto = new EPoliza();

        objeto.Id = SPParse.getString(element["id"]);
        objeto.NumeroPoliza = SPParse.getString(element["numeroPoliza"]);
        //objeto.NumeroPoliza = "PO-0001"

        if (!Funciones.esUndefinedNullOrEmpty(element["companiaAseguradora"])) {
            objeto.CompaniaAseguradora = Lookup.parseJson(element["companiaAseguradora"]);
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["tipoPoliza"])) {
            objeto.TipoPoliza = Lookup.parseJson(element["tipoPoliza"]);
        }
        objeto.Monto = SPParse.getString(element["monto"]);
        //objeto.Monto = "50000";

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

    public static parseJsonList(elements: any): EPoliza[] {

        const lista: EPoliza[] = [];

        for (const element of elements) {
            const objeto = EPoliza.parseJson(element);
            lista.push(objeto);
        }

        return lista;
    }
}