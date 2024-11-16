import { Constantes } from "../../utils/Constantes";
import { SPParse } from "../../utils/SPParse";

export class EMotivo {
    Id: number;
    Title: string;
    Estado: Boolean;
    TextoEstado: string;


    constructor() {
        this.Id = 0;
        this.Title = "";
        this.Estado = false;
        this.TextoEstado = "";
    }


    public static getColumnasSelect(): string[] {
        return [
            Constantes.columnas.Id,
            Constantes.columnas.Title,
            Constantes.columnas.Estado
        ];
    }

    public static parseJson(element: any): EMotivo {

        const objeto = new EMotivo();
        objeto.Id = SPParse.getNumber(element[Constantes.columnas.Id]);
        objeto.Title = SPParse.getString(element[Constantes.columnas.Title]);
        objeto.Estado = SPParse.getBool(element[Constantes.columnas.Estado]);
        objeto.TextoEstado = objeto.Estado ? "Si" : "No";

        return objeto;
    }

    public static parseJsonList(elements: any): EMotivo[] {

        const lista: EMotivo[] = [];

        for (const element of elements) {
            const objeto = EMotivo.parseJson(element);
            lista.push(objeto);
        }

        return lista;

    }
}