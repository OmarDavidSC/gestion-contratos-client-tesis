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
import { EUsuarioLookup } from "../models/entidades/EUsuarioLookup";

@Injectable({
  providedIn: "root"
})
export class UsuarioService {

  private urlBase = environment.uriApiBack + "Usuario/";

  constructor(
    private http: HttpClient) {

  }

  async searchUser(searchValue: string, groupName?: string): Promise<User[]> {
    try {
      const prefixUrl = `${environment.proxyUrl}${environment.webRelativeUrl}` + "/_layouts/15/userphoto.aspx?size=S&accountname=",
        url = `${environment.proxyUrl}${environment.webRelativeUrl}` + "/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser";

      let principals: IPrincipalInfo[] = await pnp.sp.utility.searchPrincipals(searchValue, PrincipalType.User, PrincipalSource.All, groupName || "", 10);

      return principals.map(entity => {
        let EmailCorrecto = "";
        if (entity.LoginName) {
          EmailCorrecto = entity.LoginName.replace("i:0#.f|membership|", "");
        }
        return <User>{
          Id: entity.PrincipalId,
          Key: entity.LoginName,
          Name: entity.DisplayName,
          Title: entity.DisplayName,
          Email: EmailCorrecto,
          PictureUrl: prefixUrl + EmailCorrecto
        };
      });
    } catch (err: any) {
      if (err.status !== 403) {
        throw err;
      }
      return await this.searchUser(searchValue, groupName);
    }
  }

  async getUserIdEnsure(email: string): Promise<number> {
    return pnp.sp.site.rootWeb.ensureUser(email).then(result => {
      return result.data.Id;
    });
  }

  async getCurrentUser(): Promise<EUsuarioLookup> {
    const valorIdUsuario = localStorage.getItem("IdUsuario");
    const valorUsuario = localStorage.getItem("Usuario");
    let usuario = new EUsuarioLookup();

    if (valorUsuario == null) {
      const idUsuario = JSON.parse(valorIdUsuario);
      const url = this.urlBase + 'obtener-usuario/' + idUsuario;
      const response = await lastValueFrom(this.http.get<any>(url));
      localStorage.setItem("Usuario", JSON.stringify(response));
      usuario = EUsuarioLookup.parseJson(response);
    }
    else {
      const response = JSON.parse(valorUsuario);
      usuario = EUsuarioLookup.parseJson(response);
    }

    return usuario;
  }

  async saveUserSession(user: User) {
    localStorage.setItem("IdUsuario", JSON.stringify(user));
  }

  async getItems(valorBusqueda: string): Promise<EUsuario[]> {
    const url = this.urlBase + 'obtener-usuarios?valorBusqueda=' + valorBusqueda;
    const response = await lastValueFrom(this.http.get<any[]>(url));
    return response.map(EUsuario.parseJson);
  }

  async getItemsMaestro(): Promise<Lookup[]> {

    const url = this.urlBase + 'obtener-usuarios?valorBusqueda=';
    const response = await lastValueFrom(this.http.get<any[]>(url));
    return response.map(EUsuario.parseJsonLookup);
  }


  async addItem(datos: any): Promise<any> {
    const url = this.urlBase + 'registrar-usuario';
    return await lastValueFrom(this.http.post(url, datos));
  }

  async updateItem(datos: any): Promise<any> {
    const url = this.urlBase + 'editar-usuario';
    return await lastValueFrom(this.http.post(url, datos));
  }

  async deleteItem(id: number): Promise<any> {
    const url = `${this.urlBase}eliminar-usuario/${id}`;
    return await lastValueFrom(this.http.post(url, {}));
  }

  async vemail(datos: any): Promise<ApiResponse<EUsuario>> {
    const url = this.urlBase + 'vemail';
    const response = await lastValueFrom(this.http.post<ApiResponse<EUsuario>>(url, datos));
    if (!response.success) {
      response.data = new EUsuario();
    } else {
      response.data = EUsuario.parseJson(response.data);
    }
    return response
  }

  async restore(datos: any): Promise<ApiResponse<any>> {
    const url = this.urlBase + 'restablecer-contrasena';
    return await lastValueFrom(this.http.post<ApiResponse<any>>(url, datos));
  }

  compare(a, b) {
    if (a.OrdenOpcion < b.OrdenOpcion) {
      return -1;
    }
    if (a.OrdenOpcion > b.OrdenOpcion) {
      return 1;
    }
    return 0;
  }
}