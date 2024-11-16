import { Injectable } from "@angular/core";
import { sp } from "@pnp/sp";
import "@pnp/sp/sputilities";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { EUsuario } from "./../models/entidades/EUsuario";
import { environment } from "src/environments/environment";
import { Constantes } from "../utils/Constantes";
import { MasterService } from "./master.service";
import { SPUser } from "../models/base/SPUser";
import { Funciones } from "../utils/Funciones";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from 'rxjs';
import { EPuesto } from "../models/entidades/EPuesto";

@Injectable({
    providedIn: "root"
})
export class PuestoService {

    private urlBase = environment.uriApiBack + "Puesto/";

    constructor(
        private http: HttpClient
    ) {
    }

    async getItems(): Promise<EPuesto[]> {
        const url = this.urlBase + 'obtener-puestos';
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(EPuesto.parseJson);
    }

    async getItemsFilter(texto: string): Promise<EPuesto[]> {
        let Lista: EPuesto[] = [];

        const selectFields = EPuesto.getColumnasSelect();
        let filterFields = "Title ne null";

        if (!Funciones.esUndefinedNullOrEmpty(texto)) {
            filterFields = "substringof('" + texto + "', Title) or substringof('" + texto + "', Codigo)";
        }

        const query = sp.web.lists.getByTitle(Constantes.listas.AdmAreas).items.select(...selectFields).filter(filterFields).orderBy(Constantes.columnas.Title, true);

        const items = await query.getPaged().then(p => {
            return p;
        });

        if (items.results.length > 0) {
            Lista = EPuesto.parseJsonList(items.results);
        }

        return Lista;
    }

    async addItem(datos: any): Promise<number> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmAreas).items.add(datos);
        return result.data.Id as number;
    }

    async updateItem(id: number, datos: any): Promise<any> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmAreas).items.getById(id).update(datos);
        return result.data;
    }

    async deleteItem(id: number): Promise<any> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmAreas).items.getById(id).delete();
        return result;
    }
}
