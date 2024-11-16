import { Injectable } from "@angular/core";
import { MasterService } from "./master.service";
import { sp } from "@pnp/sp";
import { environment } from "src/environments/environment";
import { Constantes } from "../utils/Constantes";
import { Funciones } from "../utils/Funciones";
import { EParametro } from "../models/entidades/EParametro";

@Injectable({
    providedIn: "root"
})

export class ParametroService {
    constructor(public masterService: MasterService) {
        sp.setup({
            sp: {
                baseUrl: `${environment.proxyUrl}`
            }
        })
    }

    async getItems(): Promise<EParametro[]> {
        let lista: EParametro[] = [];

        const selectFields = EParametro.getColumnasSelect();

        let query = sp.web.lists.getByTitle(Constantes.listas.AdmParametros).items.select(...selectFields).orderBy(Constantes.columnas.Title, true);

        let items = await query.top(5000).getPaged().then(p => {
            return p
        })

        if (items.results.length > 0) {
            lista = EParametro.parseJsonList(items.results);

        }

        return lista;
    }

    async getItemsFilter(texto: string): Promise<EParametro[]> {
        let lista: EParametro[] = [];

        const selectFields = EParametro.getColumnasSelect();
        let filterFields = "Title ne null";

        if (!Funciones.esUndefinedNullOrEmpty(texto)) {
            filterFields = "substringof('" + texto + "', Title)";

        }

        const query = sp.web.lists.getByTitle(Constantes.listas.AdmParametros).items.select(...selectFields).filter(filterFields).orderBy(Constantes.columnas.Title, true);

        const items = await query.getPaged().then(p => {
            return p;
        });

        if (items.results.length > 0) {
            lista = EParametro.parseJsonList(items.results);
        };

        return lista;
    }

    async addItem(datos: any): Promise<number> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmParametros).items.add(datos);
        return result.data.Id as number;
    }

    async updateItem(id: number, datos: any): Promise<any> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmParametros).items.getById(id).update(datos);
        return result.data;
    }

    async deleteItem(id: number): Promise<any> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmParametros).items.getById(id).delete();
        return result;
    }
}