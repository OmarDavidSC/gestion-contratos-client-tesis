export class EDashEstado {
    Estado: string;
    Cantidad: number;

    constructor() {
        this.Estado = "";
        this.Cantidad = 0;
    }

    public static parseJson(element: any): EDashEstado {
        const objeto = new EDashEstado();
        objeto.Estado = element['estado'];
        objeto.Cantidad = element['cantidad'];
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