import { Injectable } from "@angular/core";
import { MasterService } from "./master.service";
import { sp } from "@pnp/sp";
import { environment } from "src/environments/environment";
import { Constantes } from "../utils/Constantes";
import { Funciones } from "../utils/Funciones";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { Lookup } from "../models/base/Lookup";
import { ETipoContrato } from "../models/entidades/ETIpoContrato";

@Injectable({
    providedIn: "root"
})

export class TipoContratoService {
    private urlBase = environment.uriApiBack + "TipoContrato/";

    constructor(
        private http: HttpClient
    ) {
    }

    async getItems(valorBusqueda: string): Promise<ETipoContrato[]>{
        const url = this.urlBase + 'obtener-tipo-contrato?valorBusqueda=' + valorBusqueda;
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(ETipoContrato.parseJson);
    }

    async getItemsMaestro(): Promise<Lookup[]> {
        const url = this.urlBase + 'obtener-tipo-contrato?valorBusqueda=';
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(ETipoContrato.parseJsonLookup);
    }

    async addItem(datos: any): Promise<any> {
        const url = this.urlBase + 'registrar-tipo-contrato';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async updateItem(datos: any): Promise<any> {

        const url = this.urlBase + 'editar-tipo-contrato';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async deleteItem(id: number): Promise<any> {

        const url = `${this.urlBase}eliminar-tipo-contrato/${id}`;
        return await lastValueFrom(this.http.post(url, {}));
    }
}