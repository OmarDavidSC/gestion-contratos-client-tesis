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

@Injectable({
    providedIn: "root"
})

export class TipoDocumentoService {
    private urlBase = environment.uriApiBack + "TipoDocumento/";

    constructor(
        private http: HttpClient
    ) {
    }

    async getItems(valorBusqueda: string): Promise<ETipoDocumento[]>{
        const url = this.urlBase + 'obtener-tipo-documento?valorBusqueda=' + valorBusqueda;
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(ETipoDocumento.parseJson);
    }

    async getItemsMaestro(): Promise<Lookup[]> {
        const url = this.urlBase + 'obtener-tipo-documento?valorBusqueda=';
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(ETipoDocumento.parseJsonLookup);
    }

    async addItem(datos: any): Promise<any> {
        const url = this.urlBase + 'registrar-tipo-documento';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async updateItem(datos: any): Promise<any> {

        const url = this.urlBase + 'editar-tipo-documento';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async deleteItem(id: number): Promise<any> {

        const url = `${this.urlBase}eliminar-tipo-documento/${id}`;
        return await lastValueFrom(this.http.post(url, {}));
    }
}