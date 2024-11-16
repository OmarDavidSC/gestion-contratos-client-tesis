import { Constantes } from "../../utils/Constantes";
import { Funciones } from "../../utils/Funciones";
import { RestFiltros } from "../../utils/RestFiltros";
import { SPParse } from "../../utils/SPParse";
import { EArchivo } from "../base/EArchivo";
import { Lookup } from "../base/Lookup";
import { SPUser } from "../base/SPUser";
import { EComentario } from "./EComentario";
import { EHistorial } from "./EHistorial";
import { EParametro } from "./EParametro";
import { ERemitenteExterno } from "./ERemitenteExterno";

export class EDatosDocumento {
    Id: number;
    Codigo: string;
    Asunto: string;
    Remitente: Lookup;
    Motivo: Lookup;
    TipoDocumento: Lookup;
    Area: Lookup;
    Estado: Lookup;
    FechaPlazo: any;
    TextoFechaPlazo: string;
    RequiereRespuesta: boolean;
    TextoRequiereRespuesta: string;
    EsUrgente: boolean;
    TextoEsUrgente: string;
    Comentarios: string;

    Responsables: any;
    NombresResponsables: string;

    //NotificarA: any;
    //NombresNotificarA: string;

    CorreosExternos: string;

    RegistradoPor: SPUser;
    FechaRegistro: any;
    TextoFechaRegistro: string;

    ComentarioDevolucion: string;

    ListaArchivoAdjunto: EArchivo[];

    ListaComentario: EComentario[];
    ListaHistorial: EHistorial[];

    ColorIndicador: string;
    DiasPendientes: any;

    EntidadExternaBuscar: string;
    EntidadRemitente: ERemitenteExterno;

    constructor() {
        this.Id = 0;
        this.Codigo = "";
        this.Asunto = "";
        this.Remitente = new Lookup();
        this.Motivo = new Lookup();
        this.TipoDocumento = new Lookup();
        this.Area = new Lookup();
        this.Estado = new Lookup();
        this.FechaPlazo = "";
        this.TextoFechaPlazo = "";
        this.RequiereRespuesta = false;
        this.TextoRequiereRespuesta = "No";
        this.EsUrgente = false;
        this.TextoEsUrgente = "No";
        this.Comentarios = "";

        this.Responsables = [];
        this.NombresResponsables = "";

        //this.NotificarA = "";
        //this.NombresNotificarA = "";

        this.CorreosExternos = "";

        this.RegistradoPor = new SPUser();
        this.FechaRegistro = "";
        this.TextoFechaRegistro = "";

        this.ComentarioDevolucion = "";

        this.ListaArchivoAdjunto = [];

        this.ListaComentario = [];
        this.ListaHistorial = [];

        this.ColorIndicador = "";
        this.DiasPendientes = "";

        this.EntidadExternaBuscar = "";
        this.EntidadRemitente = new ERemitenteExterno();
    }

    public static getColumnasSelect(): string[] {
        return [
            Constantes.columnas.Id,
            Constantes.columnas.Title,
            Constantes.columnas.Asunto,
            RestFiltros.obtenerFieldExpandLookup(Constantes.columnas.Remitente),
            RestFiltros.obtenerFieldExpandLookup(Constantes.columnas.Motivo),
            RestFiltros.obtenerFieldExpandLookup(Constantes.columnas.TipoDocumento),
            RestFiltros.obtenerFieldExpandLookup(Constantes.columnas.Area),
            RestFiltros.obtenerFieldExpandLookup(Constantes.columnas.Estado),
            Constantes.columnas.FechaPlazo,
            Constantes.columnas.RequiereRespuesta,
            Constantes.columnas.EsUrgente,
            Constantes.columnas.Comentarios,
            RestFiltros.obtenerFieldExpandUsuario(Constantes.columnas.Responsables),
            //RestFiltros.obtenerFieldExpandUsuario(Constantes.columnas.NotificarA),
            Constantes.columnas.CorreosExternos,
            RestFiltros.obtenerFieldExpandUsuario(Constantes.columnas.Author),
            Constantes.columnas.Created,
            Constantes.columnas.ComentarioDevolucion
        ]
    }

    public static getColumnasExpand(): string[] {
        return [
            Constantes.columnas.Remitente,
            Constantes.columnas.Motivo,
            Constantes.columnas.TipoDocumento,
            Constantes.columnas.Area,
            Constantes.columnas.Estado,
            Constantes.columnas.Responsables,
            Constantes.columnas.Author
        ]
    }

