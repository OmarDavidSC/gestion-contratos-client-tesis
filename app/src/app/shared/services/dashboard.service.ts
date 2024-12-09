import { Injectable } from "@angular/core";
import "@pnp/sp/sputilities";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from 'rxjs';
import { Lookup } from "../models/base/Lookup";
import { ApiResponse } from "../utils/response";
import { EDashEstado } from "../models/entidades/EDashEstado";
import { EDashPorProveedor } from "../models/entidades/EDashPorProveedor";
import { EDashTipoContrato } from "../models/entidades/EDashTipoContrato";


@Injectable({
    providedIn: "root"
})
export class DashboardService {

    private urlBase = environment.uriApiBack + "DashBoard/";

    constructor(
        private http: HttpClient
    ) {
    }

    async porEstado(): Promise<ApiResponse<EDashEstado[]>> {
        const url = `${this.urlBase}por-estado`;
        const response = await lastValueFrom(this.http.get<ApiResponse<EDashEstado[]>>(url));
        response.data = EDashEstado.parseJsonList(response.data);
        return response;
    }

    async porProveedor(): Promise<ApiResponse<EDashPorProveedor[]>> {
        const url = `${this.urlBase}por-proveedor`;
        const response = await lastValueFrom(this.http.get<ApiResponse<EDashPorProveedor[]>>(url));
        response.data = EDashPorProveedor.parseJsonList(response.data);
        return response;
    }

    async porTipoContrato(): Promise<ApiResponse<EDashTipoContrato[]>> {
        const url = `${this.urlBase}por-tipo`;
        const response = await lastValueFrom(this.http.get<ApiResponse<EDashTipoContrato[]>>(url));
        response.data = EDashTipoContrato.parseJsonList(response.data);
        return response;
    }
}