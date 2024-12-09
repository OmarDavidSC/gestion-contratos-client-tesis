export class EDashPorProveedor {
    NombreProveedor: string;
    CantidadContratos: number;

    constructor() {
        this.NombreProveedor = "";
        this.CantidadContratos = 0;
    }

    public static parseJson(element: any): EDashPorProveedor {
        const objeto = new EDashPorProveedor();
        objeto.NombreProveedor = element['nombreProveedor'];
        objeto.CantidadContratos = element['cantidadContratos'];
        return objeto;
    }

    public static parseJsonList(elements: any): EDashPorProveedor[] {
        const lista: EDashPorProveedor[] = [];
        for (const element of elements) {
            const objeto = EDashPorProveedor.parseJson(element);
            lista.push(objeto);
        }
        return lista;
    }
}