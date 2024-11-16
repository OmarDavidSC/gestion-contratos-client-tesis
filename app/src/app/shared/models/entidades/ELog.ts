import { ListItem } from './../base/ListItem';
import { IListItemTransaccional } from './../base/IListItemTransaccional';
import { Constantes } from './../../utils/Constantes';

export class ELog extends ListItem implements IListItemTransaccional {
    descripcion: string;
    pagina: string;

    constructor() {
        super();

        this.Title = "";
        this.descripcion = "";
        this.pagina = "";
    }

    public static setNuevoElemento(pagina: string, titulo: string, descripcion: string): ELog {
        const objeto = new ELog();
        objeto.descripcion = JSON.stringify(descripcion);
        objeto.pagina = pagina;
        objeto.Title = titulo;

        return objeto;
    }

    public getJsonElemento(): any {
        const datos : any = {};
        datos["DescripcionError"] = this.descripcion;
        datos["Modulo"] = this.pagina;
        datos[Constantes.columnas.Title] = this.Title;

        return datos;
    }
}