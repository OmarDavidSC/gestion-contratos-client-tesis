import { SPParse } from "../../utils/SPParse";

export class ENotificaciones {
    IdContrato: any;
    TituloContrato: string;
    FechaVencimiento: string;
    FechaVencimientoLabel: string;
    DiasRestantes: string;
    Mensaje: string;

    constructor() {
        this.IdContrato = "";
        this.TituloContrato = "";
        this.FechaVencimiento = "";
        this.FechaVencimientoLabel = "";
        this.DiasRestantes = "";
        this.Mensaje = "";
    }

    public static parseJson(element: any): ENotificaciones {

        const objeto = new ENotificaciones();
        objeto.IdContrato = SPParse.getString(element["idContrato"]);
        objeto.TituloContrato = SPParse.getString(element["tituloContrato"]);
        objeto.FechaVencimiento = SPParse.getString(element["fechaVencimiento"]);
        objeto.FechaVencimientoLabel = SPParse.getString(element["fechaVencimientoLabel"]);
        objeto.DiasRestantes = SPParse.getString(element["diasRestantes"]);
        objeto.Mensaje = SPParse.getString(element["mensaje"]);
        return objeto;
    }

    public static parseJsonList(elements: any): ENotificaciones[] {

        const lista: ENotificaciones[] = [];

        for (const element of elements) {
            const objeto = ENotificaciones.parseJson(element);
            lista.push(objeto);
        }

        return lista;
    }
}
