import { Constantes } from "../../utils/Constantes";
import { Funciones } from "../../utils/Funciones";
import { RestFiltros } from "../../utils/RestFiltros";
import { SPParse } from "../../utils/SPParse";
import { EArchivo } from "../base/EArchivo";
import { EUsuarioLookup } from "./EUsuarioLookup";
import { Lookup } from "../base/Lookup";
import { SPUser } from "../base/SPUser";
import { EAdenda } from "./EAdenda";
import { EAdministradorContrato } from "./EAdministradorContrato";
import { EArchivoContrato } from "./EArchivoContrato";
import { EArea } from "./EArea";
import { EDocumentoAdiconal } from "./EDocumentoAdicional";
import { EGarantia } from "./EGarantia";
import { EHistorial } from "./EHistorial";
import { EMetodoEntrega } from "./EMetodoEntrega";
import { EMoneda } from "./EMoneda";
import { EParametro } from "./EParametro";
import { EPoliza } from "./EPolizas";
import { EProveedor } from "./EProveedor";
import { ERemitenteExterno } from "./ERemitenteExterno";
import { ESistemaContratacion } from "./ESistemaContratacion";
import { ETipoContrato } from "./ETIpoContrato";
import { ETipoPoliza } from "./ETipoPoliza";
import { EComentario } from "./EComentario";

export class EDatosContrato {
    Id: any;
    CodigoContrato: string;
    TituloContrato: string;

    Estado: Lookup;
    Area: Lookup;
    Proveedor: Lookup;
    TipoContrato: Lookup;

    DetalleContrato: string;
    FechaInicio: any;
    TextoFechaInicio: string;
    FechaFin: any;
    TextoFechaFin: string;
    FechaFinReal: any;
    TextoFechaFinReal: string;
    MontoContrato: string;
    DiasFaltanParaVencimiento: number;

    MontoTotal: string;

    Moneda: Lookup;
    MetodoEntrega: Lookup;
    SistemaContratacion: Lookup;

    FechaCierreContrato: any;
    TextoFechaCierreContrato: string;

    UsuarioAprobadorContrato: EUsuarioLookup;
    UsuarioAprobadorCierre: EUsuarioLookup;

    FechaAnulacion: any;
    TextoFechaAnulacion: string;
    MotivoAnulacion: string;
    ComentarioCierreContrato: string;
    Eliminado: Boolean;
    TextoEliminado: string;

    UsuarioRegistro: EUsuarioLookup;
    FechaRegistro: any;
    TextoFechaRegistro: string;

    UsuarioModificacion: EUsuarioLookup;
    FechaModificacion: any;
    TextoFechaModificacion: string;

    ListaAdenda: EAdenda[];
 
    ListaAdministrador: EAdministradorContrato[];
    NombresAdministradores: string;
    ListaArchivosContrato: EArchivoContrato[];
    ListaArchivosAdiconales: EDocumentoAdiconal[];
    ListaArchivosGarantia: EGarantia[];
    ListaArchivosPoliza: EPoliza[]; 
   
    Comentarios: string;
    ListaComentario: EComentario[];
    ListaHistorial: EHistorial[];

    constructor() {
        this.Id = "";
        this.CodigoContrato = "";
        this.TituloContrato = "";
        this.Estado = new Lookup;
        this.Area = new Lookup;
        this.Proveedor = new Lookup;
        this.TipoContrato = new Lookup;
        this.DetalleContrato = "";
        this.FechaInicio = "";
        this.TextoFechaInicio = "";
        this.FechaFinReal = "";
        this.TextoFechaFinReal = "";
        this.MontoContrato = "";
        this.MontoTotal = "";
        this.DiasFaltanParaVencimiento = 0;
        this.Moneda = new Lookup;
        this.MetodoEntrega = new Lookup;
        this.SistemaContratacion = new Lookup;
        this.FechaCierreContrato = "";
        this.TextoFechaCierreContrato = "";
        this.UsuarioAprobadorContrato = new EUsuarioLookup;
        this.UsuarioAprobadorCierre = new EUsuarioLookup;
        this.FechaAnulacion = "";
        this.TextoFechaAnulacion = "";
        this.MotivoAnulacion = "";
        this.ComentarioCierreContrato = "";
        this.Eliminado = false;
        this.TextoEliminado = "";
        this.UsuarioRegistro = new EUsuarioLookup;
        this.FechaRegistro = "";
        this.TextoFechaRegistro = "";
        this.UsuarioModificacion = new EUsuarioLookup;
        this.FechaModificacion = "";
        this.TextoFechaModificacion = "";

        this.ListaAdenda = [];

        this.ListaAdministrador = [];
        this.NombresAdministradores = "";

        this.ListaArchivosContrato = [];
        this.ListaArchivosAdiconales = [];
        this.ListaArchivosGarantia = [];
        this.ListaArchivosPoliza = [];

        this.Comentarios = "";
        this.ListaComentario = [];
        this.ListaHistorial = [];      
    }

