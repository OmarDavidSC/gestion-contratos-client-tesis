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
import { ESistemaContratacion } from "../models/entidades/ESistemaContratacion";

@Injectable({
    providedIn: "root"
})

export class SistemaContratacionService {
    private urlBase = environment.uriApiBack + "SistemaContratacion/";

    constructor(
        private http: HttpClient
    ) {
    }

    async getItems(valorBusqueda: string): Promise<ESistemaContratacion[]>{
        const url = this.urlBase + 'obtener-sistema-contrataciones?valorBusqueda=' + valorBusqueda;
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(ESistemaContratacion.parseJson);
    }

    async getItemsMaestro(): Promise<Lookup[]> {
        const url = this.urlBase + 'obtener-sistema-contrataciones?valorBusqueda=';
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(ESistemaContratacion.parseJsonLookup);
    }

    async addItem(datos: any): Promise<any> {
        const url = this.urlBase + 'registrar-sistema-contratacion';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async updateItem(datos: any): Promise<any> {

        const url = this.urlBase + 'editar-sistema-contratacion';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async deleteItem(id: number): Promise<any> {

        const url = `${this.urlBase}eliminar-sistema-contratacion/${id}`;
        return await lastValueFrom(this.http.post(url, {}));
    }
}