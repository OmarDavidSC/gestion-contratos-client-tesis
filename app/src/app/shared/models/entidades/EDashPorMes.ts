export class EDashPorMes {
    Anio: number;
    Mes: number;
    CantidadContratos: number

    constructor() {
        this.Anio = 0;
        this.Mes = 0;
        this.CantidadContratos = 0;
    }

    public static parseJson(element: any): EDashPorMes {
        const objeto = new EDashPorMes();
        objeto.Anio = element['anio'];
        objeto.Mes = element['mes'];
        objeto.CantidadContratos = element['cantidadContratos'];
        return objeto;
    }

    public static parseJsonList(elements: any): EDashPorMes[] {
        const lista: EDashPorMes[] = [];
        for (const element of elements) {
            const objeto = EDashPorMes.parseJson(element);
            lista.push(objeto);
        }
        return lista;
    }
}