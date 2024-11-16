import { Constantes } from "../../utils/Constantes";
import { RestFiltros } from "../../utils/RestFiltros";
import { SPParse } from "../../utils/SPParse";
import { Lookup } from "../base/Lookup";

export class ERemitente {
    Id: number;
    Title: string;
    Area: Lookup;
    Habilitado: Boolean;
    TextoHabilitado: string;

    constructor() {
        this.Id = 0;
        this.Title = "";
        this.Area = new Lookup();
        this.Habilitado = false;
        this.TextoHabilitado = "";
    }

    public static getColumnasSelect(): string[] {
        return [
            Constantes.columnas.Id,
            Constantes.columnas.Title,
            RestFiltros.obtenerFieldExpandLookup(Constantes.columnas.Area),
            Constantes.columnas.Habilitado
        ];
    } 

    public static getColumnasExpand(): string[] {
        return [
            Constantes.columnas.Area,
        ]
    }

    public static parseJson(element: any): ERemitente {

        const objeto = new ERemitente();

        objeto.Id = SPParse.getNumber(element[Constantes.columnas.Id]);
        objeto.Title = SPParse.getString(element[Constantes.columnas.Title]);
        objeto.Area = Lookup.parseJson(element[Constantes.columnas.Area]);
        objeto.Habilitado = element[Constantes.columnas.Habilitado];
        objeto.TextoHabilitado = objeto.Habilitado ? "Si" : "No";
        return objeto;
    }

    public static parseJsonList(elements: any): ERemitente[] {

        const lista: ERemitente[] = [];

        for (const element of elements) {
            const objeto = ERemitente.parseJson(element);
            lista.push(objeto);
        }

        return lista;
    }
}