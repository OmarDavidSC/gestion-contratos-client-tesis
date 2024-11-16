import { Injectable } from "@angular/core";
import { sp } from "@pnp/sp";
import "@pnp/sp/sputilities";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { EUsuario } from "../models/entidades/EUsuario";
import { environment } from "src/environments/environment";
import { Constantes } from "../utils/Constantes";
import { MasterService } from "./master.service";
import { SPUser } from "../models/base/SPUser";
import { EArea } from "../models/entidades/EArea";
import { Funciones } from "../utils/Funciones";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from 'rxjs';
import { Lookup } from "../models/base/Lookup";
import { ETipoPoliza } from "../models/entidades/ETipoPoliza";


@Injectable({
    providedIn: "root"
})
export class TipoPolizaService {

    private urlBase = environment.uriApiBack + "TipoPoliza/";

    constructor(
        private http: HttpClient
    ) {
    }

    async getItems(valorBusqueda: string): Promise<ETipoPoliza[]>{
        const url = this.urlBase + 'obtener-tipo-poliza?valorBusqueda=' + valorBusqueda;
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(ETipoPoliza.parseJson);
    }

    async getItemsMaestro(): Promise<Lookup[]> {
        const url = this.urlBase + 'obtener-tipo-poliza?valorBusqueda=';
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(ETipoPoliza.parseJsonLookup);
    }

    async addItem(datos: any): Promise<any> {
        const url = this.urlBase + 'registrar-tipo-poliza';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async updateItem(datos: any): Promise<any> {

        const url = this.urlBase + 'editar-tipo-poliza';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async deleteItem(id: number): Promise<any> {

        const url = `${this.urlBase}eliminar-tipo-poliza/${id}`;
        return await lastValueFrom(this.http.post(url, {}));
    }
}
    