    public static parseJson(element: any): EDatosDocumento {
        const objeto = new EDatosDocumento();

        objeto.Id = SPParse.getNumber(element[Constantes.columnas.Id]);
        objeto.Codigo = SPParse.getString(element[Constantes.columnas.Title]);
        objeto.Asunto = SPParse.getString(element[Constantes.columnas.Asunto]);
        objeto.Remitente = Lookup.parseJson(element[Constantes.columnas.Remitente]);
        objeto.Motivo = Lookup.parseJson(element[Constantes.columnas.Motivo]);
        objeto.TipoDocumento = Lookup.parseJson(element[Constantes.columnas.TipoDocumento]);
        objeto.Area = Lookup.parseJson(element[Constantes.columnas.Area]);
        objeto.Estado = Lookup.parseJson(element[Constantes.columnas.Estado]);
        objeto.FechaPlazo = SPParse.getDate(element[Constantes.columnas.FechaPlazo]);
        objeto.TextoFechaPlazo = Funciones.ConvertirDateToString(objeto.FechaPlazo);
        objeto.RequiereRespuesta = SPParse.getBool(element[Constantes.columnas.RequiereRespuesta]);
        objeto.TextoRequiereRespuesta = objeto.RequiereRespuesta ? "Sí" : "No";
        objeto.EsUrgente = SPParse.getBool(element[Constantes.columnas.EsUrgente]);
        objeto.TextoEsUrgente = objeto.EsUrgente ? "Sí" : "No";
        objeto.Comentarios = SPParse.getString(element[Constantes.columnas.Comentarios]);
        objeto.Responsables = SPUser.parseJsonList(element[Constantes.columnas.Responsables]);
        objeto.RegistradoPor = SPUser.parseJson(element[Constantes.columnas.Author]);
        objeto.FechaRegistro = SPParse.getDate(element[Constantes.columnas.Created]);
        objeto.TextoFechaRegistro = Funciones.ConvertirDateToString(objeto.FechaRegistro);
        objeto.ComentarioDevolucion = SPParse.getString(element[Constantes.columnas.ComentarioDevolucion]);
        //objeto.NotificarA = SPUser.parseJsonList(element[Constantes.columnas.NotificarA]);
        objeto.CorreosExternos = SPParse.getString(element[Constantes.columnas.CorreosExternos]);

        for (const usuario of objeto.Responsables) {
            if (objeto.NombresResponsables.length > 0) {
                objeto.NombresResponsables += " / ";
            }
            objeto.NombresResponsables += usuario.Title;
        }

        return objeto;
    }

    public static parseJsonBandeja(element: any, itemAdmParametro: EParametro): EDatosDocumento {
        const objeto = new EDatosDocumento();

        objeto.Id = SPParse.getNumber(element[Constantes.columnas.Id]);
        objeto.Codigo = SPParse.getString(element[Constantes.columnas.Title]);
        objeto.Asunto = SPParse.getString(element[Constantes.columnas.Asunto]);
        objeto.Remitente = Lookup.parseJson(element[Constantes.columnas.Remitente]);
        objeto.Motivo = Lookup.parseJson(element[Constantes.columnas.Motivo]);
        objeto.TipoDocumento = Lookup.parseJson(element[Constantes.columnas.TipoDocumento]);
        objeto.Area = Lookup.parseJson(element[Constantes.columnas.Area]);
        objeto.Estado = Lookup.parseJson(element[Constantes.columnas.Estado]);
        objeto.FechaPlazo = SPParse.getDate(element[Constantes.columnas.FechaPlazo]);
        objeto.TextoFechaPlazo = Funciones.ConvertirDateToString(objeto.FechaPlazo);
        objeto.RequiereRespuesta = SPParse.getBool(element[Constantes.columnas.RequiereRespuesta]);
        objeto.TextoRequiereRespuesta = objeto.RequiereRespuesta ? "Sí" : "No";
        objeto.EsUrgente = SPParse.getBool(element[Constantes.columnas.EsUrgente]);
        objeto.TextoEsUrgente = objeto.EsUrgente ? "Sí" : "No";
        objeto.Comentarios = SPParse.getString(element[Constantes.columnas.Comentarios]);
        objeto.Responsables = SPUser.parseJsonList(element[Constantes.columnas.Responsables]);
        objeto.RegistradoPor = SPUser.parseJson(element[Constantes.columnas.Author]);
        objeto.FechaRegistro = SPParse.getDate(element[Constantes.columnas.Created]);
        objeto.TextoFechaRegistro = Funciones.ConvertirDateToString(objeto.FechaRegistro);
        objeto.ComentarioDevolucion = SPParse.getString(element[Constantes.columnas.ComentarioDevolucion]);
        //objeto.NotificarA = SPUser.parseJsonList(element[Constantes.columnas.NotificarA]);
        objeto.CorreosExternos = SPParse.getString(element[Constantes.columnas.CorreosExternos]);

        for (const usuario of objeto.Responsables) {
            if (objeto.NombresResponsables.length > 0) {
                objeto.NombresResponsables += " / ";
            }
            objeto.NombresResponsables += usuario.Title;
        }        

        return objeto;
    }

    public static parseJsonList(elements: any): EDatosDocumento[] {

        const lista: EDatosDocumento[] = [];

        for (const element of elements) {
            const objeto = EDatosDocumento.parseJson(element);
            lista.push(objeto);
        }

        return lista;
    }

    public static parseJsonListBandeja(elements: any, itemAdmParametro: EParametro): EDatosDocumento[] {

        const lista: EDatosDocumento[] = [];

        for (const element of elements) {
            const objeto = EDatosDocumento.parseJsonBandeja(element, itemAdmParametro);
            lista.push(objeto);
        }

        return lista;
    }

    public static obtenerDiferenciaDeDias(fechaInicio: Date, fechaFin: Date): { diasTotales: number; diasRestantes: number } {
        // Obtener la diferencia en milisegundos
        const diferenciaEnMilisegundos = fechaFin.getTime() - fechaInicio.getTime();

        // Calcular los días totales
        const diasTotales = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

        // Calcular los días restantes
        const fechaActual = new Date();
        const diasRestantes = Math.floor((fechaFin.getTime() - fechaActual.getTime()) / (1000 * 60 * 60 * 24));

        return { diasTotales, diasRestantes };
    }

    public static obtenerPorcentajeDias(diasTotales: number, diasRestantes: number): { porcentajeTranscurrido: number; porcentajeRestante: number } {

        // Calcular el porcentaje de días transcurridos
        const porcentajeTranscurrido = (diasTotales - diasRestantes) / diasTotales * 100;

        // Calcular el porcentaje de días restantes
        const porcentajeRestante = diasRestantes / diasTotales * 100;

        return { porcentajeTranscurrido, porcentajeRestante };
    }
}