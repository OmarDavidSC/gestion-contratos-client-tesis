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
import { EBanco } from "../models/entidades/EBanco";

@Injectable({
    providedIn: "root"
})
export class BancoService {

    private urlBase = environment.uriApiBack + "Banco/";

    constructor(
        private http: HttpClient
    ) {
    }

    async getItems(valorBusqueda: string): Promise<EBanco[]>{
        const url = this.urlBase + 'obtener-bancos?valorBusqueda=' + valorBusqueda;
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(EBanco.parseJson);
    }

    async getItemsMaestro(): Promise<Lookup[]> {
        const url = this.urlBase + 'obtener-bancos?valorBusqueda=';
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(EBanco.parseJsonLookup);
    }

    async addItem(datos: any): Promise<any> {

        const url = this.urlBase + 'registrar-banco';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async updateItem(datos: any): Promise<any> {

        const url = this.urlBase + 'editar-banco';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async deleteItem(id: number): Promise<any> {

        const url = `${this.urlBase}eliminar-banco/${id}`;
        return await lastValueFrom(this.http.post(url, {}));
    }
}
    