export class EDashTipoContrato {
    TipoContraro: string;
    Cantidad: number;

    constructor() {
        this.TipoContraro = "";
        this.Cantidad = 0;
    }

    public static parseJson(element: any): EDashTipoContrato {
        const objeto = new EDashTipoContrato();
        objeto.TipoContraro = element['tipoContraro'];
        objeto.Cantidad = element['cantidad'];
        return objeto;
    }

    public static parseJsonList(elements: any): EDashTipoContrato[] {
        const lista: EDashTipoContrato[] = [];
        for (const element of elements) {
            const objeto = EDashTipoContrato.parseJson(element);
            lista.push(objeto);
        }
        return lista;
    }
}