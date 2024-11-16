import { Injectable } from "@angular/core";
import { MasterService } from "./master.service";
import { sp } from "@pnp/sp";
import { environment } from "src/environments/environment";
import { EHistorial } from "../models/entidades/EHistorial";
import { Constantes } from "../utils/Constantes";

@Injectable({
    providedIn: "root"
})
export class HistorialService {
    constructor(public masterService: MasterService) {
        sp.setup({
            sp: {
                baseUrl: `${environment.proxyUrl}`
            }
        });
    }

   /* async getItems(idDatoDocumento : number): Promise<EHistorial[]> {

        let Lista: EHistorial[] = [];

        let filterFields = "DatoDocumentoId eq " + idDatoDocumento;
        //const selectFields = EHistorial.getColumnasSelect();
        //const expandFields = EHistorial.getColumnasExpand();

        let query = sp.web.lists.getByTitle(Constantes.listas.Historial).items.select(...selectFields).expand(...expandFields).filter(filterFields).orderBy(Constantes.columnas.ID, false);

        let items = await query.top(5000).getPaged().then(p => {
            return p;
        });

        if (items.results.length > 0) {
            Lista = EHistorial.parseJsonList(items.results);
        }

        return Lista;
    }*/

    async addItem(datos: any): Promise<number> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.Historial).items.add(datos);
        return result.data.Id as number;
    }
}