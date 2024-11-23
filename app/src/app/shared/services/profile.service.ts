import { Injectable } from "@angular/core";
import { sp, PrincipalType, PrincipalSource, IPrincipalInfo } from "@pnp/sp";
import "@pnp/sp/sputilities";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { PagedItemCollection } from "@pnp/sp/items";
import pnp from "@pnp/pnpjs";
import { EUsuario } from "./../models/entidades/EUsuario";
import { environment } from "src/environments/environment";
import { Constantes } from "../utils/Constantes";
import { User } from "../models/base/User";
import { Deferred } from "ts-deferred";
import { MasterService } from "./master.service";
import { SPUser } from "../models/base/SPUser";
import { Funciones } from "../utils/Funciones";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { ESesion } from "../models/entidades/Sesion";
import { Lookup } from "../models/base/Lookup";
import { ApiResponse } from "../utils/response";

@Injectable({
    providedIn: "root"
})
export class ProfileService {

    private urlBase = environment.uriApiBack + "Perfil/";

    constructor(
        private http: HttpClient) {

    }

    async show(id: number): Promise<ApiResponse<EUsuario>> {
        const url = `${this.urlBase}show/${id}`;
        const response = await lastValueFrom(this.http.get<ApiResponse<EUsuario>>(url));
        response.data = EUsuario.parseJson(response.data);
        return response;
    }

    async update(datos: any): Promise<ApiResponse<any>> {
        const url = this.urlBase + 'update';
        return await lastValueFrom(this.http.post<ApiResponse<any>>(url, datos));
    }


}