    public static parseJson(element: any): EDatosContrato {

        const objeto = new EDatosContrato();

        objeto.Id = SPParse.getString(element["id"]);
        objeto.CodigoContrato = SPParse.getString(element["codigoContrato"]);
        objeto.TituloContrato = SPParse.getString(element["tituloContrato"]);
        objeto.Estado = Lookup.parseJson(element["estado"]);
        if (!Funciones.esUndefinedNullOrEmpty(element["area"])) {
            objeto.Area = EArea.parseJsonLookup(element["area"]);
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["proveedor"])) {
            objeto.Proveedor = EProveedor.parseJsonLookup(element["proveedor"]);
        }

        objeto.TipoContrato = ETipoContrato.parseJsonLookup(element["tipoContrato"]);
        objeto.DetalleContrato = SPParse.getString(element["detalleContrato"]);
        objeto.FechaInicio = SPParse.getDate(element["fechaInicio"]);
        objeto.TextoFechaInicio = Funciones.ConvertirDateFechaHoraToString(objeto.FechaInicio);
        objeto.FechaFin = SPParse.getDate(element["fechaFin"]);
        objeto.TextoFechaFin = Funciones.ConvertirDateFechaHoraToString(objeto.FechaFin);
        objeto.FechaFinReal = SPParse.getDate(element["fechaFinReal"]);
        objeto.TextoFechaFinReal = Funciones.ConvertirDateFechaHoraToString(objeto.FechaFinReal);
        objeto.MontoContrato = SPParse.getString(element["montoContrato"]);
        objeto.MontoTotal = SPParse.getString(element["montoTotal"]);
        objeto.Moneda = EMoneda.parseJsonLookup(element["moneda"]);
        objeto.MetodoEntrega = EMetodoEntrega.parseJsonLookup(element["metodoEntrega"]);
        objeto.SistemaContratacion = ESistemaContratacion.parseJsonLookup(element["sistemaContratacion"]);
        objeto.FechaCierreContrato = SPParse.getDate(element["fechaCierreContrato"]);
        objeto.TextoFechaCierreContrato = Funciones.ConvertirDateFechaHoraToString(objeto.FechaCierreContrato);
        
