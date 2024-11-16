import { Injectable } from "@angular/core";
import { MasterService } from "./master.service";
import { sp } from "@pnp/sp";
import { environment } from "src/environments/environment";
import { EMotivo } from "../models/entidades/EMotivo";
import { Constantes } from "../utils/Constantes";
import { Funciones } from "../utils/Funciones";

@Injectable({
    providedIn: "root"
})
export class MotivoService {
    constructor(public masterService: MasterService) {
        sp.setup({
            sp: {
                baseUrl: `${environment.proxyUrl}`
            }
        });
    }

    async getItems(): Promise<EMotivo[]> {

        let Lista: EMotivo[] = [];

        const selectFields = EMotivo.getColumnasSelect();

        let query = sp.web.lists.getByTitle(Constantes.listas.AdmMotivo).items.select(...selectFields).orderBy(Constantes.columnas.Title, true);

        let items = await query.top(5000).getPaged().then(p => {
            return p;
        });


        if (items.results.length > 0) {
            Lista = EMotivo.parseJsonList(items.results);
        }

        return Lista;
    }

    async getItemsFilter(texto: string): Promise<EMotivo[]> {
        let Lista: EMotivo[] = [];

        const selectFields = EMotivo.getColumnasSelect();
        let filterFields = "Title ne null";

        if (!Funciones.esUndefinedNullOrEmpty(texto)) {
            filterFields = "substringof('" + texto + "', Title)";
        }

        const query = sp.web.lists.getByTitle(Constantes.listas.AdmMotivo).items.select(...selectFields).filter(filterFields).orderBy(Constantes.columnas.Title, true);

        const items = await query.getPaged().then(p => {
            return p;
        });

        if (items.results.length > 0) {
            Lista = EMotivo.parseJsonList(items.results);
        }

        return Lista;
    }

    async addItem(datos: any): Promise<number> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmMotivo).items.add(datos);
        return result.data.Id as number;
    }

    async updateItem(id: number, datos: any): Promise<any> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmMotivo).items.getById(id).update(datos);
        return result.data;
    }

    async deleteItem(id: number): Promise<any> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmMotivo).items.getById(id).delete();
        return result;
    }
}