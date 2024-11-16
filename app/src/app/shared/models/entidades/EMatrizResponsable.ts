import { Constantes } from "../../utils/Constantes";
import { RestFiltros } from "../../utils/RestFiltros";
import { SPParse } from "../../utils/SPParse";
import { Lookup } from "../base/Lookup";
import { SPUser } from "../base/SPUser";

export class EMatrizResponsable {
    Id: number;
    Motivo: Lookup;
    Remitente: Lookup;
    Usuarios: any;
    NombreUsuarios: string;
    Habilitado: Boolean;
    TextoHabilitado: string;

    constructor() {
        this.Id = 0;
        this.Motivo = new Lookup();
        this.Remitente = new Lookup();
        this.Usuarios = [];
        this.NombreUsuarios = "";
        this.Habilitado = false;
        this.TextoHabilitado = "";

    }

    public static getColumnasSelect(): string[] {
        return [
            Constantes.columnas.Id,
            Constantes.columnas.Title,
            RestFiltros.obtenerFieldExpandLookup(Constantes.columnas.Motivo),
            RestFiltros.obtenerFieldExpandLookup(Constantes.columnas.Remitente),
            RestFiltros.obtenerFieldExpandUsuario(Constantes.columnas.Usuarios),
            Constantes.columnas.Habilitado
        ];
    }

    public static getColumnasExpand(): string[] {
        return [
            Constantes.columnas.Motivo,
            Constantes.columnas.Remitente,
            Constantes.columnas.Usuarios
        ];
    }

    public static parseJson(element: any): EMatrizResponsable {
        const objeto = new EMatrizResponsable();
      
        objeto.Id = SPParse.getNumber(element[Constantes.columnas.Id]);
        objeto.Motivo = Lookup.parseJson(element[Constantes.columnas.Motivo]);
        objeto.Remitente = Lookup.parseJson(element[Constantes.columnas.Remitente]);
        objeto.Usuarios = SPUser.parseJsonList(element[Constantes.columnas.Usuarios]);

        for (const usuario of objeto.Usuarios) {
            if (objeto.NombreUsuarios.length > 0) {
                objeto.NombreUsuarios += " / ";
            }
            objeto.NombreUsuarios += usuario.Title;
        }

        objeto.Habilitado = element[Constantes.columnas.Habilitado];
        objeto.TextoHabilitado = objeto.Habilitado ? "Si" : "No";
        return objeto;
    }

    public static parseJsonList(elements: any): EMatrizResponsable[] {

        const lista: EMatrizResponsable[] = [];

        for (const element of elements) {
            const objeto = EMatrizResponsable.parseJson(element);
            lista.push(objeto);
        }

        return lista;
    }
}