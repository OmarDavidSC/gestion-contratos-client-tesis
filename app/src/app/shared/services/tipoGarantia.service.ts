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
import { ETipoGarantia } from "../models/entidades/ETIpoGarantia";

@Injectable({
    providedIn: "root"
})

export class TipoGarantiaService {
    private urlBase = environment.uriApiBack + "TipoGarantia/";

    constructor(
        private http: HttpClient
    ) {
    }

    async getItems(valorBusqueda: string): Promise<ETipoGarantia[]>{
        const url = this.urlBase + 'obtener-tipo-garantia?valorBusqueda=' + valorBusqueda;
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(ETipoGarantia.parseJson);
    }

    async getItemsMaestro(): Promise<Lookup[]> {
        const url = this.urlBase + 'obtener-tipo-garantia?valorBusqueda=';
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(ETipoGarantia.parseJsonLookup);
    }

    async addItem(datos: any): Promise<any> {
        const url = this.urlBase + 'registrar-tipo-garantia';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async updateItem(datos: any): Promise<any> {

        const url = this.urlBase + 'editar-tipo-garantia';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async deleteItem(id: number): Promise<any> {

        const url = `${this.urlBase}eliminar-tipo-garantia/${id}`;
        return await lastValueFrom(this.http.post(url, {}));
    }
}