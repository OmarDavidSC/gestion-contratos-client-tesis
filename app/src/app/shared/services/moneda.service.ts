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
import { EMoneda } from "../models/entidades/EMoneda";


@Injectable({
    providedIn: "root"
})
export class MonedaService {

    private urlBase = environment.uriApiBack + "Moneda/";

    constructor(
        private http: HttpClient
    ) {
    }

    async getItems(valorBusqueda: string): Promise<EMoneda[]>{
        const url = this.urlBase + 'obtener-monedas?valorBusqueda=' + valorBusqueda;
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(EMoneda.parseJson);
    }

    async getItemsMaestro(): Promise<Lookup[]> {
        const url = this.urlBase + 'obtener-monedas?valorBusqueda=';
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(EMoneda.parseJsonLookup);
    }

    async addItem(datos: any): Promise<any> {

        const url = this.urlBase + 'registrar-moneda';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async updateItem(datos: any): Promise<any> {

        const url = this.urlBase + 'editar-moneda';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async deleteItem(id: number): Promise<any> {

        const url = `${this.urlBase}eliminar-moneda/${id}`;
        return await lastValueFrom(this.http.post(url, {}));
    }
}
    