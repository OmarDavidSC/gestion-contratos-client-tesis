import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EDatosContrato } from '../models/entidades/EDatosContrato';
import { lastValueFrom } from 'rxjs';
import { ApiResponse } from '../utils/response';
import { ENotificaciones } from '../models/entidades/ENotificaciones';

@Injectable({
  providedIn: 'root'
})
export class DatosContratoService {

  private urlBase = environment.uriApiBack + "Contrato/";

  constructor(
    private http: HttpClient
  ) { }

  async getItem(id: any): Promise<EDatosContrato> {

    const url = this.urlBase + 'obtener-contrato/' + id;
    const response = await lastValueFrom(this.http.get<any[]>(url));
    return EDatosContrato.parseJson(response);
  }

  async getItems(): Promise<EDatosContrato[]> {

    const url = this.urlBase + "obtener-contrato-bandeja";
    const response = await lastValueFrom(this.http.get<any[]>(url));
    return response.map(EDatosContrato.parseJson);
  }

  async getItemsBandeja(datos: any): Promise<EDatosContrato[]> {
    const url = this.urlBase + "obtener-contrato-bandeja";
    const response = await lastValueFrom(this.http.post<any[]>(url, datos));
    return response.map(EDatosContrato.parseJsonBandeja);
  }

  async addItem(datos: any): Promise<any> {

    const url = this.urlBase + 'registrar-contrato';
    return await lastValueFrom(this.http.post(url, datos));
  }

  async updateItem(datos: any): Promise<any> {

    const url = this.urlBase + 'editar-contrato';
    return await lastValueFrom(this.http.post(url, datos));
  }

  async accionContrato(datos: any): Promise<any> {

    const url = this.urlBase + 'accion-contrato';
    return await lastValueFrom(this.http.post(url, datos));
  }

  async guardarContrato(datos: any): Promise<any> {

    const url = this.urlBase + 'guardar-contrato';
    return await lastValueFrom(this.http.post(url, datos));
  }

  async notifications(): Promise<ApiResponse<ENotificaciones[]>> {
    const url = `${this.urlBase}notifications`;
    const response = await lastValueFrom(this.http.get<ApiResponse<ENotificaciones[]>>(url));
    response.data = ENotificaciones.parseJsonList(response.data);
    return response;
  }

}
