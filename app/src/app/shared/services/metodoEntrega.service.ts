import { Injectable } from "@angular/core";
import { MasterService } from "./master.service";
import { sp } from "@pnp/sp";
import { environment } from "src/environments/environment";
import { ETipoDocumento } from "../models/entidades/ETipoDocumento";
import { Constantes } from "../utils/Constantes";
import { Funciones } from "../utils/Funciones";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { Lookup } from "../models/base/Lookup";
import { EMetodoEntrega } from "../models/entidades/EMetodoEntrega";

@Injectable({
    providedIn: "root"
})

export class MetodoEntregaService {
    private urlBase = environment.uriApiBack + "MetodoEntrega/";

    constructor(
        private http: HttpClient
    ) {
    }

    async getItems(valorBusqueda: string): Promise<EMetodoEntrega[]>{
        const url = this.urlBase + 'obtener-metodo-entregas?valorBusqueda=' + valorBusqueda;
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(EMetodoEntrega.parseJson);
    }

    async getItemsMaestro(): Promise<Lookup[]> {
        const url = this.urlBase + 'obtener-metodo-entregas?valorBusqueda=';
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(EMetodoEntrega.parseJsonLookup);
    }

    async addItem(datos: any): Promise<any> {
        const url = this.urlBase + 'registrar-metodo-entrega';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async updateItem(datos: any): Promise<any> {

        const url = this.urlBase + 'editar-metodo-entrega';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async deleteItem(id: number): Promise<any> {

        const url = `${this.urlBase}eliminar-metodo-entrega/${id}`;
        return await lastValueFrom(this.http.post(url, {}));
    }
}