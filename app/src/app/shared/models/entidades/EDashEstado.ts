import { Funciones } from "../../utils/Funciones";
import { EListContrato } from "./EListContrato";

export class EDashEstado {
    Estado: string;
    Cantidad: number;
    Contratos: EListContrato[];

    constructor() {
        this.Estado = "";
        this.Cantidad = 0;
        this.Contratos = [];
    }

    public static parseJson(element: any): EDashEstado {
        const objeto = new EDashEstado();
        objeto.Estado = element['estado'];
        objeto.Cantidad = element['cantidad'];
        if (!Funciones.esUndefinedNullOrEmpty(element["contratos"]) && element["contratos"].length > 0) {
            for (const item of element["contratos"]) {
                const datos = EListContrato.parseJson(item);
                objeto.Contratos.push(datos);
            }
        }
        return objeto;
    }

    public static parseJsonList(elements: any): EDashEstado[] {
        const lista: EDashEstado[] = [];
        for (const element of elements) {
            const objeto = EDashEstado.parseJson(element);
            lista.push(objeto);
        }
        return lista;
    }
}