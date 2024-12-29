export class EListContrato {
    Id: string;
    Nombre: number;
    FechaFinReal: any;
    CodigoContrato: string;

    constructor() {
        this.Id = "";
        this.Nombre = 0;
        this.FechaFinReal = "";
        this.CodigoContrato = "";
    }

    public static parseJson(element: any): EListContrato {
        const objeto = new EListContrato();
        objeto.Id = element['id'];
        objeto.Nombre = element['nombre'];
        objeto.FechaFinReal = element['fechaFinReal'];
        objeto.CodigoContrato = element['codigoContrato'];
        return objeto;
    }

    public static parseJsonList(elements: any): EListContrato[] {
        const lista: EListContrato[] = [];
        for (const element of elements) {
            const objeto = EListContrato.parseJson(element);
            lista.push(objeto);
        }
        return lista;
    }
}