        if (!Funciones.esUndefinedNullOrEmpty(element["usuarioAprobadorContrato"])) {
            objeto.UsuarioAprobadorContrato = EUsuarioLookup.parseJson(element["usuarioAprobadorContrato"])
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["usuarioAprobadorCierre"])) {
            objeto.UsuarioAprobadorCierre = EUsuarioLookup.parseJson(element["usuarioAprobadorCierre"])
        }        

        objeto.FechaAnulacion = SPParse.getDate(element["fechaAnulacion"]);
        objeto.TextoFechaAnulacion = Funciones.ConvertirDateFechaHoraToString(objeto.FechaAnulacion);
        objeto.MotivoAnulacion = SPParse.getString(element["motivoAnulacion"]);
        objeto.ComentarioCierreContrato = SPParse.getString(element["comentarioCierreContrato"]);
        objeto.Eliminado = SPParse.getBool(element["eliminado"]);
        objeto.TextoEliminado = objeto.Eliminado ? "Sí" : "No";

        if (!Funciones.esUndefinedNullOrEmpty(element["usuarioRegistro"])) {
            objeto.UsuarioRegistro = EUsuarioLookup.parseJson(element["usuarioRegistro"]);
            objeto.FechaRegistro = SPParse.getDate(element["fechaRegistro"]);
            objeto.TextoFechaRegistro = Funciones.ConvertirDateFechaHoraToString(objeto.FechaRegistro);
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["usuarioModificacion"])) {
            objeto.UsuarioModificacion = element["usuarioModificacion"] ? EUsuarioLookup.parseJson(element["usuarioModificacion"]) : new EUsuarioLookup();
            objeto.FechaModificacion = SPParse.getDate(element["fechaModificacion"]);
            objeto.TextoFechaModificacion = Funciones.ConvertirDateFechaHoraToString(objeto.FechaModificacion);
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["adenda"]) && element["adenda"].length > 0) {
            for (const item of element["adenda"]) {
                const datos = EAdenda.parseJson(item);
                objeto.ListaAdenda.push(datos);
            }
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["administradoresContratos"]) && element["administradoresContratos"].length > 0) {
            for (const item of element["administradoresContratos"]) {
                const datos = EAdministradorContrato.parseJson(item);
                objeto.ListaAdministrador.push(datos);
            }
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["archivoContratos"]) && element["archivoContratos"].length > 0) {
            for (const item of element["archivoContratos"]) {
                const datos = EArchivoContrato.parseJson(item);
                objeto.ListaArchivosContrato.push(datos);
            }
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["documentosAdicionales"]) && element["documentosAdicionales"].length > 0) {
            
            for (const item of element["documentosAdicionales"]) {
                const datos = EDocumentoAdiconal.parseJson(item);
                objeto.ListaArchivosAdiconales.push(datos);
            }
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["garantia"]) && element["garantia"].length > 0) {
            for (const item of element["garantia"]) {
                const datos = EGarantia.parseJson(item);
                objeto.ListaArchivosGarantia.push(datos);
            }
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["polizas"]) && element["polizas"].length > 0) {
            for (const item of element["polizas"]) {
                const datos = EPoliza.parseJson(item);
                objeto.ListaArchivosPoliza.push(datos);
            }
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["historialEventos"]) && element["historialEventos"].length > 0) {
            for (const item of element["historialEventos"]) {
                const datos = EHistorial.parseJson(item);
                objeto.ListaHistorial.push(datos);
            }
        }
        
        return objeto;
    }

    public static parseJsonBandeja(element: any): EDatosContrato {
        const objeto = new EDatosContrato();

        objeto.Id = SPParse.getString(element["id"]);
        objeto.CodigoContrato = SPParse.getString(element["codigoContrato"]);
        objeto.TituloContrato = SPParse.getString(element["tituloContrato"]);
        objeto.Estado = Lookup.parseJson(element["estado"]);

        if (!Funciones.esUndefinedNullOrEmpty(element["area"])) {
            objeto.Area = EArea.parseJsonLookup(element["area"]);
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["proveedor"])) {
            objeto.Proveedor = EProveedor.parseJsonLookup(element["proveedor"]);
        }

        objeto.TipoContrato = ETipoContrato.parseJsonLookup(element["tipoContrato"]);
        objeto.DetalleContrato = SPParse.getString(element["detalleContrato"]);
        objeto.FechaInicio = SPParse.getDate(element["fechaInicio"]);
        objeto.TextoFechaInicio = Funciones.ConvertirDateToString(objeto.FechaInicio);
        objeto.FechaFin = SPParse.getDate(element["fechaFin"]);
        objeto.TextoFechaFin = Funciones.ConvertirDateToString(objeto.FechaFin);
        objeto.FechaFinReal = SPParse.getDate(element["fechaFinReal"]);
        objeto.TextoFechaFinReal = Funciones.ConvertirDateToString(objeto.FechaFinReal);
        objeto.MontoContrato = SPParse.getString(element["montoContrato"]);
        objeto.DiasFaltanParaVencimiento = SPParse.getNumber(element["diasFaltanParaVencimiento"]);
        objeto.MontoTotal = SPParse.getString(element["montoTotal"]);
        objeto.Moneda = EMoneda.parseJsonLookup(element["moneda"]);
        objeto.MetodoEntrega = EMetodoEntrega.parseJsonLookup(element["metodoEntrega"]);
        objeto.SistemaContratacion = ESistemaContratacion.parseJsonLookup(element["sistemaContratacion"]);
        objeto.FechaCierreContrato = SPParse.getDate(element["fechaCierreContrato"]);
        objeto.TextoFechaCierreContrato = Funciones.ConvertirDateToString(objeto.FechaCierreContrato);

        if (!Funciones.esUndefinedNullOrEmpty(element["usuarioAprobadorContrato"])) {
            objeto.UsuarioAprobadorContrato = EUsuarioLookup.parseJson(element["usuarioAprobadorContrato"])
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["usuarioAprobadorCierre"])) {
            objeto.UsuarioAprobadorCierre = EUsuarioLookup.parseJson(element["usuarioAprobadorCierre"])
        }  

        objeto.FechaAnulacion = SPParse.getDate(element["fechaAnulacion"]);
        objeto.TextoFechaAnulacion = Funciones.ConvertirDateToString(objeto.FechaAnulacion);
        objeto.MotivoAnulacion = SPParse.getString(element["motivoAnulacion"]);
        objeto.ComentarioCierreContrato = SPParse.getString(element["comentarioCierreContrato"]);
        objeto.Eliminado = SPParse.getBool(element["eliminado"]);
        objeto.TextoEliminado = objeto.Eliminado ? "Sí" : "No";

        if (!Funciones.esUndefinedNullOrEmpty(element["usuarioRegistro"])) {
            objeto.UsuarioRegistro = EUsuarioLookup.parseJson(element["usuarioRegistro"]);
            objeto.FechaRegistro = SPParse.getDate(element["fechaRegistro"]);
            objeto.TextoFechaRegistro = Funciones.ConvertirDateToString(objeto.FechaRegistro);
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["usuarioModificacion"])) {
            objeto.UsuarioModificacion = element["usuarioModificacion"] ? EUsuarioLookup.parseJson(element["usuarioModificacion"]) : new EUsuarioLookup();
            objeto.FechaModificacion = SPParse.getDate(element["fechaModificacion"]);
            objeto.TextoFechaModificacion = Funciones.ConvertirDateToString(objeto.FechaModificacion);
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["administradoresContratos"]) && element["administradoresContratos"].length > 0) {
            for (const item of element["administradoresContratos"]) {
                const datos = EAdministradorContrato.parseJson(item);
                objeto.ListaAdministrador.push(datos);
            }

            for (const administrador of objeto.ListaAdministrador) {
                if (objeto.NombresAdministradores.length > 0) {
                    objeto.NombresAdministradores += " / ";
                }
                objeto.NombresAdministradores += administrador.Nombre;
            }
        }

        if (!Funciones.esUndefinedNullOrEmpty(element["archivoContratos"]) && element["archivoContratos"].length > 0) {
            for (const item of element["archivoContratos"]) {
                const datos = EArchivoContrato.parseJson(item);
                objeto.ListaArchivosContrato.push(datos);
            }
        }
       
        return objeto;
    }

    public static calcularMontoTotalYFechaFinReal(objeto: EDatosContrato): void {
        let montoTotal = objeto.MontoContrato;
        let fechaFinReal = objeto.FechaFin;
      
        if (objeto.ListaAdenda.length > 0) {
          for (const adenda of objeto.ListaAdenda) {
            montoTotal += adenda.Monto;
            fechaFinReal = adenda.FechaFin;
          }
        }
      
        objeto.MontoTotal = montoTotal.toString();
        objeto.FechaFinReal = fechaFinReal;
        objeto.TextoFechaFinReal = Funciones.ConvertirDateToString(fechaFinReal);
      }

    public static parseJsonList(elements: any): EDatosContrato[] {

        const lista: EDatosContrato[] = [];

        for (const element of elements) {
            const objeto = EDatosContrato.parseJson(element);
            lista.push(objeto);
        }

        return lista;
    }

    public static parseJsonListBandeja(elements: any): EDatosContrato[] {

        const lista: EDatosContrato[] = [];

        for (const element of elements) {
            const objeto = EDatosContrato.parseJsonBandeja(element);
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