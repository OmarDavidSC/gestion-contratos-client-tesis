import { Constantes } from "../../utils/Constantes";
import { Funciones } from "../../utils/Funciones";
import { RestFiltros } from "../../utils/RestFiltros";
import { SPParse } from "../../utils/SPParse";
import { Lookup } from "../base/Lookup";

export class EPlantillaCorreo {

    Id: number;
    Plantilla: string;
    Asunto: string;
    Cuerpo: string;
    Para: string[];
    Copia: string[];
    Modulo: string;
    Estado: Lookup;

    constructor() {
        this.Id = 0;
        this.Plantilla = "";
        this.Asunto = "";
        this.Cuerpo = "";
        this.Para = [];
        this.Copia = [];
        this.Modulo = "";
        this.Estado = new Lookup();
    }

    public static getColumnasSelect(): string[] {
        return [
            Constantes.columnas.Id,
            Constantes.columnas.Title,
            Constantes.columnas.Asunto,
            Constantes.columnas.Cuerpo,
            Constantes.columnas.Para,
            Constantes.columnas.Copia,
            Constantes.columnas.Modulo,
            RestFiltros.obtenerFieldExpandLookup(Constantes.columnas.Estado)
        ];
    }

    public static getColumnasExpand(): string[] {
        return [Constantes.columnas.Estado];
    }

    public static parseJson(element: any): EPlantillaCorreo {
        const objeto = new EPlantillaCorreo();
        objeto.Id = SPParse.getNumber(element[Constantes.columnas.Id]);
        objeto.Plantilla = SPParse.getString(element[Constantes.columnas.Title]);
        objeto.Asunto = SPParse.getString(element[Constantes.columnas.Asunto]);
        objeto.Cuerpo = SPParse.getString(element[Constantes.columnas.Cuerpo]);
        objeto.Para = element[Constantes.columnas.Para];
        if (!Funciones.esUndefinedNullOrEmpty(element[Constantes.columnas.Copia])) {
            objeto.Copia = element[Constantes.columnas.Copia];
        }
        objeto.Modulo = SPParse.getString(element[Constantes.columnas.Modulo]);
        objeto.Estado = Lookup.parseJson(element[Constantes.columnas.Estado]);
        return objeto;
    }

    public static parseJsonList(elements: any): EPlantillaCorreo[] {
        const lista: EPlantillaCorreo[] = [];

        for (const element of elements) {
            const objeto = EPlantillaCorreo.parseJson(element);
            lista.push(objeto);
        }

        return lista;
    }
}