import { Constantes } from "../../utils/Constantes";
import { SPParse } from "../../utils/SPParse";

export class EParametro {

    Id: number;
    Title: string;
    IndicadorVerde: number;
    IndicadorAmarillo: number;
    IndicadorRojo: number;
    DiasAntesAlerta: string;

    constructor() {
        this.Id = 0;
        this.Title = "";
        this.IndicadorVerde = 0;
        this.IndicadorAmarillo = 0;
        this.IndicadorRojo = 0;
        this.DiasAntesAlerta = "";
    }

    public static getColumnasSelect(): string[] {
        return [
            Constantes.columnas.Id,
            Constantes.columnas.Title,
            Constantes.columnas.IndicadorVerde,
            Constantes.columnas.IndicadorAmarillo,
            Constantes.columnas.IndicadorRojo,
            Constantes.columnas.DiasAntesAlerta
        ];
    }

    public static parseJson(element: any): EParametro {
        const objeto = new EParametro();

        objeto.Id = SPParse.getNumber(element[Constantes.columnas.Id]);
        objeto.Title = SPParse.getString(element[Constantes.columnas.Title]);
        objeto.IndicadorVerde = SPParse.getNumber(element[Constantes.columnas.IndicadorVerde]);
        objeto.IndicadorAmarillo = SPParse.getNumber(element[Constantes.columnas.IndicadorAmarillo]);
        objeto.IndicadorRojo = SPParse.getNumber(element[Constantes.columnas.IndicadorRojo]);
        objeto.DiasAntesAlerta = SPParse.getString(element[Constantes.columnas.DiasAntesAlerta]);
        return objeto;

    }


    public static parseJsonList(elements: any): EParametro[] {
        const lista: EParametro[] = [];

        for (const element of elements) {
            const objeto = EParametro.parseJson(element);
            lista.push(objeto);
        }

        return lista;
    }
}