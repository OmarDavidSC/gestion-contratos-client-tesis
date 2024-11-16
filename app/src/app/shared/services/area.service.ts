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
import { EArea } from "../models/entidades/EArea";
import { Funciones } from "../utils/Funciones";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from 'rxjs';
import { Lookup } from "../models/base/Lookup";

@Injectable({
    providedIn: "root"
})
export class AreaService {

    private urlBase = environment.uriApiBack + "Area/";

    constructor(
        private http: HttpClient
    ) {
    }

    async getItems(valorBusqueda: string): Promise<EArea[]> {
        const url = this.urlBase + 'obtener-areas?valorBusqueda=' + valorBusqueda;
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(EArea.parseJson);
    }

    async getItemsMaestro(): Promise<Lookup[]> {

        const url = this.urlBase + 'obtener-areas?valorBusqueda=';
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(EArea.parseJsonLookup);
    }

    //este es un cambio en mi rama omar-dev

    async addItem(datos: any): Promise<any> {

        const url = this.urlBase + 'registrar-area';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async updateItem(datos: any): Promise<any> {

        const url = this.urlBase + 'editar-area';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async deleteItem(id: number): Promise<any> {

        const url = `${this.urlBase}eliminar-area/${id}`;
        return await lastValueFrom(this.http.post(url, {}));
    }
}
