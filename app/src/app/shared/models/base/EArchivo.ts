export class EArchivo {
    Id: number;
    Archivo: any;
    NombreArchivo: string;
    TipoArchivo: string;
    UrlArchivo: string;
    Eliminado: boolean;
    PuedeEliminar: boolean;
    PuedeDescargar: boolean;

    constructor() {
        this.Id = 0;
        this.Archivo = null;
        this.NombreArchivo = '';     
        this.TipoArchivo = ''; 
        this.UrlArchivo = '';
        this.Eliminado = false;
        this.PuedeEliminar = false;
        this.PuedeDescargar = false;
    }

    public static parseJson(element: EArchivo): EArchivo {

        const objeto = {
            Id: element.Id,
            Archivo: element.Archivo,
            NombreArchivo: element.NombreArchivo,
            TipoArchivo: element.TipoArchivo,
            UrlArchivo: element.UrlArchivo,
            Eliminado: element.Eliminado,
            PuedeEliminar: element.PuedeEliminar,
            PuedeDescargar: element.PuedeDescargar
        };

        return objeto;
    }

    public static parseJsonList(elements: EArchivo[]): EArchivo[] {

        const lista: EArchivo[] = [];

        for (const element of elements) {
            const objeto = EArchivo.parseJson(element);
            lista.push(objeto);
        }
        return lista;
    }
}