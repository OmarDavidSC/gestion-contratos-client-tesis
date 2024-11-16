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
import { ECompaniaAseguradora } from "../models/entidades/ECompaniaAseguradora";


@Injectable({
    providedIn: "root"
})
export class CompaniaAseguradoraService {

    private urlBase = environment.uriApiBack + "CompaniaAseguradora/";

    constructor(
        private http: HttpClient
    ) {
    }

    async getItems(valorBusqueda: string): Promise<ECompaniaAseguradora[]>{
        const url = this.urlBase + 'obtener-compania-aseguradoras?valorBusqueda=' + valorBusqueda;
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(ECompaniaAseguradora.parseJson);
    }

    async getItemsMaestro(): Promise<Lookup[]> {
        const url = this.urlBase + 'obtener-compania-aseguradoras?valorBusqueda=';
        const response = await lastValueFrom(this.http.get<any[]>(url));
        return response.map(ECompaniaAseguradora.parseJsonLookup);
    }

    async addItem(datos: any): Promise<any> {

        const url = this.urlBase + 'registrar-compania-aseguradora';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async updateItem(datos: any): Promise<any> {

        const url = this.urlBase + 'editar-compania-aseguradora';
        return await lastValueFrom(this.http.post(url, datos));
    }

    async deleteItem(id: number): Promise<any> {

        const url = `${this.urlBase}eliminar-compania-aseguradora/${id}`;
        return await lastValueFrom(this.http.post(url, {}));
    }
